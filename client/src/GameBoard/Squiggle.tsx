import React from 'react';

type squiggleProps = {
    strokeColor: string,
    width: string,
    height: string,
    strokeWidth: string,
    className?: string
}

const Squiggle = (props: squiggleProps) => (
    <svg className={props.className} width={props.width} height={props.height} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1.33911 11.4214C9.07434 8.25469 12.2357 5.55474 10.7559 5.42141C8.28961 5.81028 2.68439 6.92136 1.33911 6.2547C-0.490641 5.34795 9.24249 2.08805 9.24249 1.42139"
            stroke={props.strokeColor}
            strokeWidth={props.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default Squiggle;
