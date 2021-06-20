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
        <div className="flex flex-col items-center">
            <DrawingCanvas width={1920} height={1080} onUpdatedDrawingCanvasController={setDrawingController} />

            <ToolBox onUseController={handleUseDrawingController} />

            <PlayerBar />
        </div>
    );
};
