use futures::{FutureExt, StreamExt};
use serde_json::Value;
use tokio::sync::mpsc;
use tokio_stream::wrappers::UnboundedReceiverStream;
use warp::ws::{Message, WebSocket};

use std::sync::atomic::Ordering;

use crate::game::login::{login_to_game, RemoveGamePlayer};

use crate::game::canvas::canvas_commands;
use crate::game::start::begin_game;
use crate::{
    utils::{ConnectedClients, Users},
    NEXT_USER_ID,
};

pub async fn client_connected(ws: WebSocket, connected_clients: ConnectedClients, users: Users) {
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
            login_to_game(connected_clients.clone(), users.clone(), my_id, msg).await
        }
        Some("C_BeginGame") => begin_game(users.clone(), my_id).await,
        Some("C_Canvas_Commands") => {
            canvas_commands(connected_clients.clone(), users.clone(), my_id, msg).await
        }
        _ => (),
    }
}
