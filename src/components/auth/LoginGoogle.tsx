import React from 'react';
import { useAuthContext } from '@/contexts/AuthProvider';
import { useTranslation } from 'react-i18next';
import Google from '@/components/icons/Google';

const LoginGoogle: React.FC = () => {
    const { loginWithGoogle } = useAuthContext();
    const { t } = useTranslation();

    return (
        <div className="mt-4">
            <button
                onClick={loginWithGoogle}
                className="whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-[90%] bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded flex items-center justify-center gap-2"
            >
                <Google className='mr-2' />
                {t('login.google')}
            </button>
        </div>
    );
};

export default LoginGoogle;