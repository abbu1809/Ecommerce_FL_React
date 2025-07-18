import { useState, useEffect } from 'react';
import axios from 'axios';

const DataFlowTester = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE = 'http://127.0.0.1:8000/api';

  const testEndpoints = [
    { name: 'Products List', url: `${API_BASE}/products/`, method: 'GET' },
    { name: 'Admin Analytics', url: `${API_BASE}/admin/analytics/dashboard/`, method: 'GET' },
    { name: 'Theme Settings', url: `${API_BASE}/admin/theme/get/`, method: 'GET' },
    { name: 'User Authentication', url: `${API_BASE}/users/profile/`, method: 'GET' },
    { name: 'Cart Operations', url: `${API_BASE}/cart/`, method: 'GET' }
  ];

  const runTests = async () => {
    setIsLoading(true);
    const results = [];

    for (const test of testEndpoints) {
      try {
        const token = localStorage.getItem('admin_auth_token') || localStorage.getItem('auth_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await axios({
          method: test.method,
          url: test.url,
          headers,
          timeout: 5000
        });

        results.push({
          name: test.name,
          status: 'success',
          statusCode: response.status,
          message: `✅ ${response.status} - ${response.statusText}`,
          data: response.data ? 'Data received' : 'No data'
        });
      } catch (error) {
        results.push({
          name: test.name,
          status: 'error',
          statusCode: error.response?.status || 'Network Error',
          message: `❌ ${error.response?.status || 'ERR'} - ${error.response?.data?.error || error.message}`,
          data: null
        });
      }
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="p-6 bg-white rounded-lg shadow-md m-4">
      <h2 className="text-2xl font-bold mb-4">Data Flow Test Results</h2>
      
      <button 
        onClick={runTests}
        disabled={isLoading}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Testing...' : 'Run Tests Again'}
      </button>

      <div className="space-y-3">
        {testResults.map((result, index) => (
          <div 
            key={index}
            className={`p-3 rounded border-l-4 ${
              result.status === 'success' 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
            }`}
          >
            <div className="font-semibold">{result.name}</div>
            <div className="text-sm text-gray-600">
              Status: {result.statusCode} | {result.message}
            </div>
            {result.data && (
              <div className="text-xs text-gray-500">{result.data}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded">
        <h3 className="font-semibold mb-2">Firebase Status Information</h3>
        <p className="text-sm text-gray-600">
          If you see quota exceeded errors (429), the application should still work using fallback data.
          The Firebase quota resets daily, so the system will automatically resume normal operation.
        </p>
      </div>
    </div>
  );
};

export default DataFlowTester;
