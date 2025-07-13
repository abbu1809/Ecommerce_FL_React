import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDroplet,
  FiSun,
  FiMoon,
  FiEye,
  FiSave,
  FiRefreshCw,
  FiSettings,
  FiCopy,
  FiCheck
} from 'react-icons/fi';
import { HexColorPicker } from 'react-colorful';
import useThemeStore from '../../../store/Admin/useThemeStore';
import { adminApi } from '../../../services/api';
import { loadCustomColors, applyColorsToDocument, getDefaultColors, saveCustomColors } from '../../../utils/colorUtils';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';

const ThemeManager = () => {
  const [colors, setColors] = useState({
    primary: '#3b82f6',
    secondary: '#10b981',
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#f59e0b',
  });
  const [originalColors, setOriginalColors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState({});
  const [copiedColor, setCopiedColor] = useState('');
  const [mode, setMode] = useState('light');

  const { initializeTheme } = useThemeStore();

  // Load theme settings from backend
  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    setIsLoading(true);
    try {
      // Try to load from backend first
      const response = await adminApi.get('/admin/theme/');
      if (response.data.success) {
        const themeData = response.data.theme;
        setColors(themeData.colors);
        setOriginalColors(themeData.colors);
        setMode(themeData.mode || 'light');
        applyColorsToDocument(themeData.colors);
      }
    } catch (error) {
      console.log('Backend theme not available, loading from localStorage');
      // Fallback to localStorage
      const savedColors = loadCustomColors();
      if (savedColors) {
        setColors(savedColors);
        setOriginalColors(savedColors);
      } else {
        // Load from CSS variables
        loadCurrentColorsFromCSS();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentColorsFromCSS = () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    const currentColors = {
      primary: computedStyle.getPropertyValue('--brand-primary').trim() || '#3b82f6',
      secondary: computedStyle.getPropertyValue('--brand-secondary').trim() || '#10b981',
      success: computedStyle.getPropertyValue('--success-color').trim() || '#10b981',
      error: computedStyle.getPropertyValue('--error-color').trim() || '#ef4444',
      warning: computedStyle.getPropertyValue('--warning-color').trim() || '#f59e0b',
      info: computedStyle.getPropertyValue('--accent-color').trim() || '#f59e0b',
    };
    
    setColors(currentColors);
    setOriginalColors(currentColors);
  };

  // Apply colors to CSS variables for preview
  const applyColorsToCSS = (colorValues) => {
    applyColorsToDocument(colorValues);
  };

  // Handle color change
  const handleColorChange = (colorKey, value) => {
    const newColors = { ...colors, [colorKey]: value };
    setColors(newColors);
    
    if (showPreview) {
      applyColorsToCSS(newColors);
    }
  };

  // Toggle preview mode
  const togglePreview = () => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      applyColorsToCSS(colors);
    } else {
      // Reset to original colors
      applyColorsToCSS(originalColors);
    }
  };

  // Save colors to backend and localStorage
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save to backend
      await adminApi.post('/admin/theme/update/', {
        colors: colors,
        mode: mode
      });

      // Save to localStorage as backup
      saveCustomColors(colors);
      
      // Update original colors
      setOriginalColors(colors);
      
      // Apply to document
      applyColorsToDocument(colors);
      
      toast.success('Theme saved successfully!');
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Failed to save theme');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to default colors
  const handleReset = async () => {
    setIsLoading(true);
    try {
      // Reset to backend defaults
      await adminApi.post('/admin/theme/reset/');
      
      // Get default colors
      const defaultColors = getDefaultColors();
      setColors(defaultColors);
      setOriginalColors(defaultColors);
      
      // Apply to document
      applyColorsToDocument(defaultColors);
      
      // Clear localStorage
      localStorage.removeItem('customColors');
      
      toast.success('Theme reset to defaults!');
    } catch (error) {
      console.error('Error resetting theme:', error);
      toast.error('Failed to reset theme');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast.success(`Copied ${color} to clipboard!`);
    setTimeout(() => setCopiedColor(''), 2000);
  };

  const colorLabels = {
    primary: 'Brand Primary',
    secondary: 'Brand Secondary', 
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Accent/Info',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
            <FiDroplet className="mr-3 text-blue-600" />
            Theme Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Customize your website's color scheme and branding
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant={showPreview ? "primary" : "outline"}
            size="sm"
            onClick={togglePreview}
            icon={<FiEye size={16} />}
          >
            {showPreview ? 'Exit Preview' : 'Preview'}
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Theme Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <FiSettings className="mr-2" />
            Color Customization
          </h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Current Mode: <span className="font-medium capitalize">{mode}</span>
          </div>
        </div>

        {/* Color Picker Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(colors).map(([colorKey, colorValue]) => (
            <div key={colorKey} className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {colorLabels[colorKey] || colorKey}
              </label>
              
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  style={{ backgroundColor: colorValue }}
                  onClick={() => setShowColorPicker({ ...showColorPicker, [colorKey]: !showColorPicker[colorKey] })}
                />
                
                <div className="flex-1">
                  <input
                    type="text"
                    value={colorValue}
                    onChange={(e) => handleColorChange(colorKey, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
                
                <button
                  onClick={() => copyToClipboard(colorValue)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  title="Copy color"
                >
                  {copiedColor === colorValue ? (
                    <FiCheck className="text-green-600" size={14} />
                  ) : (
                    <FiCopy className="text-gray-600 dark:text-gray-400" size={14} />
                  )}
                </button>
              </div>

              {/* Color Picker Popup */}
              {showColorPicker[colorKey] && (
                <div className="relative">
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowColorPicker({ ...showColorPicker, [colorKey]: false })}
                  />
                  <div className="absolute z-50 top-2 left-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
                    <HexColorPicker
                      color={colorValue}
                      onChange={(color) => handleColorChange(colorKey, color)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Preview Mode Indicator */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <FiEye className="mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Preview Mode Active
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Changes are visible across the website. Save to make them permanent.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          size="md"
          onClick={handleReset}
          icon={<FiRefreshCw size={16} />}
        >
          Reset to Default
        </Button>
        
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            isLoading={isLoading}
            icon={<FiSave size={16} />}
          >
            {isLoading ? 'Saving...' : 'Save Theme'}
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          Theme Management Instructions
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Use color pickers or enter hex values directly to customize colors</li>
          <li>• Click "Preview" to see changes in real-time across the entire website</li>
          <li>• "Save Theme" will apply colors permanently and store them in the database</li>
          <li>• "Reset to Default" will restore the original theme colors</li>
          <li>• Changes are automatically saved to localStorage as backup</li>
        </ul>
      </div>
    </div>
  );
};

export default ThemeManager;
