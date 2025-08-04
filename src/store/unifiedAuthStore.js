import { create } from "zustand";
import { UnifiedAuthService } from "../services/unifiedAuthService";

/**
 * 🔐 Unified Authentication Store for RBAC System
 * Manages authentication state for all user types
 */
const useUnifiedAuthStore = create((set, get) => ({
  // Auth state
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // User permissions and role
  permissions: [],
  userRole: null,

  // Initialize auth state from localStorage on app start
  initializeAuth: () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && UnifiedAuthService.isAuthenticated()) {
      const user = userData ? JSON.parse(userData) : null;
      const permissions = UnifiedAuthService.getUserPermissions();
      const userRole = UnifiedAuthService.getUserRole();
      
      set({
        token,
        user,
        isAuthenticated: true,
        permissions,
        userRole
      });
    } else {
      // Clear invalid auth data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await UnifiedAuthService.login(credentials);
      
      if (response.success) {
        const { token, user } = response.data;
        
        // Store auth data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Update store state
        set({
          token,
          user,
          isAuthenticated: true,
          permissions: user.permissions || [],
          userRole: user.user_type,
          isLoading: false,
          error: null
        });
        
        return { success: true, data: response.data };
      } else {
        set({ 
          isLoading: false, 
          error: response.error,
          isAuthenticated: false 
        });
        return { success: false, error: response.error };
      }
    } catch {
      const errorMsg = 'Login failed. Please try again.';
      set({ 
        isLoading: false, 
        error: errorMsg,
        isAuthenticated: false 
      });
      return { success: false, error: errorMsg };
    }
  },

  // Register action
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await UnifiedAuthService.register(userData);
      
      if (response.success) {
        const { token, user } = response.data;
        
        // Store auth data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Update store state
        set({
          token,
          user,
          isAuthenticated: true,
          permissions: user.permissions || [],
          userRole: user.user_type,
          isLoading: false,
          error: null
        });
        
        return { success: true, data: response.data };
      } else {
        set({ 
          isLoading: false, 
          error: response.error,
          isAuthenticated: false 
        });
        return { success: false, error: response.error };
      }
    } catch {
      const errorMsg = 'Registration failed. Please try again.';
      set({ 
        isLoading: false, 
        error: errorMsg,
        isAuthenticated: false 
      });
      return { success: false, error: errorMsg };
    }
  },

  // Logout action
  logout: () => {
    UnifiedAuthService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      permissions: [],
      userRole: null,
      error: null
    });
  },

  // Refresh user profile
  refreshProfile: async () => {
    if (!get().isAuthenticated) {
      return { success: false, error: 'Not authenticated' };
    }

    set({ isLoading: true });
    
    try {
      const response = await UnifiedAuthService.getProfile();
      
      if (response.success) {
        const user = response.data;
        
        // Update stored user data
        localStorage.setItem('user_data', JSON.stringify(user));
        
        // Update store state
        set({
          user,
          permissions: user.permissions || [],
          isLoading: false
        });
        
        return { success: true, data: user };
      } else {
        set({ isLoading: false, error: response.error });
        
        // If token is invalid, logout
        if (response.code === 'TOKEN_INVALID') {
          get().logout();
        }
        
        return { success: false, error: response.error };
      }
    } catch {
      const errorMsg = 'Failed to refresh profile';
      set({ isLoading: false, error: errorMsg });
      return { success: false, error: errorMsg };
    }
  },

  // Permission helpers
  hasPermission: (permission) => {
    const { permissions } = get();
    return permissions.includes('*') || permissions.includes(permission);
  },

  hasRole: (role) => {
    const { userRole } = get();
    return userRole === role;
  },

  hasAnyRole: (roles) => {
    const { userRole } = get();
    return roles.includes(userRole);
  },

  // Role-based helpers
  isAdmin: () => get().hasRole('admin'),
  isCustomer: () => get().hasRole('customer'),
  isDeliveryPartner: () => get().hasRole('delivery_partner'),
  isVendor: () => get().hasRole('vendor'),
  isManager: () => get().hasRole('manager'),

  // Admin helpers
  isAdminOrManager: () => get().hasAnyRole(['admin', 'manager']),
  canManageUsers: () => get().hasPermission('manage_users'),
  canManageProducts: () => get().hasPermission('manage_products'),
  canViewAnalytics: () => get().hasPermission('view_analytics'),

  // Clear error
  clearError: () => set({ error: null }),

  // Get dashboard URL based on user type
  getDashboardUrl: () => {
    const { userRole } = get();
    const dashboardMap = {
      admin: '/admin/dashboard',
      delivery_partner: '/delivery/dashboard',
      vendor: '/vendor/dashboard',
      manager: '/manager/dashboard',
      customer: '/dashboard'
    };
    return dashboardMap[userRole] || '/dashboard';
  }
}));

// Auto-initialize auth on module load
if (typeof window !== 'undefined') {
  useUnifiedAuthStore.getState().initializeAuth();
}

export { useUnifiedAuthStore };
