import { t } from "i18next";

export function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <span className="animate-spin">⏳</span>
      <span>{t('common.generateAnswer')}</span>
    </div>
  );
}