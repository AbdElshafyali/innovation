import React, { useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useSettings } from './SettingsContext';
import { useTranslation } from 'react-i18next';
import { arabCountries } from './constants';
import { useTheme } from './components/ThemeContext';

const SettingsPage = () => {
  const { language, setLanguage, country, setCountry, setCurrency } = useSettings();
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, setTheme } = useTheme();

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleCountryChange = (e) => {
    const selectedCountryCode = e.target.value;
    const selectedCountry = arabCountries.find(c => c.code === selectedCountryCode);
    if (selectedCountry) {
      setCountry(selectedCountry.code);
      setCurrency(selectedCountry.currency);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <SlidersHorizontal className="text-indigo-600" />
          {t('general_settings')}
        </h1>

        <div className="space-y-8">
          {/* Language Settings */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('language_settings')}</h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="language-select" className="text-gray-700">{t('app_language')}:</label>
              <select id="language-select" value={language} onChange={handleLanguageChange} className="p-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white">
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          {/* Currency Settings */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('currency_settings')}</h2>
            <div className="flex items-center space-x-4">
              <label htmlFor="country-select" className="text-gray-700">{t('country')}:</label>
              <select id="country-select" value={country} onChange={handleCountryChange} className="p-2 border rounded-lg bg-white dark:bg-slate-700 text-gray-800 dark:text-white">
                {arabCountries.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.name} ({c.currency})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
