import { createAction, createReducer } from '@reduxjs/toolkit';
import { User } from '../data/user';

interface LoggedOffConnectionState {
    loggedIn: false,
}

interface LoggedInConnectionState {
    loggedIn: true,
    user: User,
}

export type ConnectionState = LoggedOffConnectionState | LoggedInConnectionState

export const login = createAction<User>('connection/login');
export const logoff = createAction('connection/logoff');

const initialState = { loggedIn: false } as ConnectionState;

export const connectionReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(login, (state, action) => {
            state.loggedIn = true;
            (state as LoggedInConnectionState).user = action.payload;
        })
        .addCase(logoff, (state) => {
            state.loggedIn = false;
            (state as LoggedInConnectionState).user = undefined;
        });
});
