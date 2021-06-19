use tokio::sync::mpsc;

use tokio_stream::wrappers::UnboundedReceiverStream;

use futures::{FutureExt, StreamExt};

use warp::{
    Filter,
    ws::{WebSocket, Message}
};

use std::{
    sync::{RwLock, Arc},
    collections::HashMap,
    sync::atomic::AtomicUsize,
    sync::atomic::Ordering
};

static NEXT_USER_ID: AtomicUsize = AtomicUsize::new(1);

type ConnectedUsers = Arc<RwLock<HashMap<usize, mpsc::UnboundedSender<Result<Message, warp::Error>>>>>;

#[tokio::main]
async fn main() {
    env_logger::init();

    let users = ConnectedUsers::default();

    let users = warp::any().map(move || users.clone());

    let websocket = warp::path("test")
        .and(warp::ws())
        .and(users)
        .map(|ws: warp::ws::Ws, users| {
            ws.on_upgrade(move |socket| user_connected(socket, users))
        });

    warp::serve(websocket)
        .run(([127, 0, 0, 1], 3030))
        .await;
}

async fn user_connected(ws: WebSocket, users: ConnectedUsers) {
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

    users.write().unwrap().insert(my_id, tx);

    while let Some(result) = user_ws_rx.next().await {
        let msg = match result {
            Ok(msg) => msg,
            Err(e) => {
                eprintln!("websocket error (uid={}): {}", my_id, e);
                break;
            }
        };

        let users = users.read().unwrap();
        let me = users.get(&my_id).unwrap();

        me.send(Ok(Message::text(msg.to_str().unwrap())));

        eprintln!("Received {} from ws", msg.to_str().unwrap());
    }

    user_disconnect(my_id, &users).await;
}

async fn user_disconnect(my_id: usize, users: &ConnectedUsers) {
    eprintln!("User {} disconnected", my_id);

    users.write().unwrap().remove(&my_id);
}
