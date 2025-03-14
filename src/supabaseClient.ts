import { createClient } from '@supabase/supabase-js';
import { User } from '@/types/common';

const SUPABASE_URL = 'https://nusledxyrnjehfiohsmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51c2xlZHh5cm5qZWhmaW9oc216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDM4NDMsImV4cCI6MjA1NzMxOTg0M30.MQYt9hSlObGX2dnsDsUXDq91T5aVZBStrwKjIZTGElA';
const SITE_URL = window.location.origin;
const REDIRECT_URL = `${SITE_URL}/auth/callback`;

console.log('Using auth redirect URL:', REDIRECT_URL);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
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

        // Check for auth code in URL from multiple sources
        const searchParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, '?'));

        // Log more details for debugging
        console.log('Raw search params:', window.location.search);
        console.log('Raw hash fragment:', window.location.hash);
        console.log('Parsed search params:', Object.fromEntries(searchParams.entries()));
        console.log('Parsed hash params:', Object.fromEntries(hashParams.entries()));

        // Try to get code from search params first, then from hash params
        const authCode = searchParams.get('code') || hashParams.get('code');
        const codeVerifier = localStorage.getItem('code_verifier');

        console.log('Extracted auth code exists:', !!authCode);
        console.log('Code verifier exists:', !!codeVerifier);

        if (!authCode || !codeVerifier) {
            console.error('Missing auth_code or code_verifier');

            // Additional debug info
            if (!authCode) console.error('Auth code not found in URL');
            if (!codeVerifier) console.error('Code verifier not found in localStorage');

            // Try Supabase's built-in method as fallback
            console.log('Trying Supabase built-in exchangeCodeForSession...');

            // Pass both search and hash to be safe
            const urlParamString = window.location.search ||
                (window.location.hash ? window.location.hash.replace(/^#/, '?') : '');

            console.log('Passing to exchangeCodeForSession:', urlParamString);

            const { data, error } = await supabase.auth.exchangeCodeForSession(urlParamString);

            if (error) {
                console.error('Supabase exchange failed:', error);
                return { success: false, error };
            }

            if (!data.session) {
                console.error('No session created after code exchange');
                return { success: false, error: new Error('No session created') };
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