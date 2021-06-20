import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Login } from './Login';
import { GameBoard } from './GameBoard';
import { ClientContextProvider } from './hooks';
import { store, useGameSelector } from './redux/store';

import './styles.css';

const App: FC = () => (
    <Provider store={store}>
        <ClientContextProvider>
            <AppContents />
        </ClientContextProvider>
    </Provider>
);

const AppContents: FC = () => {
    const loggedIn = useGameSelector((state) => state.connection.loggedIn);

    if (loggedIn) {
        return <GameBoard />;
    }

    return <Login />;
};

ReactDOM.render(<App />, document.getElementById('root'));
