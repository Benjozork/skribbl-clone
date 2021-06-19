use tokio::sync::{RwLock, mpsc};

use tokio_stream::wrappers::UnboundedReceiverStream;

use futures::{FutureExt, StreamExt};

use warp::{
    Filter,
    ws::{WebSocket, Message}
};

use serde::{Deserialize, Serialize};

use serde_json::Value;

use std::{
    sync::Arc,
    collections::HashMap,
    sync::atomic::AtomicUsize,
    sync::atomic::Ordering
};

static NEXT_USER_ID: AtomicUsize = AtomicUsize::new(1);

type Users = Arc<RwLock<HashMap<usize, String>>>;

type ConnectedClients = Arc<RwLock<HashMap<usize, mpsc::UnboundedSender<Result<Message, warp::Error>>>>>;

#[derive(Deserialize)]
struct LoginToGame {
    username: String,
    color: String,
}

#[derive(Serialize)]
struct LoginSucceeded {
    _message: String,
}

#[derive(Serialize)]
struct LoginRejected {
    _message: String,
    reason: String,
}

#[tokio::main]
async fn main() {
    env_logger::init();

    let connected_clients = ConnectedClients::default();
    let connected_clients = warp::any().map(move || connected_clients.clone());

    let users: Users = Arc::from(RwLock::from(HashMap::new()));
    let users = warp::any().map(move || users.clone());


    let websocket = warp::path("test")
        .and(warp::ws())
        .and(connected_clients)
        .and(users)
        .map(|ws: warp::ws::Ws, connected_clients, users| {
            ws.on_upgrade(move |socket| client_connected(socket, connected_clients, users))
        });

    warp::serve(websocket)
        .run(([127, 0, 0, 1], 3030))
        .await;
}

async fn client_connected(ws: WebSocket, connected_clients: ConnectedClients, users: Users) {
    let my_id = NEXT_USER_ID.fetch_add(1, Ordering::Relaxed);

    eprintln!("User {} initialized", my_id);

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

        let connected_clients = connected_clients.read().await;
        let me = connected_clients.get(&my_id).unwrap();

        eprintln!("Received {} from ws", msg.to_str().unwrap());

        let resp: Value = serde_json::from_str(msg.to_str().unwrap()).unwrap();

        match resp["_message"].as_str() {
            Some("C_LoginToGame") => {
                let resp: Result<LoginToGame, serde_json::Error> = serde_json::from_str(msg.to_str().unwrap());
                match resp {
                    Ok(resp) => {
                        match user_connect(users.clone(), my_id, resp).await {
                            Ok(_) => {
                                let resp = LoginSucceeded { _message: "S_ConfirmGameLogin".to_string() };
                                let resp_text = serde_json::to_string(&resp).unwrap();
                                me.send(Ok(Message::text(&resp_text)));
                            },

                            // Return a failed connect call.
                            Err(err) => {
                                let resp = LoginRejected {
                                    _message: "S_DenyGameLogin".to_string(),
                                    reason: format!("{:?}", err),
                                };
                                let resp_text = serde_json::to_string(&resp).unwrap();
                                me.send(Ok(Message::text(&resp_text)));
                            },
                        }
                    },

                    // Return a failed connect call.
                    Err(err) => {
                        let resp = LoginRejected {
                            _message: "S_DenyGameLogin".to_string(),
                            reason: format!("{:?}", err),
                        };
                        let resp_text = serde_json::to_string(&resp).unwrap();
                        me.send(Ok(Message::text(&resp_text)));
                    },
                }
            },
            _ => (),
        }

        eprintln!("{:?}", resp);
    }

    client_disconnected(my_id, &connected_clients).await;
}

async fn client_disconnected(my_id: usize, users: &ConnectedClients) {
    eprintln!("User {} disconnected", my_id);

    users.write().await.remove(&my_id);
}

async fn user_connect(users: Users, my_id: usize, resp: LoginToGame) -> Result<(), String>{
    users.write().await.insert(my_id, resp.username);

    eprintln!("{}", users.read().await.get(&my_id).unwrap());

    Ok(())
}
