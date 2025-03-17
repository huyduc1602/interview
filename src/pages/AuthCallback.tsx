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
                // Extract code from URL
                const url = new URL(window.location.href);
                const code = url.searchParams.get('code');

                if (!code) {
                    setError('No code provided');
                    setLoading(false);
                    return;
                }

                // Exchange code for token
                const result = await exchangeAuthCodeForToken({code});
                if (!result.success) {
                    setError(result.error || 'Authentication failed');
                    setLoading(false);
                    return;
                }

                // Redirect to home page after successful login
                navigate('/');
            } catch (err) {
                console.error('Error during authentication callback:', err);
                setError(err instanceof Error ? err.message : 'Unknown error during authentication');
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
                    <p className="text-gray-500">{t('auth.pleaseWait') || 'Please wait...'}</p>
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

    return null;
}
