import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { FiSave, FiRefreshCw, FiEye, FiCopy, FiCheck } from 'react-icons/fi';
import { adminApi } from '../../../services/api';
import { applyColorsToDocument, saveCustomColors, loadCustomColors, getDefaultColors } from '../../../utils/colorUtils';
import toast from 'react-hot-toast';

const SimpleThemeManager = () => {
  const [colors, setColors] = useState(getDefaultColors());
  const [originalColors, setOriginalColors] = useState(getDefaultColors());
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copiedColor, setCopiedColor] = useState('');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const response = await adminApi.get('/admin/theme/');
      if (response.data.success && response.data.theme.colors) {
        setColors(response.data.theme.colors);
        setOriginalColors(response.data.theme.colors);
        applyColorsToDocument(response.data.theme.colors);
      }
    } catch (err) {
      console.log('Failed to load theme from backend, using localStorage', err.message);
      const saved = loadCustomColors();
      if (saved) {
        setColors(saved);
        setOriginalColors(saved);
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('Saving theme with colors:', colors);
      
      const response = await adminApi.post('/admin/theme/update/', {
        colors: colors,
        mode: 'light'
      });

      if (response.data.success) {
        saveCustomColors(colors);
        setOriginalColors(colors);
        applyColorsToDocument(colors);
        
        // Handle warnings (when Firebase is unavailable)
        if (response.data.warning) {
          toast.warning(`Theme saved locally: ${response.data.warning}`);
        } else {
          toast.success('Theme saved successfully!');
        }
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
      toast.error('Failed to save theme: ' + (error.response?.data?.error || error.message));
    }
    setIsLoading(false);
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      await adminApi.post('/admin/theme/reset/');
      const defaults = getDefaultColors();
      setColors(defaults);
      setOriginalColors(defaults);
      applyColorsToDocument(defaults);
      toast.success('Theme reset to defaults!');
    } catch (error) {
      console.error('Failed to reset theme:', error);
      toast.error('Failed to reset theme');
    }
    setIsLoading(false);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
    if (!showPreview) {
      applyColorsToDocument(colors);
    } else {
      applyColorsToDocument(originalColors);
    }
  };

  const copyColor = (colorValue) => {
    navigator.clipboard.writeText(colorValue);
    setCopiedColor(colorValue);
    setTimeout(() => setCopiedColor(''), 2000);
    toast.success(`Copied ${colorValue}`);
  };

  const colorKeys = [
    { key: 'primary', label: 'Primary Color', description: 'Main brand color' },
    { key: 'secondary', label: 'Secondary Color', description: 'Secondary brand color' },
    { key: 'success', label: 'Success Color', description: 'Success messages' },
    { key: 'error', label: 'Error Color', description: 'Error messages' },
    { key: 'warning', label: 'Warning Color', description: 'Warning messages' },
    { key: 'info', label: 'Info Color', description: 'Info messages' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Theme Colors</h2>
          <p className="text-gray-600">Customize your website's color scheme</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={togglePreview}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              showPreview 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FiEye size={16} />
            {showPreview ? 'Previewing' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colorKeys.map(({ key, label, description }) => (
          <div key={key} className="bg-white rounded-lg border p-4 space-y-3">
            <div>
              <h3 className="font-medium text-gray-800">{label}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            
            <div className="space-y-3">
              <HexColorPicker
                color={colors[key]}
                onChange={(newColor) => {
                  const newColors = { ...colors, [key]: newColor };
                  setColors(newColors);
                  if (showPreview) {
                    applyColorsToDocument(newColors);
                  }
                }}
              />
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={colors[key]}
                  onChange={(e) => {
                    const newColors = { ...colors, [key]: e.target.value };
                    setColors(newColors);
                    if (showPreview) {
                      applyColorsToDocument(newColors);
                    }
                  }}
                  className="flex-1 px-3 py-2 border rounded-md text-sm font-mono"
                  placeholder="#000000"
                />
                <button
                  onClick={() => copyColor(colors[key])}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
                  title="Copy color"
                >
                  {copiedColor === colors[key] ? <FiCheck size={16} /> : <FiCopy size={16} />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <button
          onClick={handleReset}
          disabled={isLoading}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
        >
          <FiRefreshCw size={16} />
          Reset to Defaults
        </button>
        
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
        >
          <FiSave size={16} />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Development Info */}
      {import.meta.env.DEV && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Development Info</h4>
          <p className="text-xs text-yellow-700">
            Current colors: {JSON.stringify(colors, null, 2)}
          </p>
        </div>
      )}
    </div>
  );
};

export default SimpleThemeManager;
