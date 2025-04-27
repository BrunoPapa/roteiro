// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{
      isDarkMode,
      toggleDarkMode,
      fontSize,
      setFontSize
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}