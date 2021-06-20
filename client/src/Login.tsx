import React, { FC, useContext, useRef } from 'react';
import { ClientContext } from './hooks';
import { ClientMessages } from './ws/messages';

export const Login: FC = () => {
    const usernameInputRef = useRef<HTMLInputElement>();
    const colorInputRef = useRef<HTMLInputElement>();

    const { client } = useContext(ClientContext);

    const handleLogin = () => {
        const username = usernameInputRef.current.value;
        const color = colorInputRef.current.value as `#${string}`;

        // @ts-ignore
        client.sendMessage({
            _message: ClientMessages.LoginToGame,
            username,
            color,
            censorUserContent: false, // TODO add option in UI
        });
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl">Login</h1>

            <div className="flex flex-col">
                <span>Username</span>
                <input ref={usernameInputRef} type="text" />
            </div>

            <div className="flex flex-col">
                <span>Color</span>
                <input ref={colorInputRef} type="text" />
            </div>

            <button type="button" onClick={handleLogin}>Login</button>
        </div>
    );
};
