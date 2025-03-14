import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeAuthCodeForToken, supabase } from '@/supabaseClient';
import { useTranslation } from 'react-i18next';

export default function AuthCallback() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        async function processAuth() {
            // Check localStorage for current_user and ensure provider is google
            const stored = localStorage.getItem('current_user');
            if (stored) {
                const currentUser = JSON.parse(stored);
                if (!currentUser.provider || currentUser.provider !== 'google') {
                    console.warn('Not a Google login, skipping Supabase API call');
                    navigate('/');
                    return;
                }
            } else {
                console.warn('No stored user found; assuming non-Google login');
                navigate('/');
                return;
            }

            // Optional: check if a Supabase session already exists
            try {
                const { data } = await supabase.auth.getSession();
                if (data?.session) {
                    console.log('Session exists on load, redirecting...');
                    setTimeout(() => navigate('/'), 100);
                    return;
                }
            } catch (err) {
                console.error('Error checking existing session:', err);
            }

            // Process Google auth code exchange
            console.log('Processing Google authentication with URL:', window.location.href);
            try {
                const result = await exchangeAuthCodeForToken();
                if (result.success) {
                    console.log('Authentication successful');
                    navigate('/');
                } else {
                    console.error('Authentication failed:', result.error);
                    setError(t('auth.error.authFailed'));
                }
            } catch (err) {
                console.error('Auth processing error:', err);
                setError(t('auth.error.duringAuth'));
            }
        }
        processAuth();
    }, [navigate, t]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 p-4 rounded-md text-red-700">
                    <h2 className="text-lg font-medium text-center">{t('auth.error.title')}</h2>
                    <p>{error}</p>
                    <div className="mt-4 flex space-x-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            {t('auth.error.returnToHome')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">{t('auth.processingAuthentication')}</p>
                <p className="text-sm text-gray-500 mt-2">{t('auth.pleaseWait')}</p>
            </div>
        </div>
    );
}