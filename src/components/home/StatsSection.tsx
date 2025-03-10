import React from 'react';
import { useTranslation } from 'react-i18next';

const StatsSection: React.FC = () => {
    const { t } = useTranslation();

    return (
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
    );
};

export default StatsSection;