import { cn } from '@/lib/utils';
import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ButtonLoginProps {
    type?: 'button' | 'submit' | 'reset' | undefined;
    onClick?: () => void;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
}

const ButtonLogin: React.FC<ButtonLoginProps> = ({
    type = 'button',
    onClick,
    icon,
    children,
    className = ''
}) => {
    const { t } = useTranslation();
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);

        try {
            onClick?.();
        } catch (err) {
            console.error('Login error:', err);
            setError(typeof err === 'string' ? err : t('auth.errorGeneric'));
        }
    };

    return (
        <div className="flex justify-center">
            <button
                type={type}
                onClick={handleLogin}
                className={cn('max-w-full min-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 h-10 bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2', className)}
            >
                {icon && icon}
                <span>{children}</span>
            </button>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default ButtonLogin;
