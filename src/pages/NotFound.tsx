import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
            <h1 className="text-6xl font-bold mb-4">{t('notFound.title')}</h1>
            <p className="text-xl mb-8">{t('notFound.message')}</p>
            <Link to="/" className="text-blue-600 hover:underline">
                {t('notFound.homeLink')}
            </Link>
        </div>
    );
};

export default NotFound;