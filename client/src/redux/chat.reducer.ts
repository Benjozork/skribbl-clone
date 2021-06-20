import { createAction, createReducer } from '@reduxjs/toolkit';

interface ChatState {
    messages: [number, string][],
}

const addMessage = createAction<[number, string]>('chat/add');

const initialState = { messages: [] } as ChatState;

export const chatReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(addMessage, (state, action) => {
            state.messages.push(action.payload);
        });
});
