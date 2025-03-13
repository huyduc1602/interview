import React from 'react';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface ToggleIconProps {
    enabled: boolean;
    className?: string;
    size?: number | string;
    enabledColor?: string;
    disabledColor?: string;
}

const ToggleIcon: React.FC<ToggleIconProps> = ({
    enabled,
    className = '',
    size = 20,
    enabledColor = 'text-green-500',
    disabledColor = 'text-gray-400'
}) => {
    if (enabled) {
        return <ToggleRight className={`${enabledColor} ${className}`} size={size} />;
    }
    return <ToggleLeft className={`${disabledColor} ${className}`} size={size} />;
};

export default ToggleIcon;