/**
 * Admin Authentication Debugger
 * This component helps debug admin authentication issues
 */

import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminAuthDebugger = () => {
  const [authStatus, setAuthStatus] = useState({
    hasToken: false,
    tokenValue: null,
    tokenExpiry: null,
    isLoggedIn: false,
    adminUser: null,
    apiTest: null
  });

  const [loginForm, setLoginForm] = useState({
    username: 'admin',
    password: 'admin123'
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    
    setAuthStatus({
      hasToken: !!token,
      tokenValue: token ? `${token.substring(0, 20)}...` : null,
      isLoggedIn: !!token && !!user,
      adminUser: user ? JSON.parse(user) : null,
      apiTest: null
    });
  };

  const testApiCall = async () => {
    try {
      const response = await adminApi.get('/admin/profile/');
      setAuthStatus(prev => ({
        ...prev,
        apiTest: { success: true, data: response.data }
      }));
      toast.success('API call successful!');
    } catch (error) {
      setAuthStatus(prev => ({
        ...prev,
        apiTest: { success: false, error: error.response?.data || error.message }
      }));
      toast.error(`API call failed: ${error.response?.status || 'Unknown error'}`);
    }
  };

  const loginAsAdmin = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/admin/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        toast.success('Admin login successful!');
        checkAuthStatus();
      } else {
        const errorData = await response.json();
        toast.error(`Login failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      toast.error(`Login error: ${error.message}`);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    toast.success('Logged out successfully');
    checkAuthStatus();
  };

  const testHomepageInit = async () => {
    try {
      const response = await adminApi.post('/admin/homepage/h15/initialize/');
      toast.success('Homepage initialization successful!');
      console.log('Homepage init response:', response.data);
    } catch (error) {
      toast.error(`Homepage init failed: ${error.response?.status || 'Unknown'} - ${error.response?.data?.message || error.message}`);
      console.error('Homepage init error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>🔍 Admin Authentication Debugger</h2>
      
      {/* Authentication Status */}
      <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Authentication Status</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <div>
            <strong>Has Token:</strong> 
            <span style={{ color: authStatus.hasToken ? 'green' : 'red', marginLeft: '10px' }}>
              {authStatus.hasToken ? '✅ YES' : '❌ NO'}
            </span>
          </div>
          
          {authStatus.tokenValue && (
            <div>
              <strong>Token Preview:</strong> 
              <code style={{ marginLeft: '10px', fontSize: '12px', backgroundColor: '#e9ecef', padding: '2px 6px', borderRadius: '4px' }}>
                {authStatus.tokenValue}
              </code>
            </div>
          )}
          
          <div>
            <strong>Is Logged In:</strong> 
            <span style={{ color: authStatus.isLoggedIn ? 'green' : 'red', marginLeft: '10px' }}>
              {authStatus.isLoggedIn ? '✅ YES' : '❌ NO'}
            </span>
          </div>
          
          {authStatus.adminUser && (
            <div>
              <strong>Admin User:</strong> 
              <span style={{ marginLeft: '10px' }}>
                {authStatus.adminUser.username} ({authStatus.adminUser.email})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Login Form */}
      {!authStatus.isLoggedIn && (
        <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
          <h3>Admin Login</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Username"
              value={loginForm.username}
              onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
              style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button 
              onClick={loginAsAdmin}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Login as Admin
            </button>
          </div>
          <small style={{ color: '#6c757d' }}>
            Default credentials: admin / admin123
          </small>
        </div>
      )}

      {/* Test Buttons */}
      <div style={{ marginBottom: '30px' }}>
        <h3>API Tests</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={checkAuthStatus}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Status
          </button>
          
          <button 
            onClick={testApiCall}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Admin API
          </button>

          <button 
            onClick={testHomepageInit}
            style={{ 
              padding: '10px 15px', 
              backgroundColor: '#17a2b8', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Homepage Init
          </button>
          
          {authStatus.isLoggedIn && (
            <button 
              onClick={logout}
              style={{ 
                padding: '10px 15px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* API Test Results */}
      {authStatus.apiTest && (
        <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: authStatus.apiTest.success ? '#d4edda' : '#f8d7da', borderRadius: '8px' }}>
          <h3>API Test Results</h3>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '10px', 
            borderRadius: '4px', 
            fontSize: '12px',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify(authStatus.apiTest, null, 2)}
          </pre>
        </div>
      )}

      {/* Instructions */}
      <div style={{ padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
        <h3>Instructions</h3>
        <ol>
          <li>Check if you have an admin token in localStorage</li>
          <li>If not logged in, use the login form with admin/admin123</li>
          <li>Test the admin API to verify authentication works</li>
          <li>Test homepage initialization to debug the specific issue</li>
          <li>Check the browser console for detailed error messages</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminAuthDebugger;
