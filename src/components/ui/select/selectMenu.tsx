import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';

// Context for Select component
const SelectContext = createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
    value: string;
    onValueChange: (value: string) => void;
    toggleOpen: () => void;
    closeDropdown: () => void;
    disabled: boolean;
}>({
    open: false,
    setOpen: () => { },
    value: '',
    onValueChange: () => { },
    toggleOpen: () => { },
    closeDropdown: () => { },
    disabled: false
});

// Select component
export interface SelectProps {
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    children,
    value,
    onValueChange,
    className = '',
    disabled = false
}) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        if (!disabled) {
            setOpen(!open);
        }
    };

    const closeDropdown = () => {
        setOpen(false);
    };

    // Click outside to close the dropdown
    useEffect(() => {
        if (open) {
            const handleOutsideClick = (e: MouseEvent) => {
                const target = e.target as Element;
                if (!target.closest('[data-select-container]')) {
                    closeDropdown();
                }
            };

            document.addEventListener('click', handleOutsideClick);
            return () => document.removeEventListener('click', handleOutsideClick);
        }
    }, [open]);

    return (
        <SelectContext.Provider
            value={{
                open,
                setOpen,
                value,
                onValueChange,
                toggleOpen,
                closeDropdown,
                disabled
            }}
        >
            <div
                className={`relative ${className}`}
                data-select-container
            >
                {children}
            </div>
        </SelectContext.Provider>
    );
};

// SelectTrigger component
export interface SelectTriggerProps {
    children: React.ReactNode;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ children }) => {
    const { open, toggleOpen, disabled } = useContext(SelectContext);

    return (
        <button
            type="button"
            onClick={toggleOpen}
            disabled={disabled}
            className={`flex items-center justify-between w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-expanded={open}
        >
            {children}
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${open ? 'transform rotate-180' : ''}`} />
        </button>
    );
};

// SelectValue component
export interface SelectValueProps {
    placeholder: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
    const { value } = useContext(SelectContext);

    return (
        <span className="block truncate">
            {value || placeholder}
        </span>
    );
};

// SelectContent component
export interface SelectContentProps {
    children: React.ReactNode;
}

export const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
    const { open } = useContext(SelectContext);

    if (!open) return null;

    return (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 max-h-60 overflow-y-auto">
            <ul className="py-1">
                {children}
            </ul>
        </div>
    );
};

// SelectItem component
export interface SelectItemProps {
    children: React.ReactNode;
    value: string;
}

export const SelectItem: React.FC<SelectItemProps> = ({ children, value }) => {
    const { value: selectedValue, onValueChange, closeDropdown } = useContext(SelectContext);

    const isSelected = selectedValue === value;

    const handleSelect = () => {
        onValueChange(value);
        closeDropdown();
    };

    return (
        <li
            onClick={handleSelect}
            className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${isSelected ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'text-gray-900 dark:text-white'}`}
        >
            {children}
        </li>
    );
};

export interface SelectCategoryProps {
    value: string;
    className?: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const SelectCategory: React.FC<SelectCategoryProps> = ({
    value,
    className = 'w-[90%]',
    onValueChange,
    placeholder = 'Select Category',
    disabled = false
}) => {
    const { questions } = useSelector((state: RootState) => state.interview);

    // Use useMemo to create a stable reference for the questions list
    // This will help debugging by logging when questions actually change
    const questionItems = useMemo(() => {
        return questions.map((cat) => (
            <SelectItem key={`category-${cat.category}`} value={cat.category}>
                {cat.category}
            </SelectItem>
        ));
    }, [questions]);

    // Force component to recognize when questions array changes by using length as a dependency
    const questionsLength = questions.length;

    useEffect(() => {
        console.log(`SelectCategory: Questions updated, now has ${questionsLength} items`);
    }, [questionsLength]);

    return (
        <Select value={value} className={className} onValueChange={onValueChange} disabled={disabled}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {questions.length === 0 ? (
                    <li className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No categories available
                    </li>
                ) : (
                    questionItems
                )}
            </SelectContent>
        </Select>
    );
};

export default React.memo(SelectCategory);