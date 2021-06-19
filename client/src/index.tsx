import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { Login } from './Login';
import { ClientContextProvider } from './hooks';

import './styles.css';

const App: FC = () => (
    <ClientContextProvider>
        <Login />
    </ClientContextProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
