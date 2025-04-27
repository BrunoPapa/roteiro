// src/components/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const languages = [
  { code: 'pt-BR', name: 'Português' },
  { code: 'en-US', name: 'English' }
];

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { isDarkMode } = useTheme();

  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    i18n.changeLanguage(langCode);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleLanguageChange}
      className={`px-3 py-1 rounded border ${
        isDarkMode 
          ? 'bg-gray-700 border-gray-600 text-white' 
          : 'bg-white border-gray-300 text-gray-900'
      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}

export default LanguageSwitcher;