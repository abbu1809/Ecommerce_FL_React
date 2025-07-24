import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUnifiedAuthStoreImproved } from '../store/unifiedAuthStoreImproved';

// Import dashboard components
import Account from '../pages/Account'; // Customer Dashboard
import AdminDashboard from '../pages/Admin/AdminDashboard';
import DeliveryDashboard from '../pages/Delivery/DeliveryDashboard';
// Note: Vendor and Manager dashboards need to be created

/**
 * 🎯 Smart Dashboard Router for Unified RBAC System
 * Automatically routes users to appropriate dashboard based on their role
 * This replaces the need for separate route-based authentication
 */
const UnifiedDashboardRouter = () => {
  const navigate = useNavigate();
  const { user, userRole, isAuthenticated, permissions } = useUnifiedAuthStoreImproved();

  // Redirect to login if not authenticated - use useEffect to prevent navigation during render
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/unified-login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Show loading state while redirecting or waiting for user data
  if (!isAuthenticated || !user || !userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Dashboard header with user info and role
  const DashboardHeader = ({ title, description }) => (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Welcome back,</p>
          <p className="font-semibold text-gray-900">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block mt-1">
            {user.user_type_display || userRole}
          </p>
        </div>
      </div>
      
      {/* Permissions indicator */}
      <div className="mt-2 text-xs text-gray-500">
        🛡️ Permissions: {permissions.length} active permissions
        {permissions.includes('*') && ' (Full Access)'}
      </div>
    </div>
  );

  // Route to appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case 'customer':
        return (
          <>
            <DashboardHeader 
              title="🛒 Customer Dashboard"
              description="Browse products, manage orders, and track deliveries"
            />
            <Account />
          </>
        );

      case 'admin':
        return (
          <>
            <DashboardHeader 
              title="👑 Admin Dashboard"
              description="Manage users, products, orders, and system settings"
            />
            <AdminDashboard />
          </>
        );

      case 'delivery_partner':
        return (
          <>
            <DashboardHeader 
              title="🚚 Delivery Dashboard"
              description="Manage deliveries, update status, and track earnings"
            />
            <DeliveryDashboard />
          </>
        );

      case 'vendor':
        return (
          <>
            <DashboardHeader 
              title="🏪 Vendor Dashboard"
              description="Manage products, view sales, and track performance"
            />
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-yellow-800">Dashboard Under Development</h3>
                <p className="text-yellow-700 mt-2">The vendor dashboard is being developed. Please check back later.</p>
              </div>
            </div>
          </>
        );

      case 'manager':
        return (
          <>
            <DashboardHeader 
              title="📊 Manager Dashboard"
              description="Store operations, user management, and analytics"
            />
            <div className="p-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-yellow-800">Dashboard Under Development</h3>
                <p className="text-yellow-700 mt-2">The manager dashboard is being developed. Please check back later.</p>
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
              <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Unknown User Role
              </h2>
              <p className="text-gray-600 mb-4">
                Your account role "{userRole}" is not recognized by the system.
              </p>
              <p className="text-sm text-gray-500">
                Please contact support for assistance.
              </p>
              <button 
                onClick={() => navigate('/unified-login')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Return to Login
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
      
      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 bg-black text-white p-2 rounded text-xs opacity-75">
          Role: {userRole} | Permissions: {permissions.length}
        </div>
      )}
    </div>
  );
};

export default UnifiedDashboardRouter;
