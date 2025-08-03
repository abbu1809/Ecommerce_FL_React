/**
 * OTP Test Page for Development and Testing
 * ==========================================
 * 
 * This page demonstrates the OTP email verification functionality
 * and provides an interface for testing all OTP endpoints.
 */

import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; // Used for JSX motion elements
import { FiMail, FiCheck, FiAlertCircle, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const OTPTestPage = () => {
  const [activeTab, setActiveTab] = useState('signup');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});

  // Form states
  const [signupData, setSignupData] = useState({
    email: 'test@anandmobiles.com',
    name: 'Test User'
  });

  const [otpData, setOtpData] = useState({
    email: 'test@anandmobiles.com',
    otp: '',
    purpose: 'registration'
  });

  const [registrationData, setRegistrationData] = useState({
    email: 'test@anandmobiles.com',
    password: 'test123',
    first_name: 'Test',
    last_name: 'User',
    phone_number: '+1234567890'
  });

  const API_BASE_URL = 'http://127.0.0.1:8000/api/users';

  // Test service availability
  const testOTPService = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/test-otp/`);
      setResults(prev => ({
        ...prev,
        serviceTest: response.data
      }));
      toast.success('OTP Service is running!');
    } catch (error) {
      console.error('Service test error:', error);
      toast.error('OTP Service test failed');
      setResults(prev => ({
        ...prev,
        serviceTest: { error: error.response?.data || error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  // Test initiate signup
  const testInitiateSignup = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/initiate-signup/`, signupData);
      setResults(prev => ({
        ...prev,
        initiateSignup: response.data
      }));
      
      if (response.data.success) {
        toast.success(`OTP sent to ${signupData.email}`);
        setOtpData(prev => ({ ...prev, email: signupData.email }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Initiate signup error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate signup');
      setResults(prev => ({
        ...prev,
        initiateSignup: { error: error.response?.data || error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  // Test OTP verification
  const testVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp/`, otpData);
      setResults(prev => ({
        ...prev,
        verifyOTP: response.data
      }));
      
      if (response.data.success) {
        toast.success('OTP verified successfully!');
        setRegistrationData(prev => ({ ...prev, email: otpData.email }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error(error.response?.data?.message || 'OTP verification failed');
      setResults(prev => ({
        ...prev,
        verifyOTP: { error: error.response?.data || error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  // Test complete registration
  const testCompleteRegistration = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/signup-verified/`, {
        ...registrationData,
        otp_verified: true
      });
      
      setResults(prev => ({
        ...prev,
        completeRegistration: response.data
      }));
      
      if (response.data.success) {
        toast.success('Registration completed successfully!');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Complete registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      setResults(prev => ({
        ...prev,
        completeRegistration: { error: error.response?.data || error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  // Test OTP status
  const testOTPStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/otp-status/`, {
        params: {
          email: otpData.email,
          purpose: otpData.purpose
        }
      });
      
      setResults(prev => ({
        ...prev,
        otpStatus: response.data
      }));
      
      toast.success('OTP status retrieved');
    } catch (error) {
      console.error('OTP status error:', error);
      toast.error('Failed to get OTP status');
      setResults(prev => ({
        ...prev,
        otpStatus: { error: error.response?.data || error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'signup', label: 'Signup Flow', icon: FiMail },
    { id: 'individual', label: 'Individual Tests', icon: FiCheck },
    { id: 'results', label: 'Results', icon: FiAlertCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">OTP Email Verification Test</h1>
            <p className="text-blue-100 mt-2">Test the OTP email verification system</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-2" />
                      {tab.label}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            {/* Signup Flow Tab */}
            {activeTab === 'signup' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-800">Complete Signup Flow Test</h2>
                
                {/* Step 1: Initiate Signup */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Step 1: Initiate Signup</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={signupData.name}
                        onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={testInitiateSignup}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <FiRefreshCw className="animate-spin mr-2" />
                        Sending...
                      </div>
                    ) : 'Send OTP'}
                  </button>
                </div>

                {/* Step 2: Verify OTP */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Step 2: Verify OTP</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={otpData.email}
                        onChange={(e) => setOtpData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
                      <input
                        type="text"
                        value={otpData.otp}
                        onChange={(e) => setOtpData(prev => ({ ...prev, otp: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="6-digit code"
                        maxLength={6}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                      <select
                        value={otpData.purpose}
                        onChange={(e) => setOtpData(prev => ({ ...prev, purpose: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="registration">Registration</option>
                        <option value="password_reset">Password Reset</option>
                        <option value="email_change">Email Change</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={testVerifyOTP}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <FiRefreshCw className="animate-spin mr-2" />
                        Verifying...
                      </div>
                    ) : 'Verify OTP'}
                  </button>
                </div>

                {/* Step 3: Complete Registration */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Step 3: Complete Registration</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={registrationData.email}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={registrationData.password}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={registrationData.first_name}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={registrationData.last_name}
                        onChange={(e) => setRegistrationData(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={testCompleteRegistration}
                    disabled={loading}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <FiRefreshCw className="animate-spin mr-2" />
                        Creating...
                      </div>
                    ) : 'Complete Registration'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Individual Tests Tab */}
            {activeTab === 'individual' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-800">Individual API Tests</h2>
                
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={testOTPService}
                    disabled={loading}
                    className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-left"
                  >
                    <h3 className="text-lg font-semibold mb-2">Test OTP Service</h3>
                    <p className="text-blue-100">Check if OTP service is running</p>
                  </button>

                  <button
                    onClick={testOTPStatus}
                    disabled={loading}
                    className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 disabled:opacity-50 text-left"
                  >
                    <h3 className="text-lg font-semibold mb-2">Check OTP Status</h3>
                    <p className="text-green-100">Get current OTP status</p>
                  </button>
                </div>
              </motion.div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-semibold text-gray-800">Test Results</h2>
                
                {Object.keys(results).length === 0 ? (
                  <div className="text-center py-12">
                    <FiAlertCircle className="mx-auto text-6xl text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No test results yet</p>
                    <p className="text-gray-400">Run some tests to see results here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(results).map(([key, result]) => (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-2 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-60">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPTestPage;
