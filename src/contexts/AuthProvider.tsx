import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/common';
import { AuthError } from '@supabase/supabase-js';

interface AuthContextProps {
    user: User | null;
    login: (email: string) => void;
    loginWithGoogle: () => Promise<{ success: boolean; error?: AuthError } | { success: boolean; error: AuthError }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, login, loginWithGoogle, logout } = useAuth();

    return (
        <AuthContext.Provider value={{ user, login, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};