/**
 * OTP Email Verification Component for User Registration
 * ===================================================
 * 
 * Complete signup flow with email OTP verification:
 * 1. User enters email and name -> Send OTP
 * 2. User enters OTP -> Verify OTP
 * 3. User completes registration form -> Create account
 * 
 * Features:
 * - Real-time OTP input validation
 * - Countdown timer for OTP expiry
 * - Resend OTP functionality
 * - Professional UI with loading states
 * - Comprehensive error handling
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMail, 
  FiUser, 
  FiLock, 
  FiPhone, 
  FiCheck, 
  FiClock, 
  FiRefreshCw,
  FiAlertCircle,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const OTPSignupComponent = ({ onSignupSuccess, onSwitchToLogin }) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: Complete Registration
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    otp: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone_number: ''
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // OTP input refs
  const otpInputRefs = useRef([]);

  // API base URL
  const API_BASE_URL = 'http://127.0.0.1:8000/api/users';

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (otpExpiry > 0) {
      timer = setInterval(() => {
        setOtpExpiry(prev => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpExpiry]);

  // Clear errors when form data changes
  useEffect(() => {
    setErrors({});
  }, [formData]);

  // Format countdown timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validate password strength
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple digits
    
    const newOtp = formData.otp.split('');
    newOtp[index] = value;
    const otpString = newOtp.join('');
    
    handleInputChange('otp', otpString);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/initiate-signup/`, {
        email: formData.email.toLowerCase().trim(),
        name: formData.name.trim()
      });

      if (response.data.success) {
        toast.success(`OTP sent to ${formData.email}`);
        setCurrentStep(2);
        setOtpExpiry(600); // 10 minutes
        setCanResendOtp(false);
        
        // Parse name for form autofill
        const nameParts = formData.name.trim().split(' ');
        handleInputChange('first_name', nameParts[0] || '');
        handleInputChange('last_name', nameParts.slice(1).join(' ') || '');
      } else {
        toast.error(response.data.message || 'Failed to send OTP');
        setErrors({ general: response.data.message });
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (formData.otp.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit OTP' });
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp/`, {
        email: formData.email.toLowerCase().trim(),
        otp: formData.otp,
        purpose: 'registration'
      });

      if (response.data.success) {
        toast.success('Email verified successfully!');
        setCurrentStep(3);
      } else {
        toast.error(response.data.message || 'Invalid OTP');
        setErrors({ otp: response.data.message });
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      const errorMessage = error.response?.data?.message || 'OTP verification failed. Please try again.';
      toast.error(errorMessage);
      setErrors({ otp: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResendOtp) return;

    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/resend-otp/`, {
        email: formData.email.toLowerCase().trim(),
        name: formData.name.trim(),
        purpose: 'registration'
      });

      if (response.data.success) {
        toast.success('New OTP sent to your email');
        setOtpExpiry(600); // Reset timer
        setCanResendOtp(false);
        handleInputChange('otp', ''); // Clear current OTP
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/signup-verified/`, {
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: formData.phone_number.trim(),
        otp_verified: true
      });

      if (response.data.success) {
        toast.success('Registration successful! Welcome to Anand Mobiles!');
        
        // Call success callback with user data
        if (onSignupSuccess) {
          onSignupSuccess({
            user: response.data.user,
            token: response.data.token,
            message: response.data.message
          });
        }
      } else {
        toast.error(response.data.message || 'Registration failed');
        setErrors({ general: response.data.message });
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Reset to step 1
  const handleBackToEmail = () => {
    setCurrentStep(1);
    setFormData(prev => ({ ...prev, otp: '' }));
    setOtpExpiry(0);
    setCanResendOtp(false);
  };

  return (
    <div 
      className="max-w-md mx-auto rounded-2xl shadow-xl overflow-hidden"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <div 
        className="px-8 py-6"
        style={{ 
          background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 100%)`,
          color: 'var(--text-on-brand)'
        }}
      >
        <h2 className="text-2xl font-bold text-center">
          Create Account
        </h2>
        <p className="text-center mt-1 opacity-90">
          Join Anand Mobiles today
        </p>
        
        {/* Progress indicator */}
        <div className="flex justify-center mt-4 space-x-2">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`w-3 h-3 rounded-full transition-colors ${
                step <= currentStep 
                  ? 'opacity-100' 
                  : 'opacity-30'
              }`}
              style={{
                backgroundColor: 'var(--text-on-brand)'
              }}
            />
          ))}
        </div>
      </div>

      <div className="px-8 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Email and Name */}
          {currentStep === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSendOtp}
              className="space-y-4"
            >
              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Email Address
                </label>
                <div className="relative">
                  <FiMail 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: 'var(--text-secondary)' }}
                  />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-2'
                    }`}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      borderColor: errors.email ? 'var(--error-color)' : 'var(--border-primary)',
                      '--tw-ring-color': errors.email ? 'var(--error-color)' : 'var(--brand-primary)'
                    }}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm mt-1" style={{ color: 'var(--error-color)' }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Full Name
                </label>
                <div className="relative">
                  <FiUser 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    style={{ color: 'var(--text-secondary)' }}
                  />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-2'
                    }`}
                    style={{
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      borderColor: errors.name ? 'var(--error-color)' : 'var(--border-primary)',
                      '--tw-ring-color': errors.name ? 'var(--error-color)' : 'var(--brand-primary)'
                    }}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm mt-1" style={{ color: 'var(--error-color)' }}>
                    {errors.name}
                  </p>
                )}
              </div>

              {errors.general && (
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
                      {errors.general}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-hover) 100%)`,
                  color: 'var(--text-on-brand)'
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <FiRefreshCw className="animate-spin mr-2" />
                    Sending OTP...
                  </div>
                ) : (
                  'Send Verification Code'
                )}
              </button>
            </motion.form>
          )}

          {/* Step 2: OTP Verification */}
          {currentStep === 2 && (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              onSubmit={handleVerifyOtp}
              className="space-y-4"
            >
              <div className="text-center">
                <FiMail className="mx-auto text-4xl text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Check Your Email
                </h3>
                <p className="text-gray-600 text-sm">
                  We sent a 6-digit verification code to:
                </p>
                <p className="text-blue-600 font-medium">{formData.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <div className="flex justify-center space-x-2">
                  {[0, 1, 2, 3, 4, 5].map(index => (
                    <input
                      key={index}
                      ref={el => otpInputRefs.current[index] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={formData.otp[index] || ''}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className={`w-12 h-12 text-center text-lg font-bold border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.otp ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={loading}
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-2 text-center">{errors.otp}</p>
                )}
              </div>

              {/* Timer and Resend */}
              <div className="text-center">
                {otpExpiry > 0 ? (
                  <div className="flex items-center justify-center text-gray-600">
                    <FiClock className="mr-1" />
                    <span className="text-sm">Code expires in {formatTime(otpExpiry)}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || !canResendOtp}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:text-gray-400"
                  >
                    Resend verification code
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || formData.otp.length !== 6}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
            </motion.form>
          )}

          {/* Step 3: Complete Registration */}
          {currentStep === 3 && (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              onSubmit={handleCompleteRegistration}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <FiCheck className="mx-auto text-4xl text-green-500 mb-2" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Email Verified!
                </h3>
                <p className="text-gray-600 text-sm">
                  Complete your registration below
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="First name"
                    disabled={loading}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Last name"
                    disabled={loading}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Phone number"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Create password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <FiAlertCircle className="text-red-500 mr-2" />
                    <p className="text-red-700 text-sm">{errors.general}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <FiRefreshCw className="animate-spin mr-2" />
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Switch to Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPSignupComponent;
