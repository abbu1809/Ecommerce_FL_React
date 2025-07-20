import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUnifiedAuthStore } from '../store/unifiedAuthStore';

const UnifiedLogin = () => {
  const navigate = useNavigate();
  const { login: loginUser } = useUnifiedAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        // Smart redirect based on user type from response
        const dashboardUrl = response.data.dashboard_url || '/dashboard';
        
        // Show success message
        const userTypeDisplay = response.data.user.user_type_display || response.data.user.user_type;
        alert(`Welcome back, ${response.data.user.first_name}! (${userTypeDisplay})`);
        
        navigate(dashboardUrl);
      } else {
        setError(response.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            🔐 Sign In
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your unified dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/unified-signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Create one here
              </Link>
            </p>
          </div>
        </form>

        {/* Account Types Info */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">🎯 Supported Account Types:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>• 🛒 Customers</div>
            <div>• 🏪 Vendors</div>
            <div>• 🚚 Delivery Partners</div>
            <div>• 👑 Administrators</div>
            <div>• 📊 Managers</div>
            <div>• 🔐 All unified</div>
          </div>
        </div>

        {/* Legacy Login Note */}
        <div className="text-center text-xs text-gray-500">
          <p>
            🔄 Migrating from old system?{' '}
            <Link
              to="/legacy-login"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Use legacy login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLogin;
