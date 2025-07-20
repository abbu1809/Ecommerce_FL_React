/**
 * 🔐 Unified Authentication Service
 * Handles all authentication operations for the new RBAC system
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class UnifiedAuthService {
  /**
   * Register a new user with unified RBAC system
   */
  static async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data,
          message: data.message || 'Registration successful'
        };
      } else {
        return {
          success: false,
          error: data.error || 'Registration failed',
          code: data.code || 'UNKNOWN_ERROR'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Login user with unified RBAC system
   */
  static async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data,
          message: data.message || 'Login successful'
        };
      } else {
        return {
          success: false,
          error: data.error || 'Login failed',
          code: data.code || 'UNKNOWN_ERROR'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile() {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found',
          code: 'NO_TOKEN'
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data.user,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to fetch profile',
          code: data.code || 'PROFILE_ERROR'
        };
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Get all users (admin only)
   */
  static async getAllUsers(filters = {}) {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found',
          code: 'NO_TOKEN'
        };
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.user_type) {
        queryParams.append('user_type', filters.user_type);
      }
      if (filters.limit) {
        queryParams.append('limit', filters.limit);
      }

      const url = `${API_BASE_URL}/api/auth/admin/users/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data,
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to fetch users',
          code: data.code || 'USERS_FETCH_ERROR'
        };
      }
    } catch (error) {
      console.error('Users fetch error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Verify a user (admin only)
   */
  static async verifyUser(userId) {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found',
          code: 'NO_TOKEN'
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/admin/verify/${userId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          data: data,
          message: data.message || 'User verified successfully'
        };
      } else {
        return {
          success: false,
          error: data.error || 'Failed to verify user',
          code: data.code || 'VERIFY_ERROR'
        };
      }
    } catch (error) {
      console.error('User verification error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Logout user (clear local storage)
   */
  static logout() {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      return {
        success: true,
        message: 'Logged out successfully'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Failed to logout properly'
      };
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return false;
    }

    try {
      // Basic JWT token validation (check expiry)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        // Token expired
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Get user permissions from stored token
   */
  static getUserPermissions() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return [];
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.permissions || [];
    } catch (error) {
      console.error('Permission extraction error:', error);
      return [];
    }
  }

  /**
   * Check if user has specific permission
   */
  static hasPermission(permission) {
    const permissions = this.getUserPermissions();
    return permissions.includes('*') || permissions.includes(permission);
  }

  /**
   * Get user role from stored token
   */
  static getUserRole() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_type || null;
    } catch (error) {
      console.error('Role extraction error:', error);
      return null;
    }
  }

  /**
   * Check if user has specific role
   */
  static hasRole(role) {
    const userRole = this.getUserRole();
    return userRole === role;
  }
}

export { UnifiedAuthService };
