import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nusledxyrnjehfiohsmz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51c2xlZHh5cm5qZWhmaW9oc216Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3NDM4NDMsImV4cCI6MjA1NzMxOTg0M30.MQYt9hSlObGX2dnsDsUXDq91T5aVZBStrwKjIZTGElA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const generateCodeVerifier = () => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function exchangeAuthCodeForToken() {
    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('code');
    const codeVerifier = localStorage.getItem('code_verifier');

    if (!authCode || !codeVerifier) {
        console.error('Missing auth_code or code_verifier');
        return;
    }

    const response = await fetch(
        "https://nusledxyrnjehfiohsmz.supabase.co/auth/v1/token?grant_type=pkce",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ auth_code: authCode, code_verifier: codeVerifier }),
        }
    );

    const data = await response.json();
    console.log('Access Token:', data);
}

export { supabase, generateCodeVerifier, exchangeAuthCodeForToken };