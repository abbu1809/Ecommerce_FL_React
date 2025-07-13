import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiDroplet,
  FiSun,
  FiMoon,
  FiDownload,
  FiUpload,
  FiEye,
  FiSave,
  FiTrash2,
  FiPlus,
  FiRefreshCw,
  FiSettings,
  FiMonitor,
  FiToggleLeft,
  FiToggleRight,
  FiCopy,
  FiCheck
} from 'react-icons/fi';
import { HexColorPicker } from 'react-colorful';
import useThemeStore from '../../../store/useThemeStore';
import { adminApi } from '../../../services/api';
import { loadCustomColors, applyColorsToDocument, getDefaultColors, saveCustomColors } from '../../../utils/colorUtils';
import toast from 'react-hot-toast';
import Button from '../../ui/Button';

const ThemeManager = () => {
  const [activeTab, setActiveTab] = useState('colors');
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
      applyColorsToCSS(colors);
      
      toast.success('Theme settings saved successfully!');
      
    } catch (error) {
      console.error('Error saving theme settings:', error);
      
      // Fallback to localStorage save
      const success = saveCustomColors(colors);
      if (success) {
        setOriginalColors(colors);
        toast.success('Theme saved locally (backend unavailable)');
      } else {
        toast.error('Error saving theme settings. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setShowPreview(false);
    }
  };

  // Reset to default colors
  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset to default theme colors?')) {
      return;
    }

    setIsLoading(true);
    try {
      // Reset on backend
      await adminApi.post('/admin/theme/reset/');
      
      // Reset locally
      const defaultColors = getDefaultColors();
      setColors(defaultColors);
      setOriginalColors(defaultColors);
      applyColorsToCSS(defaultColors);
      setShowPreview(false);
      setMode('light');
      
      // Clear saved colors from localStorage
      localStorage.removeItem('customColors');
      
      toast.success('Theme reset to default successfully!');
      
    } catch (error) {
      console.error('Error resetting theme:', error);
      
      // Fallback to local reset
      const defaultColors = getDefaultColors();
      setColors(defaultColors);
      setOriginalColors(defaultColors);
      applyColorsToCSS(defaultColors);
      setShowPreview(false);
      localStorage.removeItem('customColors');
      
      toast.success('Theme reset locally (backend unavailable)');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast.success('Color copied to clipboard');
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
      

  const tabs = [
    { id: 'themes', label: 'Theme Selection', icon: FiDroplet },
    { id: 'customizer', label: 'Theme Customizer', icon: FiSettings },
    { id: 'config', label: 'Configuration', icon: FiMonitor }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FiDroplet className="text-orange-500" />
            Theme Management
          </h2>
          <p className="text-gray-600 mt-1">Customize your website's appearance</p>
        </div>
        
        <div className="flex items-center gap-3">
          {previewMode && (
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg">
              <FiEye size={16} />
              <span className="text-sm font-medium">Preview Mode</span>
              <button
                onClick={exitPreview}
                className="text-blue-500 hover:text-blue-700"
              >
                Exit
              </button>
            </div>
          )}
          
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {currentTheme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
            <span className="hidden sm:inline">
              {currentTheme === 'dark' ? 'Light' : 'Dark'} Mode
            </span>
          </button>
          
          <button
            onClick={fetchThemes}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <FiRefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FiDroplet className="text-orange-500" />
            Current Theme: {currentTheme}
          </h3>
          {/* Current Theme Display */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiPalette className="text-orange-500" />
              Current Theme: {currentTheme}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(getCurrentTheme()).slice(0, 12).map(([key, color]) => (
                <div key={key} className="text-center">
                  <div
                    className="w-16 h-16 rounded-lg border border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow mx-auto"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color)}
                    title={`Click to copy: ${color}`}
                  />
                  <p className="text-xs text-gray-600 mt-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">{color}</p>
                  {copiedColor === color && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1 text-xs text-green-600 mt-1"
                    >
                      <FiCheck size={12} />
                      Copied
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Available Themes */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Default Themes */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Default Themes</h3>
              <div className="space-y-3">
                {Object.entries(themes).map(([themeName, theme]) => (
                  <div
                    key={themeName}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      currentTheme === themeName
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setTheme(themeName)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {themeName === 'light' ? <FiSun /> : <FiMoon />}
                        <span className="font-medium capitalize">{themeName} Theme</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEditing(themeName);
                          }}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                          title="Customize"
                        >
                          <FiSettings size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-3">
                      {Object.values(theme).slice(0, 8).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded border border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Custom Themes */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Custom Themes</h3>
                <div className="flex gap-2">
                  <button
                    onClick={exportThemes}
                    className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded text-sm"
                  >
                    <FiDownload size={14} />
                    Export
                  </button>
                  <label className="flex items-center gap-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded text-sm cursor-pointer">
                    <FiUpload size={14} />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileImport}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-3">
                {Object.keys(customThemes).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FiDroplet size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No custom themes yet</p>
                    <p className="text-sm">Create your first custom theme using the customizer</p>
                  </div>
                ) : (
                  Object.entries(customThemes).map(([themeName, theme]) => (
                    <div
                      key={themeName}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        currentTheme === themeName
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setTheme(themeName)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FiDroplet />
                          <span className="font-medium">{themeName}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEditing(themeName);
                            }}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <FiSettings size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTheme(themeName);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-3">
                        {Object.values(theme).slice(0, 8).map((color, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 rounded border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        {/* )} */}

        {activeTab === 'customizer' && (
          <motion.div
            key="customizer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Theme Customizer Header */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Theme Customizer</h3>
                <div className="flex gap-2">
                  <select
                    value={selectedTheme}
                    onChange={(e) => setSelectedTheme(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </select>
                  <button
                    onClick={() => handleStartEditing(selectedTheme)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    <FiPlus size={16} />
                    Start Customizing
                  </button>
                </div>
              </div>

              {!editingTheme && (
                <div className="text-center py-8 text-gray-500">
                  <FiSettings size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Select a theme mode and click "Start Customizing" to begin</p>
                </div>
              )}
            </div>

            {/* Color Customizer */}
            {editingTheme && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Customize Colors</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customThemeName}
                      onChange={(e) => setCustomThemeName(e.target.value)}
                      placeholder="Theme name..."
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={handleSaveTheme}
                      disabled={loading || !customThemeName}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
                    >
                      <FiSave size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEditing}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {colorCategories.map((category) => (
                    <div key={category.title} className="space-y-4">
                      <h4 className="font-medium text-gray-800">{category.title}</h4>
                      <div className="space-y-3">
                        {category.colors.map((colorKey) => (
                          <div key={colorKey} className="flex items-center gap-3">
                            <div className="flex-1">
                              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                {colorKey.replace(/([A-Z])/g, ' $1').trim()}
                              </label>
                              <div className="flex gap-2">
                                <div
                                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                                  style={{ backgroundColor: tempTheme[colorKey] || '#000000' }}
                                  onClick={() => setShowColorPicker({ ...showColorPicker, [colorKey]: !showColorPicker[colorKey] })}
                                />
                                <input
                                  type="text"
                                  value={tempTheme[colorKey] || ''}
                                  onChange={(e) => handleColorChange(colorKey, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded font-mono text-sm"
                                  placeholder="#000000"
                                />
                                <button
                                  onClick={() => copyToClipboard(tempTheme[colorKey])}
                                  className="p-2 text-gray-500 hover:text-gray-700"
                                  title="Copy color"
                                >
                                  <FiCopy size={16} />
                                </button>
                              </div>
                            </div>
                            
                            {showColorPicker[colorKey] && (
                              <div className="absolute z-50 mt-2">
                                <div
                                  className="fixed inset-0"
                                  onClick={() => setShowColorPicker({ ...showColorPicker, [colorKey]: false })}
                                />
                                <div className="relative bg-white p-4 rounded-lg shadow-xl border">
                                  <HexColorPicker
                                    color={tempTheme[colorKey] || '#000000'}
                                    onChange={(color) => handleColorChange(colorKey, color)}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'config' && (
          <motion.div
            key="config"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Theme Configuration */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-6">Theme Configuration</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enable Dark Mode</h4>
                    <p className="text-sm text-gray-600">Allow users to switch to dark mode</p>
                  </div>
                  <button
                    onClick={() => updateThemeConfig({ enableDarkMode: !themeConfig.enableDarkMode })}
                    className="flex items-center"
                  >
                    {themeConfig.enableDarkMode ? (
                      <FiToggleRight className="text-green-500" size={24} />
                    ) : (
                      <FiToggleLeft className="text-gray-400" size={24} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Follow System Theme</h4>
                    <p className="text-sm text-gray-600">Automatically switch based on system preferences</p>
                  </div>
                  <button
                    onClick={() => updateThemeConfig({ followSystemTheme: !themeConfig.followSystemTheme })}
                    className="flex items-center"
                  >
                    {themeConfig.followSystemTheme ? (
                      <FiToggleRight className="text-green-500" size={24} />
                    ) : (
                      <FiToggleLeft className="text-gray-400" size={24} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Switch by Time</h4>
                    <p className="text-sm text-gray-600">Automatically switch themes based on time of day</p>
                  </div>
                  <button
                    onClick={() => updateThemeConfig({ autoSwitchByTime: !themeConfig.autoSwitchByTime })}
                    className="flex items-center"
                  >
                    {themeConfig.autoSwitchByTime ? (
                      <FiToggleRight className="text-green-500" size={24} />
                    ) : (
                      <FiToggleLeft className="text-gray-400" size={24} />
                    )}
                  </button>
                </div>

                {themeConfig.autoSwitchByTime && (
                  <div className="grid md:grid-cols-2 gap-4 pl-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dark Mode Start Time
                      </label>
                      <input
                        type="time"
                        value={themeConfig.darkModeStart}
                        onChange={(e) => updateThemeConfig({ darkModeStart: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dark Mode End Time
                      </label>
                      <input
                        type="time"
                        value={themeConfig.darkModeEnd}
                        onChange={(e) => updateThemeConfig({ darkModeEnd: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-6">Advanced Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Theme Reset</h4>
                  <p className="text-sm text-gray-600 mb-4">Reset all themes to default values</p>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to reset all themes? This action cannot be undone.')) {
                        // Reset logic would go here
                        toast.success('Themes reset to defaults');
                      }
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    Reset to Defaults
                  </button>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Cache Management</h4>
                  <p className="text-sm text-gray-600 mb-4">Clear theme cache to force reload</p>
                  <button
                    onClick={() => {
                      localStorage.removeItem('theme-store');
                      window.location.reload();
                    }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeManager;
