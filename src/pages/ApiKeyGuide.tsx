import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layout } from '@/layouts';

const ApiKeyGuide: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">{t('apiKeyGuide.title')}</h1>
                <div className="space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold mb-2">{t('apiKeyGuide.googleSheet.title')}</h2>
                        <p>{t('apiKeyGuide.googleSheet.description')}</p>
                        <ol className="list-decimal list-inside space-y-2 mt-2">
                            <li>{t('apiKeyGuide.googleSheet.steps.1')}</li>
                            <li>{t('apiKeyGuide.googleSheet.steps.2')}</li>
                            <li>{t('apiKeyGuide.googleSheet.steps.3')}</li>
                            <li>{t('apiKeyGuide.googleSheet.steps.4')}</li>
                        </ol>
                        <a
                            href="https://console.cloud.google.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {t('apiKeyGuide.googleSheet.link')}
                        </a>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-2">{t('apiKeyGuide.openai.title')}</h2>
                        <p>{t('apiKeyGuide.openai.description')}</p>
                        <ol className="list-decimal list-inside space-y-2 mt-2">
                            <li>{t('apiKeyGuide.openai.steps.1')}</li>
                            <li>{t('apiKeyGuide.openai.steps.2')}</li>
                            <li>{t('apiKeyGuide.openai.steps.3')}</li>
                        </ol>
                        <a
                            href="https://beta.openai.com/signup/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {t('apiKeyGuide.openai.link')}
                        </a>
                    </section>
                    <section>
                        <h2 className="text-2xl font-semibold mb-2">{t('apiKeyGuide.googleClient.title')}</h2>
                        <p>{t('apiKeyGuide.googleClient.description')}</p>
                        <ol className="list-decimal list-inside space-y-2 mt-2">
                            <li>{t('apiKeyGuide.googleClient.steps.1')}</li>
                            <li>{t('apiKeyGuide.googleClient.steps.2')}</li>
                            <li>{t('apiKeyGuide.googleClient.steps.3')}</li>
                            <li>{t('apiKeyGuide.googleClient.steps.4')}</li>
                        </ol>
                        <a
                            href="https://console.cloud.google.com/apis/credentials"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {t('apiKeyGuide.googleClient.link')}
                        </a>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default ApiKeyGuide;