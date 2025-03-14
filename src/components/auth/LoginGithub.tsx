import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const LoginGithub: React.FC = () => {
    const { t } = useTranslation();
    const { signInWithGithub } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGithubLogin = async () => {
        setIsLoading(true);
        setError(null);

        try {
            await signInWithGithub();
        } catch (err) {
            console.error('GitHub login error:', err);
            setError(typeof err === 'string' ? err : t('auth.errorGeneric'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-4">
            <Button
                type="button"
                onClick={handleGithubLogin}
                disabled={isLoading}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
            >
                {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                )}
                <span>{isLoading ? t('auth.signingIn') : t('auth.signInWithGithub')}</span>
            </Button>

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default LoginGithub;
