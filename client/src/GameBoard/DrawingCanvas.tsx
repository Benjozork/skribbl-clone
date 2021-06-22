import React, { CSSProperties, FC, MouseEvent, useEffect, useRef, useState } from 'react';

export type DrawingCanvasProps = {
    width: number,
    height: number,
    className?: string,
    style?: CSSProperties,
    onUpdatedDrawingCanvasController: (controller: DrawingCanvasController) => void,
}

const STEP_DEBUG = false;

export const DrawingCanvas: FC<DrawingCanvasProps> = ({ width, height, className, style, onUpdatedDrawingCanvasController }) => {
    const BLOCK_SIZE = parseInt(localStorage.getItem('drawingThickness'));
    const HALF_BLOCK_SIZE = BLOCK_SIZE / 2;

    const canvasRef = useRef<HTMLCanvasElement>();

    const [context, setContext] = useState<CanvasRenderingContext2D>();

    const [mouseIsClicked, setMouseIsClicked] = useState(false);

    const [lastDraw, setLastDraw] = useState<{ x: number, y: number; }>();

    useEffect(() => {
        if (canvasRef) {
            setContext(canvasRef.current.getContext('2d'));
        }
    }, [canvasRef]);

    useEffect(() => {
        if (context && canvasRef.current) {
            onUpdatedDrawingCanvasController(new DrawingCanvasController(canvasRef.current, context));
        } else {
            onUpdatedDrawingCanvasController(null);
        }
    }, [context]);

    const handleMouseMove = ({ clientX, clientY }: MouseEvent<HTMLCanvasElement>) => {
        if (!mouseIsClicked) {
            return;
        }

        if (canvasRef) {
            const x = clientX - canvasRef.current.getBoundingClientRect().left;
            const y = clientY - canvasRef.current.getBoundingClientRect().top;

            if (lastDraw) {
                const
                    dx = x - lastDraw.x,
                    dy = y - lastDraw.y;

                if (Math.abs(dx) > HALF_BLOCK_SIZE || Math.abs(dy) > HALF_BLOCK_SIZE) {
                    const hy = Math.sqrt(Math.abs(dx) ** 2 + Math.abs(dy) ** 2);

                    const steps = hy / HALF_BLOCK_SIZE;

                    if (STEP_DEBUG) {
                        console.log(`dx (${dx}) or dy (${dy}) exceeded ${HALF_BLOCK_SIZE}, drawing ${steps} steps.`);
                    }

                    for (let i = 1; i <= steps; i++) {
                        const
                            sx = (dx / steps) * i,
                            sy = (dy / steps) * i;

                        if (STEP_DEBUG) {
                            console.log(`drawing step #${i}, at sx: ${sx}, sy: ${sy}`);

                            context.fillStyle = 'red';
                        }
                        context.beginPath();
                        context.arc((lastDraw.x - HALF_BLOCK_SIZE) + sx, (lastDraw.y - HALF_BLOCK_SIZE) + sy, BLOCK_SIZE, 0, 2 * Math.PI);
                        context.fill();

                        if (STEP_DEBUG) {
                            context.fillStyle = 'black';
                        }
                    }
                }
            }

            setLastDraw({ x, y });
            context.beginPath();
            context.arc(x - HALF_BLOCK_SIZE, y - HALF_BLOCK_SIZE, BLOCK_SIZE, 0, 2 * Math.PI);
            context.fill();
        }
    };

    const handleMouseDown = () => {
        setMouseIsClicked(true);
    };

    const handleMouseUp = () => {
        setMouseIsClicked(false);
        setLastDraw(null);
    };

    const handleMouseLeave = () => {
        setLastDraw(null);
    };

    return (
        <canvas
            className={className}
            style={style}
            ref={canvasRef}
            width={width}
            height={height}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        />
    );
};

export type DrawingCanvasControllerUsage = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;

export class DrawingCanvasController {
    constructor(
        private canvas: HTMLCanvasElement,
        private context: CanvasRenderingContext2D,
    ) { }

    use(func: DrawingCanvasControllerUsage) {
        func(this.canvas, this.context);
    }
}
