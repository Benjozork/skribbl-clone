import React, { FC, useState } from 'react';
import { DrawingCanvas, DrawingCanvasController, DrawingCanvasControllerUsage } from './DrawingCanvas';
import { ToolBox } from './ToolBox';
import { PlayerBar } from './PlayerBar';

export const GameBoard: FC = () => {
    const [drawingController, setDrawingController] = useState<DrawingCanvasController>();

    const handleUseDrawingController = (func: DrawingCanvasControllerUsage) => {
        drawingController?.use(func);
    };

    return (
        <div className="flex flex-col items-center h-screen w-full">
            <div className="flex flex-row">
                <ToolBox onUseController={handleUseDrawingController} />
                <DrawingCanvas width={1280} height={720} className="bg-white shadow-lg" onUpdatedDrawingCanvasController={setDrawingController} />
            </div>
            <PlayerBar />
        </div>
    );
};
