/**
 * 🔍 Authentication Debugger Component
 * Helps debug unified authentication and navigation issues
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuthStoreImproved } from '../store/unifiedAuthStoreImproved';
import useOrderStore from '../store/useOrder';
import toast from 'react-hot-toast';
import { FiRefreshCw, FiUser, FiShoppingBag, FiMapPin, FiSettings, FiLogOut } from 'react-icons/fi';

const AuthDebugger = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, token, userRole, permissions } = useUnifiedAuthStoreImproved();
  const { getAllOrders, isLoading: ordersLoading, error: ordersError } = useOrderStore();
  
  const [authStatus, setAuthStatus] = useState({
    unifiedAuth: null,
    legacyTokens: {},
    apiTest: null,
    navigationTest: []
  });

  const [testCredentials, setTestCredentials] = useState({
    email: 'anand@example.com',
    password: 'anand123'
  });

  const checkAuthStatus = React.useCallback(() => {
    // Check unified auth state
    const unifiedAuth = {
      user,
      isAuthenticated,
      token: token ? `${token.substring(0, 20)}...` : null,
      userRole,
      permissions: permissions || []
    };

    // Check legacy tokens in localStorage
    const legacyTokens = {
      auth_token: localStorage.getItem('auth_token') ? 'Present' : 'Missing',
      anand_mobiles_token: localStorage.getItem('anand_mobiles_token') ? 'Present' : 'Missing',
      admin_token: localStorage.getItem('admin_token') ? 'Present' : 'Missing',
      user_data: localStorage.getItem('user_data') ? 'Present' : 'Missing',
      anand_mobiles_user: localStorage.getItem('anand_mobiles_user') ? 'Present' : 'Missing'
    };

    setAuthStatus({
      unifiedAuth,
      legacyTokens,
      apiTest: null,
      navigationTest: []
    });
  }, [user, isAuthenticated, token, userRole, permissions]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const testOrdersAPI = async () => {
    try {
      toast.loading('Testing orders API...', { id: 'orders-test' });
      
      const result = await getAllOrders();
      
      setAuthStatus(prev => ({
        ...prev,
        apiTest: {
          success: true,
          data: result,
          ordersCount: result ? result.length : 0,
          error: ordersError
        }
      }));
      
      toast.success(`Orders API test successful! Found ${result ? result.length : 0} orders`, { id: 'orders-test' });
    } catch (error) {
      setAuthStatus(prev => ({
        ...prev,
        apiTest: {
          success: false,
          error: error.message || error.toString(),
          ordersError
        }
      }));
      
      toast.error(`Orders API test failed: ${error.message}`, { id: 'orders-test' });
    }
  };

  const testNavigation = (path, label) => {
    try {
      navigate(path);
      
      setAuthStatus(prev => ({
        ...prev,
        navigationTest: [
          ...prev.navigationTest.slice(-4), // Keep last 5
          { path, label, status: 'success', timestamp: new Date().toLocaleTimeString() }
        ]
      }));
      
      toast.success(`Navigation to ${label} successful`);
    } catch (error) {
      setAuthStatus(prev => ({
        ...prev,
        navigationTest: [
          ...prev.navigationTest.slice(-4),
          { path, label, status: 'error', error: error.message, timestamp: new Date().toLocaleTimeString() }
        ]
      }));
      
      toast.error(`Navigation to ${label} failed: ${error.message}`);
    }
  };

  const testQuickLogin = async () => {
    try {
      const { login } = useUnifiedAuthStoreImproved.getState();
      toast.loading('Testing quick login...', { id: 'login-test' });
      
      const result = await login(testCredentials);
      
      if (result.success) {
        toast.success('Quick login successful!', { id: 'login-test' });
        checkAuthStatus();
      } else {
        toast.error(`Login failed: ${result.error}`, { id: 'login-test' });
      }
    } catch (error) {
      toast.error(`Login error: ${error.message}`, { id: 'login-test' });
    }
  };

  return (
    <div className="fixed top-4 right-4 w-96 bg-white shadow-2xl rounded-lg border z-50 max-h-[90vh] overflow-y-auto">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          🔍 Auth Debugger
          <button 
            onClick={checkAuthStatus}
            className="ml-auto p-1 hover:bg-white rounded-full transition-colors"
            title="Refresh status"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
        </h3>
      </div>

      <div className="p-4 space-y-4 text-sm">
        {/* Unified Auth Status */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-700">🔐 Unified Auth Status</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Authenticated:</span>
              <span className={`font-semibold ${authStatus.unifiedAuth?.isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                {authStatus.unifiedAuth?.isAuthenticated ? '✅ YES' : '❌ NO'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>User:</span>
              <span className="font-mono text-xs truncate max-w-32">
                {authStatus.unifiedAuth?.user?.email || 'None'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Role:</span>
              <span className="font-semibold text-blue-600">
                {authStatus.unifiedAuth?.userRole || 'None'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Token:</span>
              <span className="font-mono text-xs">
                {authStatus.unifiedAuth?.token || 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Legacy Tokens Status */}
        <div className="bg-yellow-50 p-3 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-700">💾 LocalStorage Tokens</h4>
          <div className="space-y-1">
            {Object.entries(authStatus.legacyTokens).map(([key, status]) => (
              <div key={key} className="flex justify-between">
                <span className="font-mono text-xs">{key}:</span>
                <span className={`font-semibold text-xs ${status === 'Present' ? 'text-green-600' : 'text-red-600'}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-700">⚡ Quick Actions</h4>
          <div className="space-y-2">
            <button
              onClick={testOrdersAPI}
              className="w-full px-3 py-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors flex items-center gap-2"
              disabled={ordersLoading}
            >
              <FiShoppingBag className="w-3 h-3" />
              {ordersLoading ? 'Testing...' : 'Test Orders API'}
            </button>
            
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email"
                value={testCredentials.email}
                onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
                className="flex-1 px-2 py-1 border rounded text-xs"
              />
              <input
                type="password"
                placeholder="Password"
                value={testCredentials.password}
                onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="flex-1 px-2 py-1 border rounded text-xs"
              />
            </div>
            
            <button
              onClick={testQuickLogin}
              className="w-full px-3 py-2 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FiUser className="w-3 h-3" />
              Quick Test Login
            </button>
          </div>
        </div>

        {/* Navigation Tests */}
        <div className="bg-purple-50 p-3 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-700">🧭 Navigation Tests</h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => testNavigation('/profile', 'Profile')}
              className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors flex items-center gap-1"
            >
              <FiUser className="w-3 h-3" />
              Profile
            </button>
            <button
              onClick={() => testNavigation('/orders', 'Orders')}
              className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors flex items-center gap-1"
            >
              <FiShoppingBag className="w-3 h-3" />
              Orders
            </button>
            <button
              onClick={() => testNavigation('/profile/addresses', 'Addresses')}
              className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors flex items-center gap-1"
            >
              <FiMapPin className="w-3 h-3" />
              Addresses
            </button>
            <button
              onClick={() => testNavigation('/profile/settings', 'Settings')}
              className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors flex items-center gap-1"
            >
              <FiSettings className="w-3 h-3" />
              Settings
            </button>
          </div>
          
          {authStatus.navigationTest.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-600 mb-1">Recent Navigation:</p>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {authStatus.navigationTest.slice(-3).map((nav, index) => (
                  <div key={index} className="text-xs flex justify-between">
                    <span className={nav.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                      {nav.status === 'success' ? '✅' : '❌'} {nav.label}
                    </span>
                    <span className="text-gray-500">{nav.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* API Test Results */}
        {authStatus.apiTest && (
          <div className={`p-3 rounded-lg ${authStatus.apiTest.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h4 className="font-semibold mb-2 text-gray-700">🔬 API Test Results</h4>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-semibold ${authStatus.apiTest.success ? 'text-green-600' : 'text-red-600'}`}>
                  {authStatus.apiTest.success ? '✅ SUCCESS' : '❌ FAILED'}
                </span>
              </div>
              
              {authStatus.apiTest.success ? (
                <div className="flex justify-between">
                  <span>Orders Found:</span>
                  <span className="font-semibold text-blue-600">
                    {authStatus.apiTest.ordersCount}
                  </span>
                </div>
              ) : (
                <div className="bg-red-100 p-2 rounded text-red-700 font-mono text-xs break-all">
                  {authStatus.apiTest.error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-100 p-3 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-700">📝 Instructions</h4>
          <ol className="text-xs space-y-1 text-gray-600">
            <li>1. Check unified auth status (should be authenticated)</li>
            <li>2. Verify tokens are present in localStorage</li>
            <li>3. Test orders API to check authorization</li>
            <li>4. Test navigation to profile sections</li>
            <li>5. Use quick login if not authenticated</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugger;
