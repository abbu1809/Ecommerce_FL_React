import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiPlus, FiTrash2, FiX, FiLoader } from 'react-icons/fi';
import useAdminSellPhoneStore from '../../../store/Admin/useAdminSellPhone';

const ModelFormModal = ({ open, onClose, brandId, seriesId, modelToEdit }) => {
  const { addModel, updateModel } = useAdminSellPhoneStore();
  
  const [formData, setFormData] = useState({
    id: '',
    display_name: '',
    image_url: '',
    launch_year: new Date().getFullYear(),
    demand_score: 5,
    variant_options: {
      ram: [''],
      storage: [''],
      color: ['']
    },
    variant_prices: {}
  });
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modelToEdit) {
      setFormData({
        id: modelToEdit.id || '',
        display_name: modelToEdit.display_name || '',
        image_url: modelToEdit.image_url || '',
        launch_year: modelToEdit.launch_year || new Date().getFullYear(),
        demand_score: modelToEdit.demand_score || 5,
        variant_options: {
          ram: modelToEdit.variant_options?.ram || [''],
          storage: modelToEdit.variant_options?.storage || [''],
          color: modelToEdit.variant_options?.color || ['']
        },
        variant_prices: modelToEdit.variant_prices || {}
      });
    } else {
      setFormData({
        id: '',
        display_name: '',
        image_url: '',
        launch_year: new Date().getFullYear(),
        demand_score: 5,
        variant_options: {
          ram: [''],
          storage: [''],
          color: ['']
        },
        variant_prices: {}
      });
    }
  }, [modelToEdit]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVariantOptionChange = (type, index, value) => {
    setFormData(prev => ({
      ...prev,
      variant_options: {
        ...prev.variant_options,
        [type]: prev.variant_options[type].map((item, i) => i === index ? value : item)
      }
    }));
  };

  const addVariantOption = (type) => {
    setFormData(prev => ({
      ...prev,
      variant_options: {
        ...prev.variant_options,
        [type]: [...prev.variant_options[type], '']
      }
    }));
  };

  const removeVariantOption = (type, index) => {
    setFormData(prev => ({
      ...prev,
      variant_options: {
        ...prev.variant_options,
        [type]: prev.variant_options[type].filter((_, i) => i !== index)
      }
    }));
  };

  const handlePriceChange = (storage, ram, price) => {
    setFormData(prev => ({
      ...prev,
      variant_prices: {
        ...prev.variant_prices,
        [storage]: {
          ...prev.variant_prices[storage],
          [ram]: parseInt(price) || 0
        }
      }
    }));
  };

  const generatePricingMatrix = () => {
    const storageOptions = formData.variant_options.storage.filter(s => s.trim());
    const ramOptions = formData.variant_options.ram.filter(r => r.trim());
    
    return storageOptions.map(storage => (
      <div key={storage} className="mb-4 p-4 border rounded">
        <h4 className="font-medium mb-2">{storage} Storage</h4>
        {ramOptions.map(ram => (
          <div key={`${storage}-${ram}`} className="flex items-center space-x-2 mb-2">
            <label className="w-16 text-sm">{ram}:</label>
            <input
              type="number"
              placeholder="Price"
              value={formData.variant_prices[storage]?.[ram] || ''}
              onChange={(e) => handlePriceChange(storage, ram, e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        ))}
      </div>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Clean up empty variant options
      const cleanedData = {
        ...formData,
        variant_options: {
          ram: formData.variant_options.ram.filter(r => r.trim()),
          storage: formData.variant_options.storage.filter(s => s.trim()),
          color: formData.variant_options.color.filter(c => c.trim())
        }
      };
      
      if (modelToEdit) {
        await updateModel(seriesId, modelToEdit.id, cleanedData);
      } else {
        await addModel(seriesId, cleanedData);
      }
      onClose();
    } catch (error) {
      console.error("Model form submission error:", error);
    }
    setIsLoading(false);
  };

  if (!open) return null;
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ 
        backgroundColor: "var(--bg-overlay)",
        backdropFilter: "blur(4px)" 
      }}
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="w-full max-w-4xl transform transition-all duration-300 animate-slideIn"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderRadius: "var(--rounded-lg)",
            boxShadow: "var(--shadow-large)",
            border: "1px solid var(--border-primary)"
          }}
        >
          {/* Header */}
          <div 
            className="flex justify-between items-center p-6 border-b"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <h2 
              className="text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {modelToEdit ? 'Edit Model' : 'Add New Model'}
            </h2>            <button 
              onClick={onClose} 
              className="p-2 rounded-md transition-all duration-200 hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model ID
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleChange('id', e.target.value)}
                placeholder="e.g., iphone_14_pro"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
                disabled={modelToEdit}
              />
              {modelToEdit && (
                <p className="text-xs text-gray-500 mt-1">Model ID cannot be changed</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={formData.display_name}
                onChange={(e) => handleChange('display_name', e.target.value)}
                placeholder="e.g., iPhone 14 Pro"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => handleChange('image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Launch Year
              </label>
              <input
                type="number"
                value={formData.launch_year}
                onChange={(e) => handleChange('launch_year', parseInt(e.target.value))}
                min="2000"
                max="2030"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Demand Score (1-10)
              </label>
              <input
                type="number"
                value={formData.demand_score}
                onChange={(e) => handleChange('demand_score', parseInt(e.target.value))}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          {/* Variant Options */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Variant Options</h4>
            
            {/* RAM Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">RAM Options</label>
              {formData.variant_options.ram.map((ram, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={ram}
                    onChange={(e) => handleVariantOptionChange('ram', index, e.target.value)}
                    placeholder="e.g., 6GB"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariantOption('ram', index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={formData.variant_options.ram.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addVariantOption('ram')}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <FaPlus className="mr-1" /> Add RAM Option
              </button>
            </div>

            {/* Storage Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Storage Options</label>
              {formData.variant_options.storage.map((storage, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={storage}
                    onChange={(e) => handleVariantOptionChange('storage', index, e.target.value)}
                    placeholder="e.g., 128GB"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariantOption('storage', index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={formData.variant_options.storage.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addVariantOption('storage')}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <FaPlus className="mr-1" /> Add Storage Option
              </button>
            </div>

            {/* Color Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Options</label>
              {formData.variant_options.color.map((color, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleVariantOptionChange('color', index, e.target.value)}
                    placeholder="e.g., Deep Purple"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariantOption('color', index)}
                    className="text-red-500 hover:text-red-700"
                    disabled={formData.variant_options.color.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addVariantOption('color')}
                className="flex items-center text-blue-500 hover:text-blue-700"
              >
                <FaPlus className="mr-1" /> Add Color Option
              </button>
            </div>
          </div>

          {/* Pricing Matrix */}
          <div>
            <h4 className="text-lg font-medium mb-4">Variant Pricing</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              {generatePricingMatrix()}
            </div>
          </div>

          {/* Preview */}
          {formData.image_url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
              <img 
                src={formData.image_url} 
                alt="Model preview" 
                className="w-32 h-32 object-contain border rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 text-sm font-medium rounded-md border transition-all duration-200 hover:opacity-80 disabled:opacity-50"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-primary)",
                borderRadius: "var(--rounded-md)"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}              className="px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center space-x-2"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-on-brand)",
                borderRadius: "var(--rounded-md)",
                boxShadow: "var(--shadow-small)"
              }}
            >
              {isLoading && <FiLoader className="w-4 h-4 animate-spin" />}
              <span>
                {isLoading ? (
                  modelToEdit ? 'Updating...' : 'Adding...'
                ) : (
                  modelToEdit ? 'Update Model' : 'Add Model'
                )}
              </span>
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

ModelFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  brandId: PropTypes.string.isRequired,
  seriesId: PropTypes.string.isRequired,
  modelToEdit: PropTypes.object,
};

export default ModelFormModal;
