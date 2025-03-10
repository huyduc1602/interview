import React from 'react';
import MenuIcon from '@/components/icons/MenuIcon';
import CloseIcon from '@/components/icons/CloseIcon';

interface MenuIconProps {
    isOpen: boolean;
    onClick: () => void;
}

export const MenuToggleIcon: React.FC<MenuIconProps> = ({ isOpen, onClick }) => {
    return (
        <button onClick={onClick} className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            {isOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
    );
};