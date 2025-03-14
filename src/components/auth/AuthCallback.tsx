import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeAuthCodeForToken, supabase } from '@/supabaseClient';
import { useTranslation } from 'react-i18next';

export default function AuthCallback() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        // Kiểm tra về việc có session không ngay từ đầu
        async function checkExistingSession() {
            try {
                const { data } = await supabase.auth.getSession();
                if (data?.session) {
                    console.log('Session exists on load');

                    // Cập nhật user và chuyển hướng
                    const user = data.session.user;
                    const googleUser = {
                        id: user.id,
                        name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
                        email: user.email,
                        provider: 'google'
                    };
                    localStorage.setItem('current_user', JSON.stringify(googleUser));

                    // Đảm bảo chuyển hướng sau khi đã lưu user
                    setTimeout(() => navigate('/'), 100);
                    return true;
                }
                return false;
            } catch (err) {
                console.error('Error checking session:', err);
                return false;
            }
        }

        async function processAuth() {
            // Kiểm tra nếu đã có session trước
            if (await checkExistingSession()) return;

            // Kiểm tra extra parameters
            console.log('Full URL:', window.location.href);
            console.log('Current search:', window.location.search);
            console.log('Current hash:', window.location.hash);

            // Thử xử lý tất cả fragments, search params nếu có
            try {
                // Sử dụng hàm callback của Supabase
                const { error } = await supabase.auth.getSession();
                if (error) console.warn('getSession error:', error);

                // Thử exchange code từ URL
                const result = await exchangeAuthCodeForToken();

                if (result.success) {
                    console.log('Authentication successful');
                    navigate('/');
                } else {
                    console.error('Authentication failed:', result.error);
                    setError('Authentication failed. Please try again.');
                }
            } catch (err) {
                console.error('Auth processing error:', err);
                setError('Error during authentication. Please try again.');
            }
        }

        processAuth();
    }, [navigate]);

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
                <p className="mt-4 text-gray-600">Processing authentication...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait...</p>
            </div>
        </div>
    );
}