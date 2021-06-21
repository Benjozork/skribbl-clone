use serde::{Deserialize, Serialize};
use warp::ws::Message;

use crate::utils::{ConnectedClients, Users};

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct PenStroke {
    x: usize,
    y: usize,
    color: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
struct DrawCommand {
    draw_command_type: usize,
    arguments: Vec<PenStroke>,
}

#[derive(Deserialize, Serialize, Clone)]
struct CanvasCommands {
    _message: String,
    commands: Vec<DrawCommand>,
}

pub async fn canvas_commands(
    connected_clients: ConnectedClients,
    users: Users,
    my_id: usize,
    msg: &str,
) {
    let resp: Result<CanvasCommands, serde_json::Error> = serde_json::from_str(msg);

    if let Ok(resp) = resp {
        echo_canvas_commands(connected_clients, users, my_id, resp).await
    }
}

async fn echo_canvas_commands(
    connected_clients: ConnectedClients,
    users: Users,
    my_id: usize,
    resp: CanvasCommands,
) {
    for (_, value) in users.read().await.iter() {
        if value.id != my_id {
            let connected_clients_temp = connected_clients.read().await;
            let tx = connected_clients_temp.get(&value.id);

            match tx {
                Some(tx) => {
                    let resp = CanvasCommands {
                        _message: "S_Canvas_Commands".to_string(),
                        commands: resp.commands.clone(),
                    };
                    let resp_text = serde_json::to_string(&resp).unwrap();

                    tx.send(Ok(Message::text(&resp_text))).unwrap();
                }
                None => return,
            }
        }
    }
}
