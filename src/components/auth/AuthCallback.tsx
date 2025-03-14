import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/supabaseClient';
import type { User } from '@/types/common';

export default function AuthCallback() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Debug: log environment and URL details
                console.debug("Environment:", process.env.NODE_ENV);
                console.debug("Current URL:", window.location.href);

                // Retrieve and verify the stored PKCE code verifier
                const codeVerifier = localStorage.getItem('pkce_code_verifier') || '';
                console.debug("Retrieved code_verifier:", codeVerifier);
                if (!codeVerifier) {
                    throw new Error('Missing PKCE code verifier');
                }

                // Pass the code_verifier along with the auth_code from the URL
                const { data, error } = await supabase.auth.exchangeCodeForSession(
                    `${window.location.href}&code_verifier=${codeVerifier}`
                );
                // Debug: log response data and error
                console.debug("Response from exchangeCodeForSession:", { data, error });

                if (error) {
                    throw error;
                }
                if (!data.session) {
                    throw new Error('No session found');
                }
                const { user } = data.session;
                if (!user) {
                    throw new Error('No user found in session');
                }
                // Create user object with necessary properties
                const googleUser = {
                    id: user.id,
                    name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
                    email: user.email
                } as User;

                // Store user in localStorage for persistence
                localStorage.setItem('current_user', JSON.stringify(googleUser));

                console.log('Authentication successful, redirecting...');
                navigate('/');
            } catch (err) {
                console.error('Authentication error details:', err);
                setError(err instanceof Error ? err.message : 'Authentication failed');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    // Show a loading state while processing
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-red-50 p-4 rounded-md text-red-700">
                    <h2 className="text-lg font-medium">Authentication Error</h2>
                    <p>{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Logging you in...</p>
            </div>
        </div>
    );
}