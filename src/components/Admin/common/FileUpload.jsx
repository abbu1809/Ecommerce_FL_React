import React, { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage, FiAlertCircle } from 'react-icons/fi';

const FileUpload = ({
  label,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB default
  dimensions = null, // { width: 800, height: 600, aspectRatio: '4:3' }
  onFileSelect,
  currentImage = null,
  error = null,
  required = false,
  disabled = false,
  helperText = null
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(currentImage);
  const [uploadError, setUploadError] = useState(error);
  const fileInputRef = useRef();

  const validateFile = (file) => {
    if (!file) return { valid: false, error: "No file selected" };

    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: "Please select an image file" };
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      return { valid: false, error: `File size must be less than ${maxSizeMB}MB` };
    }

    return { valid: true, error: null };
  };

  const handleFile = (file) => {
    const validation = validateFile(file);
    
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Clear any previous errors
    setUploadError(null);
    
    // Call parent callback
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Drag and Drop Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : uploadError 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        style={{
          backgroundColor: dragActive 
            ? 'rgba(59, 130, 246, 0.05)' 
            : uploadError 
              ? 'rgba(239, 68, 68, 0.05)' 
              : 'var(--bg-secondary)',
          borderColor: dragActive 
            ? 'var(--brand-primary)' 
            : uploadError 
              ? 'var(--error-color)' 
              : 'var(--border-primary)'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="max-h-32 max-w-full rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage();
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              disabled={disabled}
            >
              <FiX size={12} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-center">
              <FiUpload 
                size={32} 
                style={{ color: uploadError ? 'var(--error-color)' : 'var(--text-secondary)' }} 
              />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Click to upload or drag and drop
              </p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {accept.includes('image') ? 'PNG, JPG, GIF up to' : 'Files up to'} {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Helper Text and Dimensions Info */}
      {(helperText || dimensions) && (
        <div className="mt-2 space-y-1">
          {helperText && (
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {helperText}
            </p>
          )}
          {dimensions && (
            <div className="flex items-center space-x-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <FiImage size={12} />
              <span>
                Recommended: {dimensions.width}×{dimensions.height}px
                {dimensions.aspectRatio && ` (${dimensions.aspectRatio})`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="mt-2 flex items-center space-x-1 text-xs" style={{ color: 'var(--error-color)' }}>
          <FiAlertCircle size={12} />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
