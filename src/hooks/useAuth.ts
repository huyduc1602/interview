import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { User, AuthProvider } from '@/types/common';
import { generateId } from '@/utils/supabaseUtils';
import { getVitePort } from '@/utils/viteUtils';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Add type declaration for Google Identity API
interface GoogleAccount {
    id: {
        initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
        }) => void;
        prompt: (callback: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            getNotDisplayedReason: () => string;
        }) => void) => void;
        renderButton: (container: HTMLElement, options: { type: string; theme?: string; size?: string; text?: string; shape?: string; }) => void;
    };
}

declare global {
    interface Window {
        google?: {
            accounts: GoogleAccount;
        };
    }
}

// Helper function to get provider from app_metadata
const getProviderFromMetadata = (appMetadata: { provider?: string, providers?: string[] }): AuthProvider => {
    if (appMetadata.providers?.length == 2) return appMetadata?.provider === 'github' ? AuthProvider.GOOGLE : (AuthProvider.GITHUB || AuthProvider.LOCAL);
    return appMetadata?.provider === 'github' ? AuthProvider.GITHUB : AuthProvider.GOOGLE;
};

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }

        // Check if user is logged in with Supabase
        const fetchSession = async () => {
            const { data: session } = await supabase.auth.getSession();
            if (session?.session?.user) {
                const supabaseUser = {
                    id: session.session.user.id,
                    name: session.session.user.user_metadata.full_name ||
                        session.session.user.email?.split('@')[0] ||
                        'User',
                    email: session.session.user.email,
                    isSocialLogin: true,
                    provider: getProviderFromMetadata(session.session.user.app_metadata)
                } as User;
                setUser(supabaseUser);
                localStorage.setItem('current_user', JSON.stringify(supabaseUser));
            }
            setLoading(false);
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
            email: supabaseUser?.email || '',
            isSocialLogin: true,
            provider: getProviderFromMetadata(supabaseUser.app_metadata)
        } : null
    }

    const login = (email: string) => {
        localStorage.setItem('auth_provider', AuthProvider.LOCAL);
        const currentUserExist = localStorage.getItem('current_user');
        const currentUserExistObject: User | null = currentUserExist ? JSON.parse(currentUserExist) : null

        if (currentUserExistObject?.email == email) {
            setUser(currentUserExistObject);
        } else {
            const user = {
                id: generateId(),
                name: email.split('@')[0],
                email,
                isSocialLogin: false,
                provider: AuthProvider.LOCAL
            };
            setUser(user);
            localStorage.setItem('current_user', JSON.stringify(user));
        }
    };

    const loginWithGoogle = async () => {
        try {
            // Save the provider before initiating login
            localStorage.setItem('auth_provider', AuthProvider.GOOGLE);

            // Get Google ID token through Google Identity API
            const getGoogleToken = () => {
                return new Promise<string>((resolve, reject) => {
                    if (!window.google) {
                        reject(new Error("Google API not loaded"));
                        return;
                    }
                    const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
                    if (!client_id) {
                        reject(new Error("Google Client ID not configured"));
                        return;
                    }
                    // Create hidden element to render Google login button
                    const googleDiv = document.createElement('div');
                    googleDiv.style.display = 'none';
                    document.body.appendChild(googleDiv);

                    window.google.accounts.id.initialize({
                        client_id: client_id,
                        callback: (response) => {
                            if (response.credential) {
                                document.body.removeChild(googleDiv);
                                resolve(response.credential);
                            } else {
                                document.body.removeChild(googleDiv);
                                reject(new Error("Could not get Google credentials"));
                            }
                        },
                        auto_select: true
                    });

                    window.google.accounts.id.renderButton(googleDiv, {
                        type: 'standard',
                        theme: 'outline',
                        size: 'large',
                        text: 'sign_in_with',
                        shape: 'rectangular'
                    });

                    const googleButton = googleDiv.querySelector('div[role="button"]') as HTMLElement;
                    if (googleButton) {
                        googleButton.click();
                    } else {
                        document.body.removeChild(googleDiv);
                        reject(new Error("Could not create Google login button"));
                    }
                });
            };

            // Delete old session if any
            await supabase.auth.signOut();
            // Add a 500ms delay to ensure logout process is completed
            await new Promise(resolve => setTimeout(resolve, 500));

            // Get token from Google
            const googleIdToken = await getGoogleToken();
            console.log('Google ID Token obtained:', googleIdToken.substring(0, 20) + '...');

            // Use token with Supabase
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: googleIdToken
            });
            if (error) {
                console.error('Google login failed:', error);
                return { success: false, error };
            }
            console.log('Google login successful:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Error during loginWithGoogle process:', error);
            return { success: false, error };
        }
    };

    const signInWithGithub = async () => {
        try {
            // Save the provider before initiating login
            localStorage.setItem('auth_provider', AuthProvider.GITHUB);

            const redirectUrl = window.location.origin.includes("localhost")
                ? `http://localhost:${getVitePort()}/auth/callback`
                : `${import.meta.env.SUPABASE_URL}/auth/callback`;
            console.log('Using redirect URL with timestamp:', redirectUrl);

            // Delete old session if any
            await supabase.auth.signOut();

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'github',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: false
                }
            });

            if (error) {
                console.error('Login with GitHub failed:', error);
                return { success: false, error };
            }

            if (!data || !data.url) {
                console.error('Login with GitHub failed: No data or URL');
                return { success: false, error: 'No data or URL' };
            }
            console.log('GitHub login initiated. Redirect URL data:', data);
            return { success: true };
        } catch (error) {
            console.error('Exception in signInWithGithub:', error);
            return { success: false, error };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const isSocialUser = (): boolean => {
        if (user && user.isSocialLogin && user.email) return true
        return false;
    };

    return { user, session, loading, login, loginWithGoogle, signInWithGithub, logout, isSocialUser };
}