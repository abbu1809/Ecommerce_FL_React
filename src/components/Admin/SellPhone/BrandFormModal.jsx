import React, { useState, useEffect } from 'react';
import useAdminSellPhoneStore from '../../../store/Admin/useAdminSellPhone';
import PropTypes from 'prop-types';
import { FiX, FiLoader } from 'react-icons/fi';
import FileUpload from '../common/FileUpload';
import { adminApi } from '../../../services/api';
import { toast } from 'react-hot-toast';

const BrandFormModal = ({ brandToEdit, onClose, open }) => {
  const { addBrand, updateBrand } = useAdminSellPhoneStore();
  const [formData, setFormData] = useState({
    id: '',
    logo_url: ''
  });
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'url'
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (brandToEdit) {
      setFormData({
        id: brandToEdit.id || '',
        logo_url: brandToEdit.logo_url || ''
      });
      setUploadMethod(brandToEdit.logo_url ? 'url' : 'file');
    } else {
      setFormData({
        id: '',
        logo_url: ''
      });
      setUploadMethod('file');
    }
    setSelectedLogoFile(null);
    setErrors({});
  }, [brandToEdit, open]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.id.trim()) {
      newErrors.id = 'Brand ID is required';
    } else if (!/^[a-z0-9_-]+$/.test(formData.id)) {
      newErrors.id = 'Brand ID must contain only lowercase letters, numbers, hyphens, and underscores';
    }
    
    if (uploadMethod === 'url') {
      if (formData.logo_url && !isValidUrl(formData.logo_url)) {
        newErrors.logo_url = 'Please enter a valid URL';
      }
    } else if (uploadMethod === 'file') {
      if (!selectedLogoFile && !brandToEdit?.logo_url) {
        newErrors.logo_file = 'Please select a logo file';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      let logoUrl = formData.logo_url;
      
      // Upload file if file method is selected and file is provided
      if (uploadMethod === 'file' && selectedLogoFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', selectedLogoFile);
        uploadFormData.append('type', 'brand_logo');
        
        const uploadResponse = await adminApi.post('/admin/upload-image/', uploadFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (uploadResponse.data.image_url) {
          logoUrl = uploadResponse.data.image_url;
        }
      }
      
      const brandData = {
        ...formData,
        logo_url: logoUrl
      };
      
      if (brandToEdit) {
        await updateBrand(brandToEdit.id, brandData);
        toast.success('Brand updated successfully');
      } else {
        await addBrand(brandData);
        toast.success('Brand added successfully');
      }
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.response?.data?.error || 'Failed to save brand');
    }
    setIsLoading(false);
  };

  const handleClose = () => {
    setFormData({ id: '', logo_url: '' });
    setSelectedLogoFile(null);
    setUploadMethod('file');
    setErrors({});
    onClose();
  };
  if (!open) return null;
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "var(--bg-overlay)",
        backdropFilter: "blur(4px)",
      }}
    >        <div 
          className="w-full max-w-lg mx-auto transform transition-all duration-300 animate-slideIn"
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
            {brandToEdit ? 'Edit Brand' : 'Add New Brand'}
          </h2>          <button            onClick={handleClose}
            className="p-2 rounded-md transition-all duration-200 hover:opacity-70"
            disabled={isLoading}
            style={{ color: "var(--text-secondary)" }}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Brand ID */}
          <div className="space-y-2">
            <label 
              htmlFor="id" 
              className="block text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Brand ID *
            </label>
            <input 
              type="text" 
              id="id"
              name="id"
              value={formData.id} 
              onChange={handleChange}
              placeholder="e.g., apple, samsung"
              className="w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: errors.id ? "var(--error-color)" : "var(--border-primary)",
                borderRadius: "var(--rounded-md)"
              }}
              required 
              disabled={brandToEdit || isLoading}
            />
            {brandToEdit && (
              <p 
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Brand ID cannot be changed
              </p>
            )}
            {errors.id && (
              <p 
                className="text-sm"
                style={{ color: "var(--error-color)" }}
              >
                {errors.id}
              </p>
            )}
          </div>          
          {/* Logo Upload Method Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Logo Upload Method
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="file"
                  checked={uploadMethod === 'file'}
                  onChange={(e) => setUploadMethod(e.target.value)}
                  className="mr-2"
                  disabled={isLoading}
                />
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                  Upload File
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="url"
                  checked={uploadMethod === 'url'}
                  onChange={(e) => setUploadMethod(e.target.value)}
                  className="mr-2"
                  disabled={isLoading}
                />
                <span className="text-sm" style={{ color: "var(--text-primary)" }}>
                  Enter URL
                </span>
              </label>
            </div>
          </div>

          {/* File Upload */}
          {uploadMethod === 'file' && (
            <FileUpload
              label="Brand Logo"
              accept="image/*"
              maxSize={2 * 1024 * 1024} // 2MB
              dimensions={{
                width: 200,
                height: 200,
                aspectRatio: '1:1'
              }}
              onFileSelect={setSelectedLogoFile}
              currentImage={brandToEdit?.logo_url}
              error={errors.logo_file}
              helperText="Upload a brand logo. Square images work best."
              disabled={isLoading}
            />
          )}

          {/* Logo URL */}
          {uploadMethod === 'url' && (
            <div className="space-y-2">
              <label 
                htmlFor="logo_url" 
                className="block text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Logo URL
              </label>
              <input 
                type="url" 
                id="logo_url"
                name="logo_url"
                value={formData.logo_url} 
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: errors.logo_url ? "var(--error-color)" : "var(--border-primary)",
                  borderRadius: "var(--rounded-md)"
                }}
                disabled={isLoading}
              />
              {errors.logo_url && (
                <p 
                  className="text-sm"
                  style={{ color: "var(--error-color)" }}
                >
                  {errors.logo_url}
                </p>
              )}
            </div>
          )}
          
          {/* Logo Preview */}
          {((uploadMethod === 'url' && formData.logo_url) || brandToEdit?.logo_url) && (
            <div className="space-y-2">
              <label 
                className="block text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Logo Preview
              </label>
              <div 
                className="flex items-center justify-center p-4 rounded-md border-2 border-dashed"
                style={{ 
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-primary)"
                }}
              >
                <img 
                  src={formData.logo_url} 
                  alt="Logo preview" 
                  className="max-w-20 max-h-20 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div 
                  className="text-sm hidden"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Failed to load image
                </div>
              </div>
            </div>
          )}          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
            <button 
              type="button" 
              onClick={handleClose} 
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium rounded-md border transition-all duration-200 hover:opacity-80 disabled:opacity-50"
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
              disabled={isLoading}
              className="px-4 py-2.5 text-sm font-medium rounded-md transition-all duration-200 hover:opacity-90 disabled:opacity-50 flex items-center space-x-2"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-on-brand)",
                borderRadius: "var(--rounded-md)",
                boxShadow: "var(--shadow-small)"
              }}
            >
              {isLoading && <FiLoader className="w-4 h-4 animate-spin" />}
              <span>
                {isLoading 
                  ? (brandToEdit ? 'Updating...' : 'Adding...') 
                  : (brandToEdit ? 'Update Brand' : 'Add Brand')
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

BrandFormModal.propTypes = {
  brandToEdit: PropTypes.shape({
    id: PropTypes.string,
    logo_url: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default BrandFormModal;
