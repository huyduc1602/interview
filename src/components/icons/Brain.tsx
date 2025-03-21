import React from "react";

/**
* Custom Brain icon component for use with the Perflexity AI model
* 
* This component creates a brain icon to represent the Perflexity AI
* in the model selection interface
 */
interface BrainProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export const Brain = React.forwardRef<
    SVGSVGElement,
    BrainProps
>(({ color = "currentColor", strokeWidth = 2, size = 24, ...props }, ref) => {
    return (
        <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {/* Left hemisphere */}
            <path d="M9.5 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 1 1 0 -5z" />
            <path d="M4.5 10a2.5 2.5 0 1 1 0 5 2.5 2.5 0 1 1 0 -5z" />
            <path d="M2 19a2 2 0 1 1 4 0 2 2 0 1 1 -4 0z" />
            <path d="M9.5 22a2.5 2.5 0 1 1 0 -5 2.5 2.5 0 1 1 0 5z" />

            {/* Right hemisphere */}
            <path d="M14.5 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0 -5z" />
            <path d="M19.5 10a2.5 2.5 0 1 0 0 5 2.5 2.5 0 1 0 0 -5z" />
            <path d="M22 19a2 2 0 1 0 -4 0 2 2 0 1 0 4 0z" />
            <path d="M14.5 22a2.5 2.5 0 1 0 0 -5 2.5 2.5 0 1 0 0 5z" />

            {/* Connecting lines */}
            <path d="M12 7.5v9" />
            <path d="M7 10.5l5-3" />
            <path d="M7 13.5l5 3" />
            <path d="M17 10.5l-5-3" />
            <path d="M17 13.5l-5 3" />
        </svg>
    );
});

Brain.displayName = "Brain";

export default Brain;