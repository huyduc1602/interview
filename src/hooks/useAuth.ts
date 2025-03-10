import { useState, useEffect } from 'react';
import { User } from '@/types/common';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Load user from localStorage on mount
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (email: string) => {
        const user = {
            id: Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email
        };
        setUser(user);
        localStorage.setItem('current_user', JSON.stringify(user));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('current_user');
    };

    return { user, login, logout };
}