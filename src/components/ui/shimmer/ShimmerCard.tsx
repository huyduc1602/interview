import React from 'react';

interface ShimmerCardProps {
    lines?: number;
    includeHeader?: boolean;
    includeFooter?: boolean;
}

const ShimmerCard: React.FC<ShimmerCardProps> = ({
    lines = 5,
    includeHeader = true,
    includeFooter = false
}) => {
    return (
        <div className="border rounded-lg p-4 space-y-4">
            {includeHeader && (
                <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-8 animate-pulse"></div>
                </div>
            )}

            {/* Content lines */}
            <div className="space-y-3">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-4 bg-gray-200 dark:bg-gray-700 rounded w-${12 - Math.floor(Math.random() * 4)}/12 animate-pulse`}
                    ></div>
                ))}
            </div>

            {includeFooter && (
                <div className="flex justify-end space-x-2 pt-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                </div>
            )}
        </div>
    );
};

export default ShimmerCard;