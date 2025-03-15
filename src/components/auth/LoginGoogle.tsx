import React from 'react';
import { useAuthContext } from '@/contexts/AuthProvider';
import { useTranslation } from 'react-i18next';
import Google from '@/components/icons/Google';
import ButtonLogin from '@/components/common/ButtonLogin';

const LoginGoogle: React.FC = () => {
    const { loginWithGoogle } = useAuthContext();
    const { t } = useTranslation();

    return (
        <ButtonLogin
            className='bg-gray-200 hover:bg-gray-300 text-gray-900'
            onClick={loginWithGoogle}
            icon={<Google className='mr-2' />}
        >
            {t('auth.signInWithGoogle')}
        </ButtonLogin>
    );
};

export default LoginGoogle;