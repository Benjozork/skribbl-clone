/* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, FC } from 'react';
import { IconSpeakerphone, IconArrowBackUp, IconArrowForwardUp, IconEraser, IconBucket, IconTrash, IconThumbUp, IconThumbDown } from '@tabler/icons';
import { DrawingCanvasControllerUsage } from './DrawingCanvas';
import { themeColors } from '../index';
import Squiggle from './Squiggle';

import '../styles/slider.css';

export type ToolBoxProps = {
    onUseController: (usage: DrawingCanvasControllerUsage) => void,
}

type buttonProps = {
    onClick: any,
    className?: string
}

type colorSelectionProps = { hexColor: string };

const Button: FC<buttonProps> = ({ onClick, className, children }) => (
    <div
        className={`${className} flex items-center hover:border-current border-2 border-transparent transition duration-200 py-2 justify-center w-full rounded-sm cursor-pointer select-none`}
        style={{ background: themeColors.STANDARD, color: themeColors.ACCENT }}
        onClick={onClick}
    >
        {children}
    </div>
);

const Divider = () => (
    <div className="w-full h-1 rounded-lg" style={{ background: themeColors.STANDARD }} />
);

const ColorPanel: FC = ({ children }) => (
    <div className="grid grid-cols-4 rounded-sm w-full py-2 justify-items-center gap-y-1" style={{ background: themeColors.STANDARD }}>
        {children}
    </div>
);

export const ToolBox: FC<ToolBoxProps> = ({ onUseController }) => {
    // const [selectedTool] = useState(0);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [drawingThickness, setDrawingThickness] = useState(5);
    const sliderRef = useRef<HTMLInputElement>();

    const handleClear = () => {
        onUseController((canvas, context) => {
            context.clearRect(0, 0, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height);
        });
    };

    const handleChooseColor = (color: string) => {
        onUseController((_, context) => {
            context.fillStyle = color;
        });
        setSelectedColor(color);
    };

    const ColorSelection = ({ hexColor }: colorSelectionProps) => (
        <div
            className={`${hexColor === selectedColor ? 'border-current/40' : 'border-transparent'} border-2 w-5 h-5 rounded-full cursor-pointer`}
            style={{ background: hexColor, color: themeColors.ACCENT }}
            onClick={() => handleChooseColor(hexColor)}
        />
    );

    const handleThicknessChange = () => {
        setDrawingThickness(parseInt(sliderRef.current.value));
    };

    return (
        <div className="text-2xl w-32 mx-10 flex flex-col justify-center space-y-3">
            <Button onClick={() => console.log()}>
                <IconSpeakerphone size={32} />
            </Button>
            <div className="space-y-1.5">
                <Divider />
                <Divider />
            </div>
            <div className="flex flex-row gap-x-3">
                <Button onClick={() => console.log()}>
                    <IconArrowBackUp size={32} />
                </Button>
                <Button onClick={() => console.log()}>
                    <IconArrowForwardUp size={32} />
                </Button>
            </div>
            <div className="space-y-1.5">
                <Divider />
                <Divider />
            </div>
            <ColorPanel>
                <ColorSelection hexColor="#FFFFFF" />
                <ColorSelection hexColor="#FF0000" />
                <ColorSelection hexColor="#FFF400" />
                <ColorSelection hexColor="#0045FF" />
                <ColorSelection hexColor="#000000" />
                <ColorSelection hexColor="#FF8100" />
                <ColorSelection hexColor="#22FF00" />
                <ColorSelection hexColor="#00FFFF" />
            </ColorPanel>
            <div className="px-2 py-1 rounded-sm" style={{ background: themeColors.STANDARD }}>
                <div className="w-full flex justify-between py-1">
                    <div onClick={() => {
                        sliderRef.current.value = sliderRef.current.min;
                    }}
                    >
                        <Squiggle className="cursor-pointer overflow-visible" width="16" height="16" strokeWidth="1" strokeColor={themeColors.ACCENT} />
                    </div>
                    <div
                        onClick={() => {
                            sliderRef.current.value = sliderRef.current.max;
                        }}
                    >
                        <Squiggle className="cursor-pointer overflow-visible" width="16" height="16" strokeWidth="3" strokeColor={themeColors.ACCENT} />
                    </div>
                </div>
                <input
                    type="range"
                    className="slider"
                    ref={sliderRef}
                    min="1"
                    max="10"
                    defaultValue={drawingThickness}
                    onChange={() => handleThicknessChange()}
                    style={{ background: themeColors.ACCENT, color: themeColors.BODY }}
                />
            </div>
            <Divider />
            <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => console.log()}>
                    <IconEraser size={32} />
                </Button>
                <Button onClick={() => console.log()}>
                    <IconBucket size={32} />
                </Button>
                <Button className="col-span-full" onClick={handleClear}>
                    <IconTrash size={32} />
                </Button>
            </div>
            <div className="space-y-1.5">
                <Divider />
                <Divider />
            </div>
            <div className="flex flex-row gap-x-3">
                <Button onClick={() => console.log()}>
                    <IconThumbUp size={32} />
                </Button>
                <Button onClick={() => console.log()}>
                    <IconThumbDown size={32} />
                </Button>
            </div>
        </div>
    );
};
