import api from './api';
import { applyColorsToDocument, getDefaultColors } from '../utils/colorUtils';

// Service for managing public theme settings
const themeService = {
  // Load and apply theme from backend (public endpoint)
  loadAndApplyTheme: async () => {
    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await api.get('/admin/theme/public/', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.data && response.data.success) {
        const themeData = response.data.theme;
        if (themeData && themeData.colors && Object.keys(themeData.colors).length > 0) {
          console.log('Applying theme from backend:', themeData.colors);
          applyColorsToDocument(themeData.colors);
          return themeData;
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Theme loading timed out, using defaults');
      } else {
        console.log('Failed to load theme from backend, using defaults:', error.message);
      }
    }
    
    // Fallback to default colors
    console.log('Using default theme colors');
    const defaultColors = getDefaultColors();
    applyColorsToDocument(defaultColors);
    return {
      colors: defaultColors,
      mode: 'light'
    };
  },

  // Get current theme settings
  getCurrentTheme: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await api.get('/admin/theme/public/', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (response.data && response.data.success) {
        return response.data.theme;
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log('Failed to get current theme from backend:', error.message);
      }
    }
    
    return {
      colors: getDefaultColors(),
      mode: 'light'
    };
  }
};

export default themeService;
