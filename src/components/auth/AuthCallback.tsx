import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { exchangeAuthCodeForToken } from '@/supabaseClient';

export default function AuthCallback() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if localStorage is available and contains code_verifier
        try {
            const testStorage = 'test-storage';
            localStorage.setItem(testStorage, testStorage);
            localStorage.removeItem(testStorage);

            const hasCodeVerifier = !!localStorage.getItem('code_verifier');
            console.log('Local storage is available, code_verifier exists:', hasCodeVerifier);
            if (!hasCodeVerifier) {
                console.warn('No code_verifier found in localStorage!');
            }
        } catch (e) {
            console.error('Local storage is not available:', e);
        }

        let isMounted = true;

        async function handleAuth() {
            try {
                console.log('AuthCallback: Starting auth process');

                // Add a small delay to ensure URL parameters are fully available
                await new Promise(resolve => setTimeout(resolve, 100));

                const result = await exchangeAuthCodeForToken();

                if (!isMounted) return;

                if (!result.success) {
                    console.error('Auth failed:', result.error);
                    throw result.error;
                }

                console.log('Auth successful, redirecting to home');
                navigate("/");
            } catch (err) {
                if (!isMounted) return;

                console.error("Error during token exchange:", err);
                setError(err instanceof Error ? err.message : 'Authentication failed');
            }
        }

        handleAuth();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 p-4 rounded-md text-red-700">
                    <h2 className="text-lg font-medium">Authentication Error</h2>
                    <p>{error}</p>
                    <div className="mt-4 flex space-x-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Return to Home
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