import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/services/AuthService';

export default function AuthCallback() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function handleCallback() {
            try {
                // Get the authorization code from the URL
                const params = new URLSearchParams(window.location.search);
                const code = params.get('code');

                if (!code) {
                    throw new Error('Authorization code not found in the callback URL');
                }

                // Get stored code verifier
                const codeVerifier = localStorage.getItem('code_verifier');
                if (!codeVerifier) {
                    throw new Error('Code verifier not found in storage');
                }

                // Use a proxy service to exchange the code for a token
                // (This avoids exposing your client secret in the frontend)
                const tokenResponse = await fetch('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        client_id: AuthService.getClientId(),
                        // Note: Using a proxy requires you to handle the client_secret securely
                        // In a production app, you would use a small serverless function for this step
                        code: code,
                        redirect_uri: AuthService.getRedirectUri(),
                        code_verifier: codeVerifier
                    })
                });

                const tokenData = await tokenResponse.json();

                if (tokenData.error) {
                    throw new Error(`Token exchange failed: ${tokenData.error_description}`);
                }

                // Get user data with the access token
                const userResponse = await fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `token ${tokenData.access_token}`
                    }
                });

                const userData = await userResponse.json();

                // Store authentication data
                AuthService.setAuthData(tokenData.access_token, userData);

                // Redirect to home page or dashboard
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return <div>Authentication successful! Redirecting...</div>;
}
