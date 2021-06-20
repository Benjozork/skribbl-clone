import React, { FC } from 'react';
import { useGameSelector } from '../redux/store';

export const PlayerBar: FC = () => {
    const players = useGameSelector((state) => state.players.players);

    return (
        <div className="flex flex-row">
            {Object.values(players).map((player) => (
                <div className="p-4 text-xl font-medium bg-gray-300">
                    {player.username}
                </div>
            ))}
        </div>
    );
};
