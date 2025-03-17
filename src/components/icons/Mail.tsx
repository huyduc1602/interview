import React from 'react';
import { LucideProps } from 'lucide-react';

// Rename to avoid conflict with Lucide's Mail component
export const CustomMail: React.FC<LucideProps> = ({
    size = 24,
    color = 'currentColor',
    strokeWidth = 2,
    className,
    ...props
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    );
};

export default CustomMail;
