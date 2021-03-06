import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { playersReducer } from './players.reducer';
import { chatReducer } from './chat.reducer';
import { connectionReducer } from './connection.reducer';

export const store = configureStore({
    reducer: {
        connection: connectionReducer,
        players: playersReducer,
        chat: chatReducer,
    },
});

export type GameState = ReturnType<typeof store.getState>;
export const useGameSelector: TypedUseSelectorHook<GameState> = useSelector;

export type GameDispatch = typeof store.dispatch;
export const useGameDispatch = () => useDispatch<GameDispatch>();
