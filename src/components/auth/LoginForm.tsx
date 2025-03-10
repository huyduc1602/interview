import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
    onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = () => {
    const [email, setEmail] = useState('');
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            login(email);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded"
                required
            />
            <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
                Login
            </button>
        </form>
    );
}