import React, { FC, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { DrawingCanvas, DrawingCanvasController, DrawingCanvasControllerUsage } from './GameBaord/DrawingCanvas';
import { ToolBox } from './GameBaord/ToolBox';
import { WebsocketClient } from './ws';
import { ClientMessages } from './ws/messages';

import './styles.css';

const App: FC = () => {
    const [client] = useState(() => new WebsocketClient('ws://localhost:3030/test'));

    const [drawingCanvasController, setDrawingCanvasController] = useState<DrawingCanvasController>();

    useEffect(() => {
        if (client) {
            client.sendMessage({
                _message: ClientMessages.LoginToGame,
                username: 'TestUser',
                color: '#FF55FF',
            });
        }
    }, [client]);

    const handleUseController = (func: DrawingCanvasControllerUsage) => {
        drawingCanvasController?.use(func);
    };

    return (
        <>
            <div className="w-screen h-screen flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold mb-10">skribbl clone</h1>

                <DrawingCanvas
                    className="border-2 border-gray-700"
                    width={1920}
                    height={1080}
                    onUpdatedDrawingCanvasController={setDrawingCanvasController}
                />

                <ToolBox onUseController={handleUseController} />
            </div>
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
