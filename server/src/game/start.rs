use crate::utils::Users;

pub async fn begin_game(users: Users, my_id: usize) {
    if users.read().await.contains_key(&my_id) {
        let mut uuids: Vec<usize> = Vec::new();

        for (_, value) in users.read().await.iter() {
            uuids.push(value.id);
        }

        let host_uid = uuids.iter().min().unwrap_or(&0_usize);

        if &my_id == host_uid {
            //TODO: Add start game code
            eprintln!("Game Started");
        }
    }
}
