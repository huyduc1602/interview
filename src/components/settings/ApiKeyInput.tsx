import React from 'react';
import { Input } from '@/components/ui/input';

interface ApiKeyInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    helpText?: string;
    showKey: boolean;
    name: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
    label,
    value,
    onChange,
    placeholder = '',
    helpText = '',
    showKey,
    name
}) => {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium">{label}</label>
            <Input
                type={showKey ? "text" : "password"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                name={name}
            />
            {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
        </div>
    );
};

export default ApiKeyInput;