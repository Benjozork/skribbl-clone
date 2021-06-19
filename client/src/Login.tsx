import React, { FC, useContext, useRef, useState } from 'react';
import { ClientContext } from './hooks';
import { ClientMessages } from './ws/messages';
import { themeColors } from '.';

export const Login: FC = () => {
    const usernameInputRef = useRef<HTMLInputElement>();
    const colorInputRef = useRef<HTMLInputElement>();

    const { client } = useContext(ClientContext);

    const handleLogin = () => {
        const username = usernameInputRef.current.value;
        const color = colorInputRef.current.value as `#${string}`;

        client.sendMessage({
            _message: ClientMessages.LoginToGame,
            username,
            color,
        });
    };

    const [color, setColor] = useState('');

    const handleColorChange = () => {
        if (colorInputRef.current) {
            if (!colorInputRef.current.value.includes('#')) {
                setColor(`#${colorInputRef.current.value}`);
            } else {
                setColor(colorInputRef.current.value);
            }
        }
    };

    return (
        <div className="flex flex-col justify-center font-mono h-screen w-screen items-center" style={{ background: themeColors.BODY }}>
            <h1 className="text-6xl font-bold" style={{ color: themeColors.ACCENT }}>Login</h1>
            <div className="py-4">
                <div className="py-1">
                    <input
                        className="focus:outline-none shadow-xl text-xl py-2 pl-1 w-96 placeholder-opacity-60"
                        placeholder="Name"
                        ref={usernameInputRef}
                        type="text"
                        style={{ background: themeColors.STANDARD, color: themeColors.ACCENT }}
                    />
                </div>
                <div className="py-1">
                    <input
                        className="focus:outline-none shadow-xl text-xl py-2 pl-1 w-96 placeholder-opacity-60"
                        placeholder="Color"
                        ref={colorInputRef}
                        type="text"
                        style={{ background: themeColors.STANDARD, color: themeColors.ACCENT }}
                        onChange={() => handleColorChange()}
                    />
                </div>
                <div className="full h-2 py-2" style={{ background: color }} />
            </div>

            <button
                className="rounded-md text-lg shadow-xl focus:outline-none py-2 px-4 hover:bg-opacity-80 transition duration-200"
                type="button"
                onClick={handleLogin}
                style={{ background: themeColors.STANDARD, color: themeColors.ACCENT }}
            >
                Login
            </button>
        </div>
    );
};
