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

            this.websocket.send('text');
        };
        this.websocket.onmessage = (message) => {
            alert(`Server says: ${message}`);
        };
    }
}
