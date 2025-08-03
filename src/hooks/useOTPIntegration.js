/**
 * OTP Integration Hook for Existing Registration Forms
 * =================================================
 * 
 * This hook provides OTP functionality that can be integrated into 
 * existing registration forms without creating new pages.
 * 
 * Usage in existing forms:
 * 1. Add OTP verification step to any form
 * 2. Maintains existing form flow and UI
 * 3. Works for all user types (Admin, Customer, Delivery Partner)
 */

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const useOTPIntegration = (/*userType = 'customer'*/) => {
  // OTP state
  const [otpState, setOtpState] = useState({
    step: 'registration', // 'registration', 'otp_verification', 'completed'
    loading: false,
    otpSent: false,
    otpVerified: false,
    email: '',
    otp: '',
    otpExpiry: 0,
    canResend: false,
    error: ''
  });

  const API_BASE_URL = 'http://127.0.0.1:8000/api/users';

  // Send OTP to email
  const sendOTP = useCallback(async (email, name) => {
    if (!email || !name) {
      toast.error('Email and name are required');
      return false;
    }

    setOtpState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp/`, {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        purpose: 'registration'
      });

      if (response.data.success) {
        setOtpState(prev => ({
          ...prev,
          step: 'otp_verification',
          loading: false,
          otpSent: true,
          email: email.toLowerCase().trim(),
          otpExpiry: 600, // 10 minutes
          canResend: false
        }));
        
        toast.success(`OTP sent to ${email}`);
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send OTP';
      
      setOtpState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Verify OTP
  const verifyOTP = useCallback(async (otpCode) => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return false;
    }

    setOtpState(prev => ({ ...prev, loading: true, error: '' }));

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp/`, {
        email: otpState.email,
        otp: otpCode,
        purpose: 'registration'
      });

      if (response.data.success) {
        setOtpState(prev => ({
          ...prev,
          step: 'completed',
          loading: false,
          otpVerified: true,
          otp: otpCode
        }));
        
        toast.success('Email verified successfully!');
        return true;
      } else {
        throw new Error(response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'OTP verification failed';
      
      setOtpState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      
      toast.error(errorMessage);
      return false;
    }
  }, [otpState.email]);

  // Resend OTP
  const resendOTP = useCallback(async () => {
    if (!otpState.email) {
      toast.error('No email found for resending OTP');
      return false;
    }

    const success = await sendOTP(otpState.email, 'User'); // Use generic name for resend
    if (success) {
      setOtpState(prev => ({ 
        ...prev, 
        otpExpiry: 600, 
        canResend: false 
      }));
    }
    return success;
  }, [otpState.email, sendOTP]);

  // Reset OTP state
  const resetOTP = useCallback(() => {
    setOtpState({
      step: 'registration',
      loading: false,
      otpSent: false,
      otpVerified: false,
      email: '',
      otp: '',
      otpExpiry: 0,
      canResend: false,
      error: ''
    });
  }, []);

  // Handle OTP countdown
  const startCountdown = useCallback(() => {
    const interval = setInterval(() => {
      setOtpState(prev => {
        if (prev.otpExpiry <= 1) {
          clearInterval(interval);
          return { ...prev, otpExpiry: 0, canResend: true };
        }
        return { ...prev, otpExpiry: prev.otpExpiry - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Enhanced registration with OTP verification
  const registerWithOTP = useCallback(async (registrationData, registrationEndpoint) => {
    if (!otpState.otpVerified) {
      toast.error('Please verify your email with OTP first');
      return { success: false, error: 'Email not verified' };
    }

    try {
      const response = await axios.post(registrationEndpoint, {
        ...registrationData,
        otp_verified: true,
        email: otpState.email
      });

      if (response.data.success || response.data.message) {
        toast.success('Registration successful!');
        return { 
          success: true, 
          data: response.data,
          user: response.data.user || response.data.data,
          token: response.data.token
        };
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Registration failed';
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [otpState.otpVerified, otpState.email]);

  // Format time for countdown display
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    // State
    otpState,
    
    // Actions
    sendOTP,
    verifyOTP,
    resendOTP,
    resetOTP,
    registerWithOTP,
    startCountdown,
    
    // Helpers
    formatTime,
    
    // Computed values
    isLoading: otpState.loading,
    needsOTPVerification: otpState.step === 'otp_verification',
    isOTPVerified: otpState.otpVerified,
    canShowRegistrationForm: otpState.step === 'registration' || otpState.step === 'completed',
    otpError: otpState.error
  };
};

export default useOTPIntegration;
