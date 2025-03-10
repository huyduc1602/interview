import React from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="text-center space-y-8 pb-16">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent leading-normal">
                {t('home.hero.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('home.hero.subtitle')}
            </p>
        </div>
    );
};

export default HeroSection;