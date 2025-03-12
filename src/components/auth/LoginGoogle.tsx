import React from 'react';
import { useAuthContext } from '@/contexts/AuthProvider';
import { useTranslation } from 'react-i18next';
import Google from '@/components/icons/Google';

const LoginGoogle: React.FC = () => {
    const { loginWithGoogle } = useAuthContext();
    const { t } = useTranslation();

    return (
        <div className="flex justify-center items-center mt-5">
            <button
                onClick={loginWithGoogle}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
                <Google className='mr-2' />
                {t('login.google')}
            </button>
        </div>
    );
};

export default LoginGoogle;