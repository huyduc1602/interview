import { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AuthorizeRedirect() {
    const location = useLocation();
    const { t } = useTranslation();

    // Get all parameters from URL
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get('redirect_to');

    useEffect(() => {
        if (redirectTo) {
            console.log('Redirecting to:', redirectTo);
            window.location.href = removeTimestampFromUrl(redirectTo);
        }
    }, [redirectTo]);

    const removeTimestampFromUrl = (urlParamsString: string) => {
        const params = new URLSearchParams(urlParamsString.replace(/^[#?]/, ''));
        // Remove the timestamp parameter if it exists
        if (params.has('timestamp')) {
            params.delete('timestamp');
        }
        return '?' + params.toString();
    };

    // If no redirect_to parameter is present, redirect to the home page
    if (!redirectTo) {
        return <Navigate to="/" />;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="mt-4 text-gray-600">{t('auth.redirecting', 'Đang chuyển hướng...')}</p>
                <p className="text-sm text-gray-500 mt-2">{t('auth.pleaseWait', 'Vui lòng đợi')}</p>
            </div>
        </div>
    );
}
