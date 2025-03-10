import React, { useState, FormEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/LoginForm';
import { AIResponseDisplay } from '@/components/ai/AIResponseDisplay';
import MessageSquare from '@/components/icons/MessageSquare';
import Send from '@/components/icons/Send';

const LoginChatSection: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [chatInput, setChatInput] = useState('');

    const {
        loading,
        generateAnswer,
        answer,
        error,
        setAnswer
    } = useChat({ type: 'chat' }, user);

    const handleChatSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        try {
            const response = await generateAnswer(chatInput);
            if (response) {
                setAnswer(response);
                setChatInput('');
            }
        } catch (error) {
            console.error('Chat error:', error);
        }
    };

    useEffect(() => {
        if (user) {
            setChatInput('');
            setAnswer('');
        }
    }, [user, setAnswer]);

    return (
        <div className="max-w-2xl mx-auto mt-8 mb-5 p-6 bg-white rounded-xl shadow-lg">
            {!user && !showLoginForm && (
                <div className="text-center">
                    <Button
                        onClick={() => setShowLoginForm(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-center"
                    >
                        {t('auth.login')}
                    </Button>
                </div>
            )}

            {!user && showLoginForm && (
                <div className="max-w-sm mx-auto">
                    <h2 className="text-xl font-semibold mb-4">{t('auth.loginTitle')}</h2>
                    <LoginForm onSuccess={() => window.location.reload()} />
                </div>
            )}

            {user && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        {t('home.chat.welcome', {
                            name: user?.email?.split('@')[0] || 'Guest'
                        })}
                    </div>

                    <AIResponseDisplay
                        loading={loading}
                        content={answer}
                        error={error}
                        emptyMessage={t('home.chat.startPrompt')}
                    />

                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder={t('home.chat.inputPlaceholder')}
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            disabled={loading || !chatInput.trim()}
                            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginChatSection;