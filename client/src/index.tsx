import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Login } from './Login';
import { GameBoard } from './GameBoard';
import { ClientContextProvider } from './hooks';
import { store, useGameSelector } from './redux/store';

import './styles.css';

import themes from './themes.json';

if (localStorage.getItem('theme') === null) {
    localStorage.setItem('theme', JSON.stringify(themes[8]));
}

type themeColorProps = {
    BODY: string,
    STANDARD: string,
    ACCENT: string
}

export const themeColors: themeColorProps = {
    BODY: JSON.parse(localStorage.getItem('theme')).body,
    STANDARD: JSON.parse(localStorage.getItem('theme')).standard,
    ACCENT: JSON.parse(localStorage.getItem('theme')).accent,
};

console.log(themeColors);

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
