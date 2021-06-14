import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { DrawingCanvas } from './DrawingCanvas';

const App: FC = () => (
    <>
        <h1>bruh</h1>

        <DrawingCanvas />
    </>
);

ReactDOM.render(<App />, document.getElementById('root'));
