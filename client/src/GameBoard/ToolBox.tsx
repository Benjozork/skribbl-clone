/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { useState, FC } from 'react';
import { DrawingCanvasControllerUsage } from './DrawingCanvas';

export type ToolBoxProps = {
    onUseController: (usage: DrawingCanvasControllerUsage) => void,
}

export const ToolBox: FC<ToolBoxProps> = ({ onUseController }) => {
    const [selectedTool] = useState(0);

    const handleClear = () => {
        onUseController((canvas, context) => {
            context.clearRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
        });
    };

    const handleChooseColor = (color: string) => {
        onUseController((_, context) => {
            context.fillStyle = color;
        });
    };

    return (
        <div className="text-2xl flex flex-row justify-center space-x-10">
            <span>
                selected:
                {selectedTool}
            </span>
            <span className="cursor-pointer">pen</span>
            <span className="cursor-pointer">large pen thing</span>
            <span className="cursor-pointer">fill</span>
            <span className="cursor-pointer" onClick={handleClear}>clear</span>

            <span className="w-10 h-10 bg-red-500" onClick={() => handleChooseColor('red')} />
            <span className="w-10 h-10 bg-yellow-500" onClick={() => handleChooseColor('yellow')} />
            <span className="w-10 h-10 bg-green-500" onClick={() => handleChooseColor('green')} />
            <span className="w-10 h-10 bg-blue-500" onClick={() => handleChooseColor('blue')} />
        </div>
    );
};
