import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/layouts';
import AuthButtons from './AuthButtons';

interface LoginPromptProps {
    onSuccess: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onSuccess }) => {
    const { t } = useTranslation();

    return (
        <Layout>
            <AuthButtons
                title={t('auth.requestLogin')}
                onSuccess={onSuccess}
            />
        </Layout>
    );
};

export default LoginPrompt;