import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, X } from 'lucide-react';
import ApiKeyForm from '@/components/apiKeyForm';
import { useTranslation } from 'react-i18next';

interface SettingsButtonProps {
    onSubmit: (apiKey: string, spreadsheetId: string) => Promise<void>;
    sheetName?: string;
    isLoading: boolean;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onSubmit, sheetName, isLoading }) => {
    const { t } = useTranslation();
    const [isApiKeyFormVisible, setIsApiKeyFormVisible] = useState(false);

    return (
        <>
            <div className="fixed bottom-4 left-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsApiKeyFormVisible(!isApiKeyFormVisible)}
                    className="group flex items-center"
                >
                    <Settings className="w-4 h-4 mr-2" />
                    <span className="group-hover:inline-block hidden">
                        {t('common.settings')}
                    </span>
                </Button>
            </div>
            {isApiKeyFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                            onClick={() => setIsApiKeyFormVisible(false)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        {isLoading ? (
                            <div className="text-center">
                                <p>{t('common.loading')}</p>
                            </div>
                        ) : (
                                <ApiKeyForm onSubmit={onSubmit} sheetNameProp={sheetName} setIsApiKeyFormVisible={setIsApiKeyFormVisible} />
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SettingsButton;