import React from 'react';
import { cn } from '@/lib/utils';

const Spinner: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div className={cn("animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900", className)}></div>
    );
};

export default Spinner;