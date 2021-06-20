use tokio::sync::{mpsc, RwLock};

use tokio_stream::wrappers::UnboundedReceiverStream;

use futures::{FutureExt, StreamExt};

use warp::{
    ws::{Message, WebSocket},
    Filter,
};

use serde::{Deserialize, Serialize};

use serde_json::Value;

use std::{collections::HashMap, sync::atomic::AtomicUsize, sync::atomic::Ordering, sync::Arc};

static NEXT_USER_ID: AtomicUsize = AtomicUsize::new(1);

#[derive(Debug, PartialEq, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct User {
    id: usize,
    username: String,
    color: String,
    censor_user_content: bool,
}

type Users = Arc<RwLock<HashMap<usize, User>>>;

type ConnectedClients =
    Arc<RwLock<HashMap<usize, mpsc::UnboundedSender<Result<Message, warp::Error>>>>>;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct LoginToGame {
    username: String,
    color: String,
    censor_user_content: bool,
}

#[derive(Serialize)]
struct LoginSucceeded {
    _message: String,
    user: User,
}

#[derive(Serialize)]
struct LoginRejected {
    _message: String,
    reason: String,
}

#[derive(Serialize)]
struct AddGamePlayer {
    _message: String,
    user: User,
}

#[derive(Serialize)]
struct RemoveGamePlayer {
    _message: String,
    id: usize,
}

#[tokio::main]
async fn main() {
    env_logger::init();

    let connected_clients = ConnectedClients::default();
    let connected_clients = warp::any().map(move || connected_clients.clone());

    let users: Users = Users::default();
    let users = warp::any().map(move || users.clone());

    let websocket = warp::path("test")
        .and(warp::ws())
        .and(connected_clients)
        .and(users)
        .map(|ws: warp::ws::Ws, connected_clients, users| {
            ws.on_upgrade(move |socket| client_connected(socket, connected_clients, users))
        });

    warp::serve(websocket).run(([127, 0, 0, 1], 3030)).await;
}

async fn client_connected(ws: WebSocket, connected_clients: ConnectedClients, users: Users) {
    let my_id = NEXT_USER_ID.fetch_add(1, Ordering::Relaxed);

    eprintln!("Connection {} initialized", my_id);

    let (user_ws_tx, mut user_ws_rx) = ws.split();

    let (tx, rx) = mpsc::unbounded_channel();
    let rx = UnboundedReceiverStream::new(rx);

    tokio::task::spawn(rx.forward(user_ws_tx).map(|result| {
        if let Err(e) = result {
            eprintln!("websocket send error: {}", e);
        }
    }));

    connected_clients.write().await.insert(my_id, tx);

    while let Some(result) = user_ws_rx.next().await {
        let msg = match result {
            Ok(msg) => msg,
            Err(e) => {
                eprintln!("websocket error (uid={}): {}", my_id, e);
                break;
            }
        };

        handle_calls(connected_clients.clone(), users.clone(), msg, my_id).await;
    }

    client_disconnected(my_id, &connected_clients, users).await;
}

async fn handle_calls(
    connected_clients: ConnectedClients,
    users: Users,
    msg: Message,
    my_id: usize,
) {
    let msg = if let Ok(s) = msg.to_str() {
        s
    } else {
        return;
    };

    let resp: Value = serde_json::from_str(msg).unwrap();

    match resp["_message"].as_str() {
        Some("C_LoginToGame") => {
            login_to_game(connected_clients.clone(), users.clone(), my_id.clone(), msg).await
        }
        _ => (),
    }
}

async fn login_to_game(connected_clients: ConnectedClients, users: Users, my_id: usize, msg: &str) {
    let connected_client_temp = connected_clients.read().await;
    let me = connected_client_temp.get(&my_id).unwrap();

    let resp: Result<LoginToGame, serde_json::Error> = serde_json::from_str(msg);
    match resp {
        Ok(resp) => match user_connect(connected_clients.clone(), users.clone(), my_id, resp).await
        {
            Ok(user) => {
                let resp = LoginSucceeded {
                    _message: "S_ConfirmGameLogin".to_string(),
                    user,
                };
                let resp_text = serde_json::to_string(&resp).unwrap();
                me.send(Ok(Message::text(&resp_text))).unwrap();
            }

            // Return a failed connect call
            Err(err) => {
                let resp = LoginRejected {
                    _message: "S_DenyGameLogin".to_string(),
                    reason: format!("{:?}", err),
                };
                let resp_text = serde_json::to_string(&resp).unwrap();
                me.send(Ok(Message::text(&resp_text))).unwrap();
            }
        },

        // Return a failed connect call
        Err(err) => {
            let resp = LoginRejected {
                _message: "S_DenyGameLogin".to_string(),
                reason: format!("{:?}", err),
            };
            let resp_text = serde_json::to_string(&resp).unwrap();
            me.send(Ok(Message::text(&resp_text))).unwrap();
        }
    }
}

async fn client_disconnected(my_id: usize, connected_clients: &ConnectedClients, users: Users) {
    eprintln!("User with id #{} disconnected", &my_id);
    eprintln!("Connection {} disconnected", my_id);
    users.write().await.remove(&my_id);
    connected_clients.write().await.remove(&my_id);

    for (&uid, tx) in connected_clients.read().await.iter() {
        if users.read().await.contains_key(&uid) {
            let resp = RemoveGamePlayer {
                _message: "S_RemoveGamePlayer".to_string(),
                id: my_id,
            };
            let resp_text = serde_json::to_string(&resp).unwrap();

            tx.send(Ok(Message::text(&resp_text))).unwrap();
        }
    }
}

async fn user_connect(
    connected_clients: ConnectedClients,
    users: Users,
    my_id: usize,
    resp: LoginToGame,
) -> Result<User, String> {
    //TODO: Filter Inappropriate usernames

    let user = User {
        id: my_id,
        username: resp.username,
        color: resp.color,
        censor_user_content: resp.censor_user_content,
    };

    for (_, j) in users.read().await.iter() {
        if j.username == user.username && j.id != user.id {
            return Err("User already exists".to_string());
        }
    }

    if users.read().await.get(&my_id).is_none() {
        users.write().await.insert(my_id, user.clone());
    } else if !(users.read().await.get(&my_id).unwrap() == &user) {
        return Err("User is different than stored user".to_string());
    }

    let censorer = censor::Standard + censor::Sex;

    for (&uid, tx) in connected_clients.read().await.iter() {
        if users.read().await.contains_key(&uid) && user.id != uid {
            let should_censor = users.read().await.get(&uid).unwrap().censor_user_content;

            let mut user = user.clone();

            if should_censor {
                user.username = censorer.censor(&user.username);
            }

            let resp = AddGamePlayer {
                _message: "S_AddGamePlayer".to_string(),
                user,
            };
            let resp_text = serde_json::to_string(&resp).unwrap();

            if let Err(_) = tx.send(Ok(Message::text(&resp_text))) {}
        }
    }

    eprintln!("User '{}' with id #{} Initialized", user.username, user.id);

    Ok(user)
}
