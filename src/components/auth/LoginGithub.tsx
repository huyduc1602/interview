import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import ButtonLogin from '@/components/common/ButtonLogin';
import { Github } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LoginGithub: React.FC = () => {
    const { t } = useTranslation();
    const { signInWithGithub } = useAuth();

    return (
        <div className="w-full">
            <ButtonLogin
                onClick={signInWithGithub}
                className='bg-gray-800 hover:bg-gray-900 text-white'
                icon={<Github className='mr-2' />}
            >
                {t('auth.signInWithGithub')}
            </ButtonLogin>
        </div>
    );
};

export default LoginGithub;
