import { useState, useEffect } from 'react';

function getStorageValue(key, defaultValue) {
  // We need to wrap this in a try...catch block
  // because JSON.parse can throw an error if the data in localStorage is corrupted.
  try {
    const saved = localStorage.getItem(key);
    const initial = saved ? JSON.parse(saved) : defaultValue;
    return initial;
  } catch (error) {
    console.error(`Error parsing localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};