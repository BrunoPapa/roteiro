// src/components/NavigationBar.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from './ui/button';
import { ChevronLeft, Sun, Moon } from 'lucide-react';

// SVG icons for sun and moon
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

function NavigationBar() {
  const { isDarkMode, toggleDarkMode: toggleTheme, fontSize, setFontSize } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const fontSizes = ['small', 'medium', 'large'];
  const isProjectPage = location.pathname.includes('/project/');

  return (
    <nav
      className={`px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md flex items-center justify-between`}
    >
      <div className="flex items-center gap-4 relative z-50">
        {isProjectPage && (
          <Button
            variant="ghost"
            className="flex items-center gap-2 bg-opacity-90 backdrop-blur-sm"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="h-4 w-4" />
            {t('common.backToProjects')}
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Font Size Controls */}
        <div className="flex items-center gap-2">
          {fontSizes.map((size) => (
            <Button
              key={size}
              variant={fontSize === size ? 'secondary' : 'ghost'}
              onClick={() => setFontSize({
                small: 14,
                medium: 16,
                large: 18
              }[size])}
              className="px-3 py-1"
              style={{ fontSize: `${size === 'small' ? 14 : size === 'medium' ? 16 : 18}px` }}
            >
              A
            </Button>
          ))}
        </div>

        {/* Language Switcher */}
        <LanguageSwitcher />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          title={t(`common.darkMode.${isDarkMode ? 'light' : 'dark'}`)}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </nav>
  );
}

export default NavigationBar;