import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUnifiedAuthStore } from '../store/unifiedAuthStore';

/**
 * 🛡️ Protected Route Component for Unified RBAC System
 * Provides role-based and permission-based route protection
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null,
  requiredRoles = null,
  fallbackPath = '/unified-login'
}) => {
  const { 
    isAuthenticated, 
    user, 
    userRole: _userRole, 
    permissions: _permissions,
    hasPermission,
    hasRole 
  } = useUnifiedAuthStore();

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Check if specific role is required
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if user has one of multiple required roles
  if (requiredRoles && Array.isArray(requiredRoles)) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check if specific permission is required
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed, render the protected component
  return children;
};

/**
 * 🚫 Unauthorized Access Component
 */
export const UnauthorizedPage = () => {
  const { user, userRole, permissions } = useUnifiedAuthStore();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <div className="text-red-500 text-4xl mb-4">🚫</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-4">
          Your account ({userRole}) doesn't have permission to access this resource.
        </p>
        <div className="space-y-2">
          <button 
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Go Back
          </button>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
        
        {/* User info */}
        <div className="mt-4 pt-4 border-t text-sm text-gray-500">
          Logged in as: {user?.first_name} {user?.last_name}<br/>
          Role: {userRole}<br/>
          Permissions: {permissions?.length || 0}
        </div>
      </div>
    </div>
  );
};

/**
 * 🔄 Role-based Redirect Component
 * Automatically redirects users to their appropriate dashboard
 */
export const RoleBasedRedirect = () => {
  const { userRole, isAuthenticated } = useUnifiedAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/unified-login" replace />;
  }

  // Define dashboard routes for each role
  const dashboardMap = {
    customer: '/dashboard',
    admin: '/admin/dashboard',
    delivery_partner: '/delivery/dashboard',
    vendor: '/vendor/dashboard',
    manager: '/manager/dashboard'
  };

  const redirectPath = dashboardMap[userRole] || '/dashboard';
  
  return <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
