import React, { useEffect, createContext, useContext } from 'react';
import useThemeStore from '../store/Admin/useThemeStore';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const {
    currentTheme,
    themeConfig,
    initializeTheme,
    applyThemeToDOM,
    getCurrentTheme,
    setTheme
  } = useThemeStore();

  useEffect(() => {
    // Initialize theme on mount
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    // Apply theme whenever current theme changes
    applyThemeToDOM(currentTheme);
  }, [currentTheme, applyThemeToDOM]);

  useEffect(() => {
    // Handle system theme changes if enabled
    if (themeConfig.followSystemTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e) => {
        setTheme(e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleSystemThemeChange);
      
      // Set initial theme based on system preference
      setTheme(mediaQuery.matches ? 'dark' : 'light');

      return () => {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      };
    }
  }, [themeConfig.followSystemTheme, setTheme]);

  useEffect(() => {
    // Handle time-based theme switching
    if (themeConfig.autoSwitchByTime) {
      const checkTimeBasedTheme = () => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const [startHour, startMinute] = themeConfig.darkModeStart.split(':').map(Number);
        const [endHour, endMinute] = themeConfig.darkModeEnd.split(':').map(Number);
        
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;
        
        let isDarkTime = false;
        
        if (startTime > endTime) {
          // Overnight period (e.g., 18:00 to 06:00)
          isDarkTime = currentTime >= startTime || currentTime < endTime;
        } else {
          // Same day period (e.g., 06:00 to 18:00)
          isDarkTime = currentTime >= startTime && currentTime < endTime;
        }
        
        setTheme(isDarkTime ? 'dark' : 'light');
      };

      // Check immediately
      checkTimeBasedTheme();
      
      // Check every minute
      const interval = setInterval(checkTimeBasedTheme, 60000);
      
      return () => clearInterval(interval);
    }
  }, [themeConfig.autoSwitchByTime, themeConfig.darkModeStart, themeConfig.darkModeEnd, setTheme]);

  const value = {
    currentTheme,
    themeConfig,
    getCurrentTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={currentTheme} className={`theme-${currentTheme} min-h-screen transition-colors duration-300`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
