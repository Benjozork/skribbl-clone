use warp::Filter;

use std::sync::atomic::AtomicUsize;

mod game;
mod utils;
mod websocket;

use crate::utils::{ConnectedClients, Users};
use crate::websocket::client_connected;

static NEXT_USER_ID: AtomicUsize = AtomicUsize::new(1);

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
