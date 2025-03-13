import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Key, Upload } from 'lucide-react';
import CSV from '@/components/icons/CSV';
import { useTranslation } from 'react-i18next';
import { downloadSampleCsv } from '@/utils/downloadSampleCsv';

interface SettingsActionsProps {
    onSave: () => void;
    showKeys: boolean;
    setShowKeys: (show: boolean) => void;
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDownloadSampleKeys: () => void;
    saved: boolean;
}

const SettingsActions: React.FC<SettingsActionsProps> = ({
    onSave,
    showKeys,
    setShowKeys,
    onFileUpload,
    onDownloadSampleKeys,
    saved
}) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap items-center gap-4">
            <Button
                onClick={onSave}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300 w-full sm:w-auto"
            >
                {t('settings.save')}
            </Button>

            {saved && (
                <span className="text-sm text-green-600 w-full sm:w-auto">
                    {t('settings.saved')}
                </span>
            )}

            <Button
                variant="outline"
                onClick={() => setShowKeys(!showKeys)}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-2 px-4 rounded transition duration-300 w-full sm:w-auto"
            >
                {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />} &nbsp;
                {showKeys ? t('settings.hideKeys') : t('settings.showKeys')}
            </Button>

            <label className="flex items-center gap-2 cursor-pointer w-full sm:w-auto bg-purple-700 py-4 px-2 rounded">
                <Upload className="w-4 h-4 text-white" />
                <span className="text-white font-semibold">{t('settings.upload')}</span>
                <input
                    type="file"
                    accept=".txt"
                    onChange={onFileUpload}
                    className="hidden"
                />
            </label>

            <Button
                variant="outline"
                onClick={onDownloadSampleKeys}
                className="border border-gray-300 hover:border-gray-400 text-white bg-yellow-400 font-semibold py-2 px-4 rounded transition duration-300 w-full sm:w-auto"
            >
                <Key className="w-4 h-4 mr-2" />
                {t('settings.downloadSample')}
            </Button>

            <Button
                variant="outline"
                onClick={downloadSampleCsv}
                className="border border-gray-300 hover:border-gray-400 bg-green-400 text-white font-semibold py-2 px-4 rounded transition duration-300 w-full sm:w-auto"
            >
                <CSV className="w-4 h-4 mr-2" />
                {t('settings.downloadSampleCsv')}
            </Button>
        </div>
    );
};

export default SettingsActions;