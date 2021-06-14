import React, { FC, MouseEvent, useEffect, useRef, useState } from 'react';

const BLOCK_SIZE = 7;
const HALF_BLOCK_SIZE = BLOCK_SIZE / 2;
const STEP_DEBUG = true;

export const DrawingCanvas: FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>();

    const [context, setContext] = useState<CanvasRenderingContext2D>();

    const [mouseIsClicked, setMouseIsClicked] = useState(false);

    const [lastDraw, setLastDraw] = useState<{ x: number, y: number; }>();

    useEffect(() => {
        if (canvasRef) {
            setContext(canvasRef.current.getContext('2d'));
        }
    }, [canvasRef]);

    const handleMouseMove = ({ clientX, clientY }: MouseEvent<HTMLCanvasElement>) => {
        if (!mouseIsClicked) {
            return;
        }

        if (canvasRef) {
            const x = clientX - canvasRef.current.getBoundingClientRect().left;
            const y = clientY - canvasRef.current.getBoundingClientRect().top;

            if (lastDraw) {
                const
                    dx = x - lastDraw.x;
                const dy = y - lastDraw.y;

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

                        context.fillRect((lastDraw.x - HALF_BLOCK_SIZE) + sx, (lastDraw.y - HALF_BLOCK_SIZE) + sy, BLOCK_SIZE, BLOCK_SIZE);

                        if (STEP_DEBUG) {
                            context.fillStyle = 'black';
                        }
                    }
                }
            }

            setLastDraw({ x, y });

            context.fillRect(x - HALF_BLOCK_SIZE, y - HALF_BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
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
            ref={canvasRef}
            width={500}
            height={500}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        />
    );
};
