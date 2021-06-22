import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Login } from './Login';
import { GameBoard } from './GameBoard';
import { ClientContextProvider } from './hooks';
import { store, useGameSelector } from './redux/store';

import './styles/tailwind.css';

import themes from './themes.json';

if (localStorage.getItem('theme') === null) {
    localStorage.setItem('theme', JSON.stringify(themes[8]));
}

if (localStorage.getItem('drawingThickness') === null) {
    localStorage.setItem('drawingThickness', '15');
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

const App: FC = () => (
    <div style={{ background: themeColors.BODY }}>
        <Provider store={store}>
            <ClientContextProvider>
                <AppContents />
            </ClientContextProvider>
        </Provider>
    </div>
);

const AppContents: FC = () => {
    const loggedIn = useGameSelector((state) => state.connection.loggedIn);

    if (loggedIn) {
        return <GameBoard />;
    }

    return <Login />;
};

ReactDOM.render(<App />, document.getElementById('root'));
