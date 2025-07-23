import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 🔐 Improved Unified Authentication Store
 * Features:
 * - CSRF token handling
 * - API call optimization (singleton pattern)
 * - Firebase API reduction
 * - TanStack Query integration ready
 * - Error handling improvements
 */

const API_BASE_URL = window.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

class ApiClient {
  constructor() {
    this.csrfToken = null;
    this.authCache = new Map();
    this.requestQueue = new Map();
    this.REQUEST_QUEUE_MAX_SIZE = 100; // Set a reasonable max size for the queue
  }

  async getCsrfToken() {
    if (this.csrfToken) return this.csrfToken;
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/csrf-token/`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        this.csrfToken = data.csrfToken;
        return this.csrfToken;
      }
    } catch (error) {
      console.error('CSRF token fetch failed:', error);
    }
    
    return null;
  }

  async makeRequest(endpoint, options = {}) {
    const requestKey = `${options.method || 'GET'}_${endpoint}`;
    
    // Prevent duplicate requests (singleton pattern)
    if (this.requestQueue.has(requestKey)) {
      return this.requestQueue.get(requestKey);
    }

    const requestPromise = this._performRequest(endpoint, options);
    // Enforce max size: remove oldest if over limit
    if (this.requestQueue.size >= this.REQUEST_QUEUE_MAX_SIZE) {
      const oldestKey = this.requestQueue.keys().next().value;
      this.requestQueue.delete(oldestKey);
    }
    this.requestQueue.set(requestKey, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up request queue after completion
      setTimeout(() => {
        this.requestQueue.delete(requestKey);
      }, 1000);
    }
  }

  async _performRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const csrfToken = await this.getCsrfToken();
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    if (csrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method?.toUpperCase())) {
      defaultHeaders['X-CSRFToken'] = csrfToken;
    }

    const requestOptions = {
      credentials: 'include',
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }
}

const apiClient = new ApiClient();

const useUnifiedAuthStoreImproved = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      userRole: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,
      lastActivity: null,

      // Auth cache for reducing Firebase calls
      authCache: {
        userProfile: null,
        userPermissions: null,
        lastFetch: null,
        ttl: 5 * 60 * 1000, // 5 minutes cache
      },

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      // Optimized user data fetch (singleton pattern)
      fetchUserData: async (userId) => {
        const state = get();
        const now = Date.now();
        
        // Check cache first (reduce Firebase calls)
        if (state.authCache.userProfile && 
            state.authCache.lastFetch && 
            (now - state.authCache.lastFetch) < state.authCache.ttl) {
          return state.authCache.userProfile;
        }

        try {
          const userData = await apiClient.makeRequest(`/auth/user/${userId}/`);
          
          // Update cache
          set({
            authCache: {
              ...state.authCache,
              userProfile: userData,
              lastFetch: now,
            }
          });
          
          return userData;
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          throw error;
        }
      },

      // Improved login with CSRF handling (supports both email/password and Google OAuth)
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          let requestBody;
          
          // Check if this is Google OAuth login (has idToken) or regular login
          if (credentials.idToken) {
            // Google OAuth login
            requestBody = JSON.stringify({
              idToken: credentials.idToken
            });
          } else {
            // Regular email/password login
            requestBody = JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            });
          }
          
          const response = await apiClient.makeRequest('/auth/login/', {
            method: 'POST',
            body: requestBody,
          });

          // Backend returns plain response, not wrapped in success object
          const { user, token, dashboard_url, requires_verification, message } = response;
          
          set({
            user,
            userRole: user.user_type,
            permissions: response.permissions || [],
            isAuthenticated: true,
            isLoading: false,
            lastActivity: Date.now(),
            authCache: {
              ...get().authCache,
              userProfile: user,
              userPermissions: response.permissions || [],
              lastFetch: Date.now(),
            }
          });

          // Store token for API calls
          if (token) {
            localStorage.setItem('auth_token', token);
          }

          return {
            success: true,
            data: {
              user,
              dashboard_url,
              requires_verification,
              user_type_display: user.user_type_display || user.user_type,
              message
            }
          };
        } catch (error) {
          const errorMessage = error.message || 'Login failed. Please try again.';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Improved registration with role-based handling
      register: async (registrationData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.makeRequest('/auth/register/', {
            method: 'POST',
            body: JSON.stringify(registrationData),
          });

          // Backend returns plain response, not wrapped in success object
          const { user, token, dashboard_url, requires_verification, message } = response;
          
          if (!requires_verification) {
            set({
              user,
              userRole: user.user_type,
              permissions: response.permissions || [],
              isAuthenticated: true,
              isLoading: false,
              lastActivity: Date.now(),
            });

            if (token) {
              localStorage.setItem('auth_token', token);
            }
          } else {
            set({ isLoading: false });
          }

          return {
            success: true,
            data: {
              user,
              dashboard_url,
              requires_verification,
              user_type_display: user.user_type_display || user.user_type,
              message
            }
          };
        } catch (error) {
          const errorMessage = error.message || 'Registration failed. Please try again.';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Google OAuth with improved error handling
      googleLogin: async () => {
        
        try {
          set({ isLoading: true, error: null });
          // Note: This would integrate with your existing Google OAuth setup
          const response = await apiClient.makeRequest('/users/google-auth/', {
            method: 'POST',
            body: JSON.stringify({
              // Google OAuth token would be passed here
            }),
          });

          if (response.success) {
            const { user, token, dashboard_url } = response.data;
            
            set({
              user,
              userRole: user.user_type,
              permissions: response.data.permissions || [],
              isAuthenticated: true,
              isLoading: false,
              lastActivity: Date.now(),
            });

            if (token) {
              localStorage.setItem('auth_token', token);
            }

            return {
              success: true,
              data: { user, dashboard_url }
            };
          } else {
            set({ error: response.error || 'Google login failed', isLoading: false });
            return { success: false, error: response.error };
          }
        } catch (error) {
          const errorMessage = 'Google login failed. Please try again.';
          set({ error: errorMessage, isLoading: false });
          return { success: false, error: errorMessage };
        }
      },

      // Logout with cache cleanup
      logout: () => {
        localStorage.removeItem('auth_token');
        apiClient.csrfToken = null;
        apiClient.authCache.clear();
        
        set({
          user: null,
          userRole: null,
          permissions: [],
          isAuthenticated: false,
          error: null,
          authCache: {
            userProfile: null,
            userPermissions: null,
            lastFetch: null,
            ttl: 5 * 60 * 1000,
          }
        });
      },

      // Session validation (reduce API calls)
      validateSession: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          get().logout();
          return false;
        }

        try {
          const response = await apiClient.makeRequest('/auth/validate/', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.success) {
            set({
              lastActivity: Date.now(),
            });
            return true;
          } else {
            get().logout();
            return false;
          }
        } catch (error) {
          get().logout();
          return false;
        }
      },

      // Activity tracking for session management
      updateActivity: () => {
        set({ lastActivity: Date.now() });
      },

      // Check if user has specific permission
      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },

      // Check if cache is valid
      isCacheValid: () => {
        const { authCache } = get();
        const now = Date.now();
        return authCache.lastFetch && (now - authCache.lastFetch) < authCache.ttl;
      },

      // Clear auth cache (for testing)
      clearCache: () => {
        set({
          authCache: {
            userProfile: null,
            userPermissions: null,
            lastFetch: null,
            ttl: 5 * 60 * 1000,
          }
        });
      },
    }),
    {
      name: 'unified-auth-storage',
      partialize: (state) => ({
        user: state.user,
        userRole: state.userRole,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
      }),
    }
  )
);

export { useUnifiedAuthStoreImproved, apiClient };
