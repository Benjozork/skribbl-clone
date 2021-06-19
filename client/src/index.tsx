import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { Login } from './Login';
import { ClientContextProvider } from './hooks';

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

const App: FC = () => (
    <ClientContextProvider>
        <Login />
    </ClientContextProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
