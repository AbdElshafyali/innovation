import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [language, setLanguage] = useLocalStorage('language', 'ar');
  const [currency, setCurrency] = useLocalStorage('currency', 'EGP');
  const [country, setCountry] = useLocalStorage('country', 'EG');

  const value = {
    language,
    setLanguage,
    currency,
    setCurrency,
    country,
    setCountry,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};
