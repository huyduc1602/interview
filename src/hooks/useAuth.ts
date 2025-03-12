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

        // Check if user is logged in with Google
        const fetchSession = async () => {
            const { data: session } = await supabase.auth.getSession();
            if (session?.session?.user) {
                const googleUser = {
                    id: session.session.user.id,
                    name: session.session.user.user_metadata.full_name,
                    email: session.session.user.email
                } as User;
                setUser(googleUser);
                localStorage.setItem('current_user', JSON.stringify(googleUser));
            }
        };

        fetchSession();
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
        await supabase.auth.signInWithOAuth({ provider: 'google' });
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