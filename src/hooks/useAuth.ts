import { useState, useEffect } from 'react';
import { generateCodeVerifier, supabase } from '@/supabaseClient';
import { User } from '@/types/common';
import { generateId } from '@/utils/supabaseUtils';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLoginGoogle, setIsLoginGoogle] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        if (!isLoginGoogle) return;

        // Check if user is logged in with Supabase
        const fetchSession = async () => {
            const { data: session } = await supabase.auth.getSession();
            if (session?.session?.user) {
                const supabaseUser = {
                    id: session.session.user.id,
                    name: session.session.user.user_metadata.full_name ||
                        session.session.user.email?.split('@')[0] ||
                        'User',
                    email: session.session.user.email
                } as User;
                setUser(supabaseUser);
                localStorage.setItem('current_user', JSON.stringify(supabaseUser));
            }
        };

        fetchSession();

        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    setLoading(true);
                    const authUser = convertSupabaseUserToUser(session.user);
                    setUser(authUser);
                    setSession(session);
                    localStorage.setItem('current_user', JSON.stringify(authUser));
                    setLoading(false);
                }

                if (event === 'SIGNED_OUT') {
                    setUser(null);
                    localStorage.removeItem('current_user');
                }
            }
        );

        // Clean up subscription
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const convertSupabaseUserToUser = (supabaseUser: SupabaseUser): User | null => {
        return supabaseUser ? {
            id: supabaseUser?.id,
            name: supabaseUser.user_metadata?.full_name || supabaseUser?.email?.split('@')[0] || 'User',
            email: supabaseUser?.email || ''
        } : null
    }

    const login = (email: string) => {
        const currentUserExist = localStorage.getItem('current_user');
        const currentUserExistObject: User | null = currentUserExist ? JSON.parse(currentUserExist) : null

        if (currentUserExistObject?.email == email) {
            setUser(currentUserExistObject);
        } else {
            const user = {
                id: generateId(),
                name: email.split('@')[0],
                email
            };
            setUser(user);
            localStorage.setItem('current_user', JSON.stringify(user));
        }
    };

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

    const loginWithGoogle = async () => {
        const codeVerifier = generateCodeVerifier();
        localStorage.setItem('code_verifier', codeVerifier);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/auth/callback'
            }
        });

        if (error) {
            console.error('Login failed:', error);
        } else {
            setIsLoginGoogle(true);
            window.location.href = data.url; // Redirect user
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const isGoogleUser = (): boolean => {
        if (user && user.email && user.email.endsWith('@gmail.com')) return true
        return false;
    };

    return { user, session, loading, login, loginWithGoogle, logout, isGoogleUser };
}