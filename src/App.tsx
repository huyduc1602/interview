import { Route, Routes } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import HomePage from "@/pages/HomePage";
import KnowledgeBase from '@/pages/KnowledgeBase';
import InterviewQuestions from '@/pages/InterviewQuestions';
import ChatPage from '@/pages/ChatPage';
import Settings from '@/pages/Settings';
import ApiKeyGuide from '@/pages/ApiKeyGuide';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/contexts/AuthProvider';
import AuthCallback from '@/pages/AuthCallback';
import AuthorizeRedirect from '@/pages/AuthorizeRedirect';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { Suspense, useEffect, useState } from 'react';
import './i18n';

// Simple loading component
const AppLoading = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">Loading...</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { i18n, ready } = useTranslation();
  const [isI18nReady, setIsI18nReady] = useState(false);

  // Wait for i18n to be ready
  useEffect(() => {
    if (ready) {
      // Small delay to ensure translations are applied
      const timer = setTimeout(() => {
        setIsI18nReady(true);
        document.documentElement.lang = i18n.language;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [ready, i18n.language]);

  if (!isI18nReady) {
    return <AppLoading />;
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ErrorBoundary>
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route index path="/" element={<HomePage />} />
              <Route path="/knowledge" element={<KnowledgeBase />} />
              <Route path="/questions" element={<InterviewQuestions />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/api-key-guide" element={<ApiKeyGuide />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/v1/authorize" element={<AuthorizeRedirect />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </ErrorBoundary>
      </div>
    </AuthProvider>
  );
};

const App: React.FC = () => {
  return (
    <Suspense fallback={<AppLoading />}>
      <AppContent />
    </Suspense>
  );
};

export default App;
