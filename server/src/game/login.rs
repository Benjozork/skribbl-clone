use serde::{Deserialize, Serialize};
use warp::ws::Message;

use crate::utils::{ConnectedClients, User, Users};

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
pub struct RemoveGamePlayer {
    pub _message: String,
    pub id: usize,
}

pub async fn login_to_game(
    connected_clients: ConnectedClients,
    users: Users,
    my_id: usize,
    msg: &str,
) {
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
                user_reject(connected_clients.clone(), my_id, err).await;
            }
        },

        // Return a failed connect call
        Err(err) => {
            user_reject(connected_clients.clone(), my_id, err.to_string()).await;
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

    if user.username.len() > 16 {
        return Err("Username too long.".to_string());
    }

    if user.username.len() < 2 {
        return Err("Username too short.".to_string());
    }

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

            tx.send(Ok(Message::text(&resp_text))).unwrap();
        }
    }

    eprintln!("User '{}' with id #{} Initialized", user.username, user.id);

    Ok(user)
}

async fn user_reject(connected_clients: ConnectedClients, my_id: usize, err: String) {
    let connected_client_temp = connected_clients.read().await;
    let me = connected_client_temp.get(&my_id).unwrap();

    let resp = LoginRejected {
        _message: "S_DenyGameLogin".to_string(),
        reason: format!("{:?}", err),
    };
    let resp_text = serde_json::to_string(&resp).unwrap();
    me.send(Ok(Message::text(&resp_text))).unwrap();
}
