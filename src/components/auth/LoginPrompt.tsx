import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '@/components/auth/LoginForm';
import { Layout } from '@/layouts';
import LoginGoogle from './LoginGoogle';

interface LoginPromptProps {
    onSuccess: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onSuccess }) => {
    const { t } = useTranslation();

    return (
        <Layout>
            <div className="max-w-md mx-auto mt-10 p-6">
                <h1 className="text-2xl font-bold mb-6">{t('auth.requestLogin')}</h1>
                <LoginForm onSuccess={onSuccess} />
                <LoginGoogle />
            </div>
        </Layout>
    );
};

export default LoginPrompt;