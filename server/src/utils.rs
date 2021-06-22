use serde::Serialize;
use tokio::sync::{mpsc, RwLock};
use warp::ws::Message;

use std::{collections::HashMap, sync::Arc};

#[derive(Debug, PartialEq, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: usize,
    pub username: String,
    pub color: String,
    pub censor_user_content: bool,
}

pub type Users = Arc<RwLock<HashMap<usize, User>>>;

pub type ConnectedClients =
    Arc<RwLock<HashMap<usize, mpsc::UnboundedSender<Result<Message, warp::Error>>>>>;
