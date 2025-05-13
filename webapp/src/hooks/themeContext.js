import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the theme context
const ThemeContext = createContext();

// Storage key for theme preference
const THEME_STORAGE_KEY = 'themePreference';

// Theme options
export const THEMES = {
  DARK: 'dark',
  LIGHT: 'light'
};

export const ThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage or default to dark
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme || THEMES.DARK;
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    // Add or remove the 'light-theme' class on the document body
    if (theme === THEMES.LIGHT) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => 
      prevTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
    );
  };

  // Check if the current theme is dark
  const isDarkTheme = theme === THEMES.DARK;

  // Context value
  const contextValue = {
    theme,
    isDarkTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for using the theme context
export const useTheme = () => useContext(ThemeContext);
