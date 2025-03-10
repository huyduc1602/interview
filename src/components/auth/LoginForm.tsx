import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
interface LoginFormProps {
    onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const { t } = useTranslation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            await login(email);
            if (onSuccess) {
                onSuccess();
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.enterEmail')}
            className="w-full px-4 py-2 border rounded"
            required
            autoComplete='email'
            />
            <button
            type="submit"
            className="w-[90%] px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-transform transform hover:scale-105 active:scale-95 text-center"
            >
            {t('auth.login')}
            </button>
        </form>
    );
}