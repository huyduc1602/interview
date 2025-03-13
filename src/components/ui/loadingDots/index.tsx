import React from 'react';

interface LoadingDotsProps {
    size?: 'small' | 'medium' | 'large';
    colorMode?: 'rainbow' | 'primary' | 'gradient';
    fullScreen?: boolean;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
    size = 'medium',
    colorMode = 'rainbow',
    fullScreen = true
}) => {
    // Size classes based on the size prop
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-6 w-6',
        large: 'h-8 w-8'
    };

    // Color configurations
    const colorConfigs = {
        rainbow: [
            'bg-red-500 dark:bg-red-400',
            'bg-blue-500 dark:bg-blue-400',
            'bg-green-500 dark:bg-green-400'
        ],
        primary: [
            'bg-purple-500 dark:bg-purple-400',
            'bg-indigo-600 dark:bg-indigo-500',
            'bg-violet-700 dark:bg-violet-600'
        ],
        gradient: [
            'bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400',
            'bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400',
            'bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-400 dark:to-teal-300'
        ]
    };

    // Get the appropriate classes
    const dotSize = sizeClasses[size];
    const colors = colorConfigs[colorMode];

    return (
        <div className={`flex space-x-3 justify-center items-center ${fullScreen ? 'h-screen' : 'py-8'}`}>
            <span className='sr-only'>Loading...</span>
            <div className={`${dotSize} ${colors[0]} rounded-full animate-bounce [animation-delay:-0.3s] shadow-lg`}></div>
            <div className={`${dotSize} ${colors[1]} rounded-full animate-bounce [animation-delay:-0.15s] shadow-lg`}></div>
            <div className={`${dotSize} ${colors[2]} rounded-full animate-bounce shadow-lg`}></div>
        </div>
    );
}

export default LoadingDots;