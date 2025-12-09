import React from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useTranslation } from 'react-i18next';
import { BookCopy } from 'lucide-react';

const NormalizationLogPage = () => {
  const { t } = useTranslation();
  const [normalizationLogs] = useLocalStorage('normalization_logs_db', []);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="p-4 md:p-8 flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t('normalization_logs', 'Normalization Logs')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('normalization_logs_subtitle', 'Activity log for product normalization actions.')}
          </p>
        </div>

        {normalizationLogs.length > 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('user', 'User')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('action', 'Action')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('item_name', 'Item Name')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('details', 'Details')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('processing_time', 'Processing Time')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('date', 'Date')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {normalizationLogs.map(log => (
                  <tr key={log.logId} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{log.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.action === 'mapped' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                      }`}>
                        {t(log.action, log.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{log.itemName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {log.action === 'mapped' 
                        ? `${t('mapped_to', 'Mapped to')}: ${log.mappedTo}`
                        : `${t('created_as', 'Created as')}: ${log.createdProduct}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatTime(log.processingTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <BookCopy size={48} className="mx-auto text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold">{t('no_logs_found', 'No Logs Found')}</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{t('no_normalization_activity_yet', 'There has been no normalization activity yet.')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NormalizationLogPage;
