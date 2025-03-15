import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeAuthCodeForToken } from '@/supabaseClient';
import { useTranslation } from 'react-i18next';

export default function AuthCallback() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        async function handleCallback() {
            try {
                // Let Supabase handle the authentication callback
                console.log('Processing authentication callback...');

                // Use the exchangeAuthCodeForToken function from supabaseClient
                const result = await exchangeAuthCodeForToken();
                console.debug('AUTH CALLBACK: result ', result);
                if (!result.success) {
                    console.debug('AUTH CALLBACK: result.error ', result.error)
                    throw new Error((result.error as ErrorCallback)?.name || 'Authentication failed');
                }

                // Successful authentication, redirect to home page
                console.log('Authentication successful, redirecting to home page');
                navigate('/');
            } catch (err) {
                console.error('Authentication error:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed');
            } finally {
                setLoading(false);
            }
        }

        handleCallback();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-medium mb-2">{t('auth.processingAuthentication')}</h2>
                    <p className="text-gray-500">{t('auth.pleaseWait')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
                    <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-xl font-bold text-red-800 mb-2">{t('auth.error.title')}</h2>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        {t('auth.backToHome')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-xl font-medium mb-2">{t('auth.authSuccess')}</h2>
                <p className="text-gray-500">{t('auth.redirecting')}</p>
            </div>
        </div>
    );
}
