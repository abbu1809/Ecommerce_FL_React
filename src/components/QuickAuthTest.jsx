/**
 * 🧪 Quick Auth Test Script
 * Tests authentication token storage and API calls
 */

import React, { useState } from 'react';
import { useUnifiedAuthStoreImproved } from '../store/unifiedAuthStoreImproved';
import useOrderStore from '../store/useOrder';
import toast from 'react-hot-toast';

const QuickAuthTest = () => {
  const { login, logout, user, isAuthenticated } = useUnifiedAuthStoreImproved();
  const { getAllOrders, isLoading, error } = useOrderStore();
  
  const [testResults, setTestResults] = useState({
    loginTest: null,
    tokenTest: null,
    ordersTest: null
  });

  const runLoginTest = async () => {
    toast.loading('Testing login...', { id: 'login-test' });
    
    try {
      // Test with different credentials
      const credentials = [
        { email: 'test@example.com', password: 'test123' },
        { email: 'admin@example.com', password: 'admin123' },
        { email: 'anand@anandmobiles.com', password: 'password123' }
      ];
      
      for (const cred of credentials) {
        console.log(`🔐 Testing login with: ${cred.email}`);
        const result = await login(cred);
        
        if (result.success) {
          setTestResults(prev => ({
            ...prev,
            loginTest: { success: true, email: cred.email, user: result.data.user }
          }));
          toast.success(`Login successful with ${cred.email}!`, { id: 'login-test' });
          return;
        }
      }
      
      // If no credentials worked
      setTestResults(prev => ({
        ...prev,
        loginTest: { success: false, error: 'All test credentials failed' }
      }));
      toast.error('All login attempts failed', { id: 'login-test' });
      
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        loginTest: { success: false, error: error.message }
      }));
      toast.error(`Login test error: ${error.message}`, { id: 'login-test' });
    }
  };

  const runTokenTest = () => {
    const tokens = {
      auth_token: localStorage.getItem('auth_token'),
      anand_mobiles_token: localStorage.getItem('anand_mobiles_token'),
      admin_token: localStorage.getItem('admin_token')
    };
    
    setTestResults(prev => ({
      ...prev,
      tokenTest: tokens
    }));
    
    console.log('🔑 Token Test Results:', tokens);
    
    if (tokens.auth_token && tokens.anand_mobiles_token) {
      toast.success('✅ Both auth tokens present!');
    } else if (tokens.auth_token || tokens.anand_mobiles_token) {
      toast.warning('⚠️ Only one auth token present');
    } else {
      toast.error('❌ No auth tokens found');
    }
  };

  const runOrdersTest = async () => {
    toast.loading('Testing orders API...', { id: 'orders-test' });
    
    try {
      const result = await getAllOrders();
      
      setTestResults(prev => ({
        ...prev,
        ordersTest: {
          success: true,
          ordersCount: result ? result.length : 0,
          orders: result,
          error: error
        }
      }));
      
      toast.success(`Orders API successful! Found ${result ? result.length : 0} orders`, { id: 'orders-test' });
      
    } catch (err) {
      setTestResults(prev => ({
        ...prev,
        ordersTest: {
          success: false,
          error: err.message,
          storeError: error
        }
      }));
      
      toast.error(`Orders API failed: ${err.message}`, { id: 'orders-test' });
    }
  };

  const runAllTests = async () => {
    await runLoginTest();
    setTimeout(() => {
      runTokenTest();
      setTimeout(() => {
        runOrdersTest();
      }, 1000);
    }, 1000);
  };

  return (
    <div className="fixed top-4 left-4 w-80 bg-white shadow-2xl rounded-lg border z-50 max-h-[90vh] overflow-y-auto">
      <div className="p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
        <h3 className="font-bold text-lg text-gray-800">🧪 Quick Auth Test</h3>
      </div>

      <div className="p-4 space-y-4 text-sm">
        {/* Current Auth Status */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold mb-2">Current Status</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Authenticated:</span>
              <span className={`font-semibold ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                {isAuthenticated ? '✅' : '❌'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>User:</span>
              <span className="font-mono text-xs truncate max-w-32">
                {user?.email || 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="space-y-2">
          <button
            onClick={runLoginTest}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            🔐 Test Login
          </button>
          
          <button
            onClick={runTokenTest}
            className="w-full px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
          >
            🔑 Test Tokens
          </button>
          
          <button
            onClick={runOrdersTest}
            className="w-full px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors"
            disabled={isLoading}
          >
            📦 Test Orders API
          </button>
          
          <button
            onClick={runAllTests}
            className="w-full px-3 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
          >
            🚀 Run All Tests
          </button>
          
          <button
            onClick={logout}
            className="w-full px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
          >
            🚪 Logout
          </button>
        </div>

        {/* Test Results */}
        {testResults.loginTest && (
          <div className={`p-3 rounded-lg ${testResults.loginTest.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h4 className="font-semibold mb-2">🔐 Login Test</h4>
            <div className="text-xs">
              {testResults.loginTest.success ? (
                <div>
                  <div className="text-green-700">✅ Success</div>
                  <div>Email: {testResults.loginTest.email}</div>
                  <div>User: {testResults.loginTest.user?.first_name} {testResults.loginTest.user?.last_name}</div>
                </div>
              ) : (
                <div className="text-red-700">❌ {testResults.loginTest.error}</div>
              )}
            </div>
          </div>
        )}

        {testResults.tokenTest && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="font-semibold mb-2">🔑 Token Test</h4>
            <div className="space-y-1 text-xs">
              {Object.entries(testResults.tokenTest).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-mono">{key}:</span>
                  <span className={`font-semibold ${value ? 'text-green-600' : 'text-red-600'}`}>
                    {value ? `${value.substring(0, 10)}...` : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {testResults.ordersTest && (
          <div className={`p-3 rounded-lg ${testResults.ordersTest.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h4 className="font-semibold mb-2">📦 Orders Test</h4>
            <div className="text-xs">
              {testResults.ordersTest.success ? (
                <div>
                  <div className="text-green-700">✅ Success</div>
                  <div>Orders found: {testResults.ordersTest.ordersCount}</div>
                </div>
              ) : (
                <div className="text-red-700">❌ {testResults.ordersTest.error}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAuthTest;
