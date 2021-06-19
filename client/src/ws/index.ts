import { Message, ServerMessages } from './messages';

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
        const { _message } = incoming;

        switch (_message) {
        case ServerMessages.ConfirmGameLogin:
            console.log(incoming);
            break;
        case ServerMessages.DenyGameLogin:
            console.log(incoming);
            break;
        default:
            console.error(`Invalid message type: ${_message}`);
        }
    }
}
