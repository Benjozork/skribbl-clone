import { Message } from './messages';

export class WebsocketClient {
    private websocket: WebSocket;

    constructor(
        private url: string,
    ) {
        this.websocket = new WebSocket(this.url);

        this.websocket.onerror = () => {
            console.log('Could not connect to server.');
        };
        this.websocket.onopen = () => {
            console.log('Connected to server.');
        };
        this.websocket.onmessage = (message) => {
            console.log(`Server says: ${message.data}`);
        };
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
}
