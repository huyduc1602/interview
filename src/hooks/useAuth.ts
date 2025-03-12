import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { User } from '@/types/common';
import { generateId } from '@/utils/supabaseUtils';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);

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
                    const authUser = {
                        id: session.user.id,
                        name: session.user.user_metadata.full_name ||
                            session.user.email?.split('@')[0] ||
                            'User',
                        email: session.user.email
                    } as User;
                    setUser(authUser);
                    localStorage.setItem('current_user', JSON.stringify(authUser));
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

    const login = (email: string) => {
        const user = {
            id: generateId(),
            name: email.split('@')[0],
            email
        };
        setUser(user);
        localStorage.setItem('current_user', JSON.stringify(user));
    };

    const loginWithGoogle = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/auth/callback'
            }
        });
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('current_user');
    };

    const isGoogleUser = () => {
        return user && user.email && user.email.endsWith('@gmail.com');
    };

    return { user, login, loginWithGoogle, logout, isGoogleUser };
}