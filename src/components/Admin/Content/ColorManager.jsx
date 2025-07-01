import React, { useState, useEffect } from 'react';
import { FiSave, FiRotateCcw, FiEye, FiSettings } from 'react-icons/fi';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { loadCustomColors, applyColorsToDocument, getDefaultColors, saveCustomColors } from '../../../utils/colorUtils';

const ColorManager = () => {
  const [colors, setColors] = useState({
    primary: '#3b82f6',      // blue-500
    secondary: '#10b981',    // emerald-500
    success: '#10b981',      // emerald-500
    error: '#ef4444',        // red-500
    warning: '#f59e0b',      // amber-500
    info: '#f59e0b',         // amber-500 (accent-color)
  });

  const [originalColors, setOriginalColors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load current colors from CSS variables on component mount
  useEffect(() => {
    const loadCurrentColors = () => {
      // First try to load from localStorage
      const savedColors = loadCustomColors();
      if (savedColors) {
        setColors(savedColors);
        setOriginalColors(savedColors);
        return;
      }

      // Fallback to reading from CSS variables
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

    loadCurrentColors();
  }, []);

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

  // Save colors (for now, just to localStorage, but could be extended to API)
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save colors using utility function
      const success = saveCustomColors(colors);
      
      if (success) {
        // Update original colors
        setOriginalColors(colors);
        alert('Colors saved successfully!');
      } else {
        throw new Error('Failed to save colors');
      }
      
      // Here you would typically save to backend API
      // await adminApi.post('/admin/theme/colors', colors);
      
    } catch (error) {
      console.error('Error saving colors:', error);
      alert('Error saving colors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to default colors
  const handleReset = () => {
    const defaultColors = getDefaultColors();
    
    setColors(defaultColors);
    applyColorsToCSS(defaultColors);
    setShowPreview(false);
    
    // Clear saved colors from localStorage
    localStorage.removeItem('customColors');
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Color Theme Settings
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Customize the application's color scheme
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showPreview ? 'primary' : 'outline'}
            size="sm"
            onClick={togglePreview}
            icon={<FiEye size={16} />}
          >
            {showPreview ? 'Previewing' : 'Preview'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(colors).map(([key, value]) => (
          <div key={key} className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {colorLabels[key]}
            </label>
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                style={{ backgroundColor: value }}
              />
              <div className="flex-1">
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Color Preview Section */}
      {showPreview && (
        <div className="mt-8 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <FiSettings className="mr-2" />
            Color Preview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="text-center">
                <div 
                  className="w-16 h-16 rounded-lg mx-auto mb-2 shadow-md"
                  style={{ backgroundColor: value }}
                />
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {colorLabels[key]}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="outline"
          size="md"
          onClick={handleReset}
          icon={<FiRotateCcw size={16} />}
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
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          Usage Instructions
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Use the color pickers or enter hex values directly</li>
          <li>• Click "Preview" to see changes in real-time</li>
          <li>• "Save Changes" will apply colors across the application</li>
          <li>• "Reset to Default" will restore original theme colors</li>
        </ul>
      </div>
    </div>
  );
};

export default ColorManager;
