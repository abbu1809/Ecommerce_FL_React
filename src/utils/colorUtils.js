// Color Theme Utilities
export const loadCustomColors = () => {
  try {
    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
      const colors = JSON.parse(savedColors);
      applyColorsToDocument(colors);
      return colors;
    }
  } catch (error) {
    console.error('Error loading custom colors:', error);
  }
  return null;
};

export const applyColorsToDocument = (colors) => {
  try {
    const root = document.documentElement;
    if (colors.primary) root.style.setProperty('--brand-primary', colors.primary);
    if (colors.secondary) root.style.setProperty('--brand-secondary', colors.secondary);
    if (colors.success) root.style.setProperty('--success-color', colors.success);
    if (colors.error) root.style.setProperty('--error-color', colors.error);
    if (colors.warning) root.style.setProperty('--warning-color', colors.warning);
    if (colors.info) root.style.setProperty('--accent-color', colors.info);
    
    console.log('Colors applied to document:', colors);
  } catch (error) {
    console.error('Error applying colors to document:', error);
  }
};

export const getDefaultColors = () => ({
  primary: '#3b82f6',
  secondary: '#10b981',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#f59e0b',
});

export const saveCustomColors = (colors) => {
  try {
    localStorage.setItem('customColors', JSON.stringify(colors));
    applyColorsToDocument(colors);
    return true;
  } catch (error) {
    console.error('Error saving custom colors:', error);
    return false;
  }
};
