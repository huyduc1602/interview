import React from 'react';
import { useTranslation } from 'react-i18next';
import BookOpen from '@/components/icons/BookOpen';
import Brain from '@/components/icons/Brain';
import MessageSquare from '@/components/icons/MessageSquare';
import FeatureCard from '@/components/home/FeatureCard';

const FeaturesGrid: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="grid md:grid-cols-3 gap-8 pb-16 max-w-5xl mx-auto">
            <FeatureCard
                to="/knowledge"
                icon={<BookOpen />}
                title={t('home.features.knowledgeBase.title')}
                description={t('home.features.knowledgeBase.description')}
                action={t('home.features.knowledgeBase.action')}
                bgColor="bg-purple-100"
                iconColor="text-purple-600"
                textColor="text-gray-900"
                hoverTextColor="text-purple-600 group-hover:text-purple-700"
            />
            <FeatureCard
                to="/questions"
                icon={<Brain />}
                title={t('home.features.interviewQuestions.title')}
                description={t('home.features.interviewQuestions.description')}
                action={t('home.features.interviewQuestions.action')}
                bgColor="bg-blue-100"
                iconColor="text-blue-600"
                textColor="text-gray-900"
                hoverTextColor="text-blue-600 group-hover:text-blue-700"
            />
            <FeatureCard
                to="/chat"
                icon={<MessageSquare />}
                title={t('home.features.chat.title')}
                description={t('home.features.chat.description')}
                action={t('home.features.chat.action')}
                bgColor="bg-green-100"
                iconColor="text-green-600"
                textColor="text-gray-900"
                hoverTextColor="text-green-600 group-hover:text-green-700"
            />
        </div>
    );
};

export default FeaturesGrid;