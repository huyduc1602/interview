import { createClient } from '@supabase/supabase-js';
import { User } from '@/types/common';

const SUPABASE_URL = 'https://nusledxyrnjehfiohsmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51c2xlZHh5cm5qZWhmaW9oc216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDM4NDMsImV4cCI6MjA1NzMxOTg0M30.MQYt9hSlObGX2dnsDsUXDq91T5aVZBStrwKjIZTGElA';

// Get base URL for the current environment
const getBaseUrl = () => {
    // When running in production on GitHub Pages
    if (window.location.hostname !== 'localhost') {
        // Get the GitHub Pages base path (e.g. /interview/)
        const pathSegments = window.location.pathname.split('/');
        const repoName = pathSegments[1]; // The repo name should be the first path segment
        return `/${repoName}`;
    }
    return ''; // No base path needed for localhost
};

// Configure auth redirect URLs based on environment
const SITE_URL = window.location.origin + getBaseUrl();

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
    }
});

const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

async function exchangeAuthCodeForToken() {
    try {
        console.log('Starting auth code exchange process');
        console.log('Current URL:', window.location.href);
        console.log('Search params:', window.location.search);
        console.log('Hash fragment:', window.location.hash);

        // First, check if we have a session already
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData?.session) {
            console.log('Session already exists, no need to exchange code');
            const user = sessionData.session.user;

            // Create user object with necessary properties
            const googleUser = {
                id: user.id,
                name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
                email: user.email,
                provider: 'google'
            } as User;

            // Store user in localStorage for persistence
            localStorage.setItem('current_user', JSON.stringify(googleUser));

            return { success: true, user: googleUser };
        }

        // Check for auth code in URL
        const params = new URLSearchParams(window.location.search);
        const authCode = params.get('code');
        const codeVerifier = localStorage.getItem('code_verifier');

        if (!authCode || !codeVerifier) {
            console.error('Missing auth_code or code_verifier');

            // Try Supabase's built-in method as fallback
            console.log('Trying Supabase built-in exchangeCodeForSession...');
            const { data, error } = await supabase.auth.exchangeCodeForSession(
                window.location.search || window.location.hash.substring(1)
            );

            if (error || !data.session) {
                console.error('Supabase exchange failed:', error);
                return { success: false, error: error || new Error('No session created') };
            }

            const user = data.session.user;

            // Create user object with necessary properties
            const googleUser = {
                id: user.id,
                name: user.user_metadata.full_name || user.email?.split('@')[0] || 'User',
                email: user.email,
                provider: 'google'
            } as User;

            // Store user in localStorage for persistence
            localStorage.setItem('current_user', JSON.stringify(googleUser));

            return { success: true, user: googleUser };
        }

        console.log('Exchanging auth code for token...');
        const response = await fetch(
            "https://nusledxyrnjehfiohsmz.supabase.co/auth/v1/token?grant_type=pkce",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ auth_code: authCode, code_verifier: codeVerifier }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Token exchange failed:', errorData);
            return { success: false, error: new Error(errorData.error_description || 'Failed to exchange token') };
        }

        const data = await response.json();
        console.log('Access Token received:', data);

        // Now get the user from the session
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
            console.error('Failed to get user:', userError);
            return { success: false, error: userError || new Error('User not found') };
        }

        // Create user object with necessary properties
        const googleUser = {
            id: userData.user.id,
            name: userData.user.user_metadata.full_name || userData.user.email?.split('@')[0] || 'User',
            email: userData.user.email,
            provider: 'google'
        } as User;

        // Store user in localStorage for persistence
        localStorage.setItem('current_user', JSON.stringify(googleUser));

        return { success: true, user: googleUser };
    } catch (error) {
        console.error('Error in exchangeAuthCodeForToken:', error);
        return { success: false, error };
    }
}

export { supabase, generateCodeVerifier, exchangeAuthCodeForToken };