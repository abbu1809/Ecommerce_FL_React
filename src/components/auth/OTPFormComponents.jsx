/**
 * OTP UI Components for Form Integration
 * ====================================
 * 
 * Reusable UI components that can be integrated into existing forms
 * to add OTP verification functionality without changing form structure.
 */

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FiMail, 
  FiClock, 
  FiRefreshCw, 
  FiCheck, 
  FiAlertCircle,
  FiArrowLeft 
} from 'react-icons/fi';

// OTP Input Component
export const OTPInput = ({ value, onChange, disabled = false, error = '' }) => {
  const inputRefs = useRef([]);
  
  const handleChange = (index, inputValue) => {
    if (inputValue.length > 1) return;
    
    const newOtp = value.split('');
    while (newOtp.length < 6) newOtp.push('');
    newOtp[index] = inputValue;
    const otpString = newOtp.join('');
    
    onChange(otpString);

    // Auto-focus next input
    if (inputValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-center space-x-2">
        {[0, 1, 2, 3, 4, 5].map(index => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            disabled={disabled}
            className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              error 
                ? 'border-red-500 focus:ring-red-500' 
                : 'focus:ring-2'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{
              backgroundColor: disabled ? 'var(--bg-secondary)' : 'var(--bg-primary)',
              color: 'var(--text-primary)',
              borderColor: error ? 'var(--error-color)' : 'var(--border-primary)',
              '--tw-ring-color': error ? 'var(--error-color)' : 'var(--brand-primary)'
            }}
          />
        ))}
      </div>
      {error && (
        <p className="text-sm text-center" style={{ color: 'var(--error-color)' }}>
          {error}
        </p>
      )}
    </div>
  );
};

// OTP Verification Step Component
export const OTPVerificationStep = ({ 
  email,
  onVerify,
  onResend,
  onBack,
  loading = false,
  error = '',
  otpExpiry = 0,
  canResend = false,
  formatTime
}) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6 && typeof onVerify === 'function') {
      onVerify(otp);
    } else if (otp.length === 6 && !onVerify) {
      console.error('OTPFormComponents: onVerify function is not provided');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div 
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{
            backgroundColor: 'var(--brand-primary)',
            color: 'var(--text-on-brand)'
          }}
        >
          <FiMail className="text-2xl" />
        </div>
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Verify Your Email
        </h3>
        <p style={{ color: 'var(--text-secondary)' }}>
          We sent a 6-digit verification code to:
        </p>
        <p 
          className="font-medium"
          style={{ color: 'var(--brand-primary)' }}
        >
          {email}
        </p>
      </div>

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            className="block text-sm font-medium mb-3 text-center"
            style={{ color: 'var(--text-primary)' }}
          >
            Enter Verification Code
          </label>
          <OTPInput
            value={otp}
            onChange={setOtp}
            disabled={loading}
            error={error}
          />
        </div>

        {/* Timer/Resend */}
        <div className="text-center">
          {otpExpiry > 0 ? (
            <div 
              className="flex items-center justify-center space-x-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              <FiClock className="text-sm" />
              <span className="text-sm">Code expires in {formatTime(otpExpiry)}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={loading || !canResend}
              className="text-sm font-medium disabled:opacity-50 hover:opacity-80 transition-opacity"
              style={{ 
                color: (loading || !canResend) ? 'var(--text-muted)' : 'var(--brand-primary)' 
              }}
            >
              Resend verification code
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div 
            className="border rounded-lg p-3"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--error-color)'
            }}
          >
            <div className="flex items-center">
              <FiAlertCircle 
                className="mr-2" 
                style={{ color: 'var(--error-color)' }}
              />
              <p 
                className="text-sm"
                style={{ color: 'var(--error-color)' }}
              >
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="flex-1 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--brand-primary)',
              color: 'var(--text-on-brand)'
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <FiRefreshCw className="animate-spin mr-2" />
                Verifying...
              </div>
            ) : (
              'Verify Code'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Success Message Component
export const OTPSuccessMessage = ({ message = 'Email verified successfully!' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="border rounded-lg p-4 mb-4"
    style={{
      backgroundColor: 'var(--bg-secondary)',
      borderColor: 'var(--success-color)'
    }}
  >
    <div className="flex items-center">
      <FiCheck 
        className="mr-2" 
        style={{ color: 'var(--success-color)' }}
      />
      <p 
        className="text-sm font-medium"
        style={{ color: 'var(--success-color)' }}
      >
        {message}
      </p>
    </div>
  </motion.div>
);

// Email Verification Step Component
export const EmailVerificationStep = ({ 
  onSendOTP, 
  loading = false, 
  error = '',
  email,
  onEmailChange,
  name,
  onNameChange 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSendOTP(email, name);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Verify Your Email Address
        </h3>
        <p className="text-gray-600 text-sm">
          We'll send you a verification code to confirm your email
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your full name"
            required
            disabled={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <FiAlertCircle className="text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email || !name}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <FiRefreshCw className="animate-spin mr-2" />
              Sending Code...
            </div>
          ) : (
            'Send Verification Code'
          )}
        </button>
      </form>
    </motion.div>
  );
};
