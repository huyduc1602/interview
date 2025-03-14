import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { User } from '@/types/common';
import { generateId } from '@/utils/supabaseUtils';
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
                    email: session.session.user.email,
                    isGoogle: true
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
                email,
                isGoogle: false
            };
            setUser(user);
            localStorage.setItem('current_user', JSON.stringify(user));
        }
    };

    const loginWithGoogle = async () => {
        try {
            // Lấy Google ID token thông qua Google Identity API
            const getGoogleToken = () => {
                return new Promise<string>((resolve, reject) => {
                    if (!window.google) {
                        reject(new Error("Google API chưa được tải"));
                        return;
                    }
                    const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
                    if (!client_id) {
                        reject(new Error("Google Client ID không được cấu hình"));
                        return;
                    }
                    // Tạo element ẩn để render button đăng nhập Google
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
                                reject(new Error("Không thể lấy được Google credentials"));
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
                        reject(new Error("Không thể tạo button đăng nhập Google"));
                    }
                });
            };

            // Delete old session if any
            await supabase.auth.signOut();

            // Lấy token từ Google
            const googleIdToken = await getGoogleToken();
            console.log('Đã lấy Google ID Token:', googleIdToken.substring(0, 20) + '...');

            // Sử dụng token với Supabase
            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: googleIdToken
            });
            if (error) {
                console.error('Đăng nhập Google thất bại:', error);
                return { success: false, error };
            }
            console.log('Đăng nhập Google thành công:', data);
            setIsLoginGoogle(true);
            return { success: true, data };
        } catch (error) {
            console.error('Lỗi trong quá trình loginWithGoogle:', error);
            return { success: false, error };
        }
    };

    const signInWithGithub = async () => {
        try {
            // Add timestamp to avoid cache
            const timestamp = new Date().getTime();

            // Check if we're on localhost and use appropriate redirect URL
            let baseUrl = window.location.origin;
            // For local development, ensure we're using localhost
            if (!baseUrl.includes('localhost') && process.env.NODE_ENV === 'development') {
                // Get port from environment variables or window.location
                const port = import.meta.env.VITE_PORT || window.location.port || '5173';
                baseUrl = `http://localhost:${port}`;
            }

            const redirectUrl = `${baseUrl}/auth/callback?timestamp=${timestamp}`;
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
            setIsLoginGoogle(true);
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

    const isGoogleUser = (): boolean => {
        if (user && user.isGoogle && user.email && user.email.endsWith('@gmail.com')) return true
        return false;
    };

    return { user, session, loading, login, loginWithGoogle, signInWithGithub, logout, isGoogleUser };
}