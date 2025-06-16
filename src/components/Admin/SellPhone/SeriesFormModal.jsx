import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useAdminSellPhone from '../../../store/Admin/useAdminSellPhone';
import { FiX, FiLoader } from 'react-icons/fi';

const SeriesFormModal = ({ open, onClose, seriesToEdit, brandId }) => {
  const { addSeries, updateSeries } = useAdminSellPhone();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (seriesToEdit) {
      setFormData({
        name: seriesToEdit.name || '',
        description: seriesToEdit.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
    setErrors({});
  }, [seriesToEdit, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Series name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (seriesToEdit) {
        await updateSeries(brandId, seriesToEdit.id, formData);
      } else {
        await addSeries(brandId, formData);
      }
      onClose();
    } catch (error) {
      console.error("Series form submission error:", error);
      // Error handling is done in the store with toast notifications
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '' });
    setErrors({});
    onClose();
  };

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: "var(--bg-overlay)",
        backdropFilter: "blur(4px)" 
      }}
    >
      <div 
        className="w-full max-w-lg transform transition-all duration-300 animate-slideIn"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderRadius: "var(--rounded-lg)",
          boxShadow: "var(--shadow-large)",
          border: "1px solid var(--border-primary)"
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <h2 
            className="text-xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {seriesToEdit ? 'Edit Series' : 'Add New Series'}
          </h2>
          <button            onClick={handleClose}
            className="p-2 rounded-md transition-all duration-200 hover:opacity-70"
            disabled={isLoading}
            style={{ color: "var(--text-secondary)" }}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Series Name */}
          <div className="space-y-2">
            <label 
              htmlFor="name" 
              className="block text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Series Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: errors.name ? "var(--error-color)" : "var(--border-primary)",
                borderRadius: "var(--rounded-md)"
              }}
              placeholder="Enter series name (e.g., iPhone 15)"
              disabled={isLoading}
            />
            {errors.name && (
              <p 
                className="text-sm"
                style={{ color: "var(--error-color)" }}
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label 
              htmlFor="description" 
              className="block text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: errors.description ? "var(--error-color)" : "var(--border-primary)",
                borderRadius: "var(--rounded-md)"
              }}
              placeholder="Enter series description"
              disabled={isLoading}
            />
            {errors.description && (
              <p 
                className="text-sm"
                style={{ color: "var(--error-color)" }}
              >
                {errors.description}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-sm font-medium rounded-md border transition-all duration-200 hover:opacity-80 disabled:opacity-50"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-primary)",
                borderRadius: "var(--rounded-md)"
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center space-x-2"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-on-brand)",
                borderRadius: "var(--rounded-md)",
                boxShadow: "var(--shadow-small)"
              }}
              disabled={isLoading}
            >
              {isLoading && <FiLoader className="w-4 h-4 animate-spin" />}
              <span>
                {isLoading ? (
                  seriesToEdit ? 'Updating...' : 'Adding...'
                ) : (
                  seriesToEdit ? 'Update Series' : 'Add Series'
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SeriesFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  seriesToEdit: PropTypes.object,
  brandId: PropTypes.string.isRequired,
};

export default SeriesFormModal;
