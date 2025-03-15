import React from 'react';
import LoginComputer from '@/components/auth/LoginComputer';
import LoginGoogle from '@/components/auth/LoginGoogle';
import LoginGithub from '@/components/auth/LoginGithub';
import LoginSection from './LoginSection';
import { useTranslation } from 'react-i18next';
import Note from './Note';

interface AuthButtonsProps {
    title?: string;
    onSuccess?: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({
    title,
    onSuccess
}) => {
    const { t } = useTranslation();

    return (
        <div className="max-w-xl mx-auto p-4">
            <h2 className="text-xl font-semibold mb-4 text-center">{title || t('auth.loginSection.title')}</h2>
            <div className="flex flex-col gap-4 w-full mx-auto">
                <LoginSection title={t('auth.loginSection.local')}>
                    <LoginComputer onSuccess={onSuccess} />
                    <Note>{t('auth.loginSection.localNote')}</Note>
                </LoginSection>

                <LoginSection title={t('auth.loginSection.social')}>
                    <LoginGoogle />
                    <div className='h-4' />
                    <LoginGithub />
                    <Note>{t('auth.loginSection.socialNote')}</Note>
                </LoginSection>
            </div>
        </div>
    );
};

export default AuthButtons;
