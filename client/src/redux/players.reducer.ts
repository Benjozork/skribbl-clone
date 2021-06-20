import { createAction, createReducer } from '@reduxjs/toolkit';

interface PlayersState {
    players: {
        [k: number]: Record<string, unknown>
    };
}

export const addPlayer = createAction<[number, Record<string, unknown>]>('players/add');
export const removePlayer = createAction<number>('players/remove');

const initialState = { players: {} } as PlayersState;

export const playersReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(addPlayer, (state, action) => {
            const [id, data] = action.payload;
            console.log(`adding player with id ${action.payload[0]}`);
            state.players[id] = data;
        })
        .addCase(removePlayer, (state, action) => {
            state.players[action.payload] = undefined;
        });
});
