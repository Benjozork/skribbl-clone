import { Message, ServerMessages } from './messages';
import { addPlayer, removePlayer } from '../redux/players.reducer';
import { store } from '../redux/store';
import { login } from '../redux/connection.reducer';

export class WebsocketClient {
    private websocket: WebSocket;

    constructor(
        private url: string,
    ) {
        this.websocket = new WebSocket(this.url);

        this.websocket.onerror = () => {
            alert('Could not connect to server.');
        };

        this.websocket.onopen = () => {
            alert('Connected to server.');
        };

        this.websocket.addEventListener('message', (event) => {
            const message = JSON.parse((event.data as string));

            this.receiveMessage(message);
        });
    }

    sendMessage(msg: Message) {
        if (this.websocket.readyState === 0) {
            this.websocket.addEventListener('open', () => {
                this.websocket.send(JSON.stringify(msg));
            });
        } else {
            this.websocket.send(JSON.stringify(msg));
        }
    }

    receiveMessage(incoming: Message) {
        if (incoming._message === ServerMessages.ConfirmGameLogin) {
            console.log('Login confirmed');
            store.dispatch(login());
        } else if (incoming._message === ServerMessages.DenyGameLogin) {
            console.log('Login failed');
        } else if (incoming._message === ServerMessages.AddGamePlayer) {
            console.log('Adding player');
            store.dispatch(addPlayer([0, incoming.user]));
        } else if (incoming._message === ServerMessages.RemoveGamePlayer) {
            removePlayer(incoming.userId);
        } else {
            console.error(`Invalid message type: ${incoming._message}`);
        }
    }
}
