import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Computer from '@/components/icons/Computer';
import ButtonLogin from '@/components/common/ButtonLogin';

interface LoginComputerProps {
    onSuccess?: () => void;
}

export const LoginComputer: React.FC<LoginComputerProps> = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            login(email);
            if (onSuccess) {
                onSuccess();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center w-full">
            <div className="w-full flex justify-center">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.enterEmail')}
                    className="px-4 py-2 border rounded w-full max-w-[332px] text-center"
                    required
                    autoComplete="email"
                />
            </div>
            <div className="d-flex justify-center">
                <ButtonLogin
                    type="submit"
                    className='w-full bg-sky-600 hover:bg-sky-700 text-white'
                    icon={<Computer className='mr-2' />}
                >
                    {t('auth.loginLocal')}
                </ButtonLogin>
            </div>
        </form>
    );
}

export default LoginComputer;