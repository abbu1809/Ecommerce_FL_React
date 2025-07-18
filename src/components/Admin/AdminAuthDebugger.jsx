import React, { useState, useEffect } from 'react';

const AdminAuthDebugger = () => {
  const [authState, setAuthState] = useState({});

  useEffect(() => {
    const checkAuthState = () => {
      const adminToken = localStorage.getItem('admin_token');
      const adminAuth = localStorage.getItem('admin_auth');
      const authToken = localStorage.getItem('auth_token');
      
      setAuthState({
        adminToken: adminToken ? 'Present' : 'Missing',
        adminAuth: adminAuth ? 'Present' : 'Missing',
        authToken: authToken ? 'Present' : 'Missing',
        adminTokenValue: adminToken ? adminToken.substring(0, 20) + '...' : null,
        authTokenValue: authToken ? authToken.substring(0, 20) + '...' : null,
      });
    };

    checkAuthState();
    
    // Check every 2 seconds
    const interval = setInterval(checkAuthState, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const testAdminApi = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/analytics/dashboard/?range=last30days', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Admin API Test Response:', response.status, response.statusText);
      const data = await response.json();
      console.log('Response data:', data);
    } catch (error) {
      console.error('Admin API Test Error:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50 max-w-sm">
      <h3 className="font-bold mb-2 text-sm">Admin Auth Debug</h3>
      <div className="space-y-1 text-xs">
        <div>Admin Token: <span className={authState.adminToken === 'Present' ? 'text-green-600' : 'text-red-600'}>{authState.adminToken}</span></div>
        <div>Admin Auth: <span className={authState.adminAuth === 'Present' ? 'text-green-600' : 'text-red-600'}>{authState.adminAuth}</span></div>
        <div>Auth Token: <span className={authState.authToken === 'Present' ? 'text-green-600' : 'text-red-600'}>{authState.authToken}</span></div>
        {authState.adminTokenValue && (
          <div className="mt-2 text-xs text-gray-600">
            Admin: {authState.adminTokenValue}
          </div>
        )}
        {authState.authTokenValue && (
          <div className="text-xs text-gray-600">
            Auth: {authState.authTokenValue}
          </div>
        )}
        <button 
          onClick={testAdminApi}
          className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Test Admin API
        </button>
      </div>
    </div>
  );
};

export default AdminAuthDebugger;
