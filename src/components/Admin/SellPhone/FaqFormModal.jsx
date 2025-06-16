import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useAdminSellPhone from '../../../store/Admin/useAdminSellPhone';
import { FiX, FiLoader } from 'react-icons/fi';

const FaqFormModal = ({ open, onClose, faqToEdit }) => {
  const { addFaq, updateFaq } = useAdminSellPhone();  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (faqToEdit) {
      setFormData({
        question: faqToEdit.question || '',
        answer: faqToEdit.answer || ''
      });
    } else {
      setFormData({
        question: '',
        answer: ''
      });
    }
    setErrors({});
  }, [faqToEdit]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (faqToEdit) {
        await updateFaq(faqToEdit.id, formData);
      } else {
        await addFaq(formData);
      }
      onClose();
    } catch (error) {
      console.error("FAQ form submission error:", error);
      // Error handling is already done in the store functions
    } finally {
      setIsLoading(false);
    }
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
        className="w-full max-w-2xl transform transition-all duration-300 animate-slideIn"
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
            {faqToEdit ? 'Edit FAQ' : 'Add New FAQ'}
          </h2>          <button
            onClick={onClose}
            className="p-2 rounded-md transition-all duration-200 hover:opacity-70"
            disabled={isLoading}
            style={{ color: "var(--text-secondary)" }}
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">          {/* Question */}
          <div className="space-y-2">
            <label 
              htmlFor="question" 
              className="block text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Question *
            </label>
            <input 
              type="text" 
              id="question"
              name="question"
              value={formData.question} 
              onChange={handleChange}
              placeholder="Enter the FAQ question"
              className="w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: errors.question ? "var(--error-color)" : "var(--border-primary)",
                borderRadius: "var(--rounded-md)"
              }}
              required 
              disabled={isLoading}
            />
            {errors.question && (
              <p 
                className="text-sm"
                style={{ color: "var(--error-color)" }}
              >
                {errors.question}
              </p>
            )}
          </div>
          
          {/* Answer */}
          <div className="space-y-2">
            <label 
              htmlFor="answer" 
              className="block text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Answer *
            </label>
            <textarea 
              id="answer"
              name="answer"
              value={formData.answer} 
              onChange={handleChange}
              placeholder="Enter the FAQ answer"
              rows={6}
              className="w-full px-3 py-2.5 border rounded-md text-sm focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: errors.answer ? "var(--error-color)" : "var(--border-primary)",
                borderRadius: "var(--rounded-md)"
              }}
              required 
              disabled={isLoading}
            />
            {errors.answer && (
              <p 
                className="text-sm"
                style={{ color: "var(--error-color)" }}
              >
                {errors.answer}
              </p>
            )}
          </div>          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t" style={{ borderColor: "var(--border-primary)" }}>
            <button 
              type="button" 
              onClick={onClose} 
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
                {isLoading ? (
                  faqToEdit ? 'Updating...' : 'Adding...'
                ) : (
                  faqToEdit ? 'Update FAQ' : 'Add FAQ'
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

FaqFormModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  faqToEdit: PropTypes.shape({
    id: PropTypes.string,
    question: PropTypes.string,
    answer: PropTypes.string,
  }),
};

export default FaqFormModal;
