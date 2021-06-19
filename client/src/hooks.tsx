import React, { createContext, FC } from 'react';
import { WebsocketClient } from './ws';

export interface ClientContextType {
    client: WebsocketClient,
}

export const ClientContext = createContext<ClientContextType>(undefined as any);

export const ClientContextProvider: FC = ({ children }) => (
    <ClientContext.Provider value={{ client: new WebsocketClient('ws://localhost:3030/test') }}>
        {children}
    </ClientContext.Provider>
);
