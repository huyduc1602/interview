import * as React from 'react';

export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: string | number;
}

const EyeOff: React.FC<LucideProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.3 21.3 0 0 1 5.17-6.88" />
        <path d="M1 1l22 22" />
        <path d="M9.88 9.88A3 3 0 0 0 12 15a3 3 0 0 0 2.12-.88" />
        <path d="M14.12 14.12A3 3 0 0 0 12 9a3 3 0 0 0-2.12.88" />
    </svg>
);

export default EyeOff;
