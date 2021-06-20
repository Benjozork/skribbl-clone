import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Login } from './Login';
import { ClientContextProvider } from './hooks';
import { store } from './redux/store';

import './styles.css';

const App: FC = () => (
    <Provider store={store}>
        <ClientContextProvider>
            <Login />
        </ClientContextProvider>
    </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
