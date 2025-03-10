import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import HomePage from "./pages/HomePage";
import KnowledgeBase from './pages/KnowledgeBase';
import InterviewQuestions from './pages/InterviewQuestions';
import ChatPage from './pages/ChatPage';
import Settings from './pages/Settings';
import ApiKeyGuide from '@/pages/ApiKeyGuide';
import './i18n';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/questions" element={<InterviewQuestions />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/api-key-guide" element={<ApiKeyGuide />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
