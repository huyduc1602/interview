import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import BookOpen from '@/components/icons/BookOpen';
import Brain from '@/components/icons/Brain';
import ArrowRight from '@/components/icons/ArrowRight';
import MessageSquare from '@/components/icons/MessageSquare';
import Send from '@/components/icons/Send';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/LoginForm';
import { AIResponseDisplay } from '@/components/ai/AIResponseDisplay';

const HomePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [chatInput, setChatInput] = useState('');

    const {
        loading,
        generateAnswer,
        answer,
        error,
        setAnswer  // Make sure useChat returns this
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                {/* Hero Section with Login/Chat */}
                <div className="text-center space-y-8 pb-16">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-normal">
                        {t('home.hero.title')}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {t('home.hero.subtitle')}
                    </p>

                    {/* Login/Chat Section */}
                    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
                        {!user && !showLoginForm && (
                            <div className="text-center">
                                <Button
                                    onClick={() => setShowLoginForm(true)}
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    {t('auth.login')}
                                </Button>
                            </div>
                        )}

                        {!user && showLoginForm && (
                            <div className="max-w-sm mx-auto">
                                <h2 className="text-xl font-semibold mb-4">{t('auth.loginTitle')}</h2>
                                <LoginForm onSuccess={() => setShowLoginForm(false)} />
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
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 pb-16 max-w-5xl mx-auto">
                    {/* Knowledge Base Card */}
                    <Link
                        to="/knowledge"
                        className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="flex items-start gap-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                                <BookOpen className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    {t('home.features.knowledgeBase.title')}
                                </h3>
                                <p className="text-gray-600">
                                    {t('home.features.knowledgeBase.description')}
                                </p>
                                <div className="flex items-center text-purple-600 group-hover:text-purple-700">
                                    {t('home.features.knowledgeBase.action')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Interview Questions Card */}
                    <Link
                        to="/questions"
                        className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="flex items-start gap-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                <Brain className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    {t('home.features.interviewQuestions.title')}
                                </h3>
                                <p className="text-gray-600">
                                    {t('home.features.interviewQuestions.description')}
                                </p>
                                <div className="flex items-center text-blue-600 group-hover:text-blue-700">
                                    {t('home.features.interviewQuestions.action')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Chat Card */}
                    <Link
                        to="/chat"
                        className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="flex items-start gap-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <MessageSquare className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    {t('home.features.chat.title')}
                                </h3>
                                <p className="text-gray-600">
                                    {t('home.features.chat.description')}
                                </p>
                                <div className="flex items-center text-green-600 group-hover:text-green-700">
                                    {t('home.features.chat.action')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Stats Section */}
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-t">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900">
                                {t('home.stats.knowledgeTopics.value')}
                            </div>
                            <div className="text-sm text-gray-600">
                                {t('home.stats.knowledgeTopics.label')}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900">
                                {t('home.stats.questions.value')}
                            </div>
                            <div className="text-sm text-gray-600">
                                {t('home.stats.questions.label')}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900">
                                {t('home.stats.categories.value')}
                            </div>
                            <div className="text-sm text-gray-600">
                                {t('home.stats.categories.label')}
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-gray-900">
                                {t('home.stats.aiSupport.value')}
                            </div>
                            <div className="text-sm text-gray-600">
                                {t('home.stats.aiSupport.label')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;