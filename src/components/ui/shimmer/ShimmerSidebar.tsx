import React from 'react';

interface ShimmerSidebarProps {
    type?: "knowledge" | "interview";
    categoryCount?: number;
    itemsPerCategory?: number[] | number;
}

export const ShimmerSidebar: React.FC<ShimmerSidebarProps> = ({
    type = "interview",
    categoryCount,
    itemsPerCategory
}) => {
    // Define default categories based on type
    const defaultCategories = type === "interview"
        ? [
            { name: "JavaScript", itemCount: 6 },
            { name: "React", itemCount: 4 },
            { name: "CSS", itemCount: 3 },
            { name: "System Design", itemCount: 5 }
        ]
        : [
            { name: "Frontend", itemCount: 5 },
            { name: "Backend", itemCount: 4 },
            { name: "DevOps", itemCount: 3 }
        ];

    // Use provided category count or default categories length
    const categories = categoryCount
        ? Array(categoryCount).fill(null).map((_, i) => ({
            name: `Category ${i + 1}`,
            itemCount: Array.isArray(itemsPerCategory)
                ? (itemsPerCategory[i] || 4)
                : (itemsPerCategory || 4)
        }))
        : defaultCategories;

    return (
        <div className="px-4 py-2 space-y-6">
            {categories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-2">
                    {/* Category header shimmer */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-5 ml-2 animate-pulse"></div>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-4 animate-pulse"></div>
                    </div>

                    {/* Items shimmer */}
                    <div className="ml-6 space-y-2">
                        {Array.from({ length: category.itemCount }).map((_, itemIndex) => (
                            <div
                                key={itemIndex}
                                className={`h-8 rounded-md w-full animate-pulse flex items-center px-2 
                  ${itemIndex === 0 ?
                                        "bg-purple-100 dark:bg-purple-900/20" :
                                        "bg-gray-100 dark:bg-gray-800"}`}
                            >
                                <div className={`h-3 rounded ${itemIndex === 0 ?
                                        "bg-purple-200 dark:bg-purple-700" :
                                        "bg-gray-200 dark:bg-gray-700"
                                    } w-${Math.floor(Math.random() * 2) + 7}/12`}></div>
                            </div>
                        ))}
                    </div>

                    {/* Add badge shimmers for interview mode */}
                    {type === 'interview' && categoryIndex === 0 && (
                        <div className="ml-6 mt-1">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-pulse"></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ShimmerSidebar;