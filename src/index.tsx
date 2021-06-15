import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { DrawingCanvas } from './DrawingCanvas';

import './styles.css';

const App: FC = () => (
    <>
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-10">skribbl clone</h1>

            <DrawingCanvas
                width={1920}
                height={1080}
                style={{ border: '5px solid black' }}
            />
        </div>
    </>
);

ReactDOM.render(<App />, document.getElementById('root'));
