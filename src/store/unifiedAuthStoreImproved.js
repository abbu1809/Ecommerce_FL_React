import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_URL } from '../utils/constants';

/**
 * 🔐 Improved Unified Authentication Store
 * Features:
 * - CSRF token handling
 * - API call optimization (singleton pattern)
 * - Firebase API reduction
 * - TanStack Query integration ready
 * - Error handling improvements
 */

const API_BASE_URL = API_URL;

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
      const response = await fetch(`${API_BASE_URL}/api/auth/csrf-token/`, {
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
          const userData = await apiClient.makeRequest('/api/auth/profile/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
            },
          });
          
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
          
          const response = await apiClient.makeRequest('/api/auth/login/', {
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

          // Store token for API calls with proper key
          if (token) {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('anand_mobiles_token', token); // Also store with legacy key for compatibility
            console.log('🔑 Tokens stored successfully:', {
              authToken: `${token.substring(0, 10)}...`,
              legacyToken: `${token.substring(0, 10)}...`
            });
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
          const response = await apiClient.makeRequest('/api/auth/register/', {
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
              localStorage.setItem('anand_mobiles_token', token); // Also store with legacy key for compatibility
              console.log('🔑 Registration tokens stored successfully:', {
                authToken: `${token.substring(0, 10)}...`,
                legacyToken: `${token.substring(0, 10)}...`
              });
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
          // Google OAuth is handled through the unified login endpoint with idToken
          const response = await apiClient.makeRequest('/api/auth/login/', {
            method: 'POST',
            body: JSON.stringify({
              // Google OAuth token would be passed here as idToken
              // idToken: googleIdToken
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
              localStorage.setItem('anand_mobiles_token', token); // Also store with legacy key for compatibility
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
        localStorage.removeItem('anand_mobiles_token'); // Also remove legacy token
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

      // Check authentication status from localStorage on app startup
      checkAuthStatus: () => {
        console.log('🔍 Checking auth status...');
        const token = localStorage.getItem('auth_token');
        const legacyToken = localStorage.getItem('anand_mobiles_token');
        
        console.log('🔑 Token status:', {
          authToken: token ? `${token.substring(0, 10)}...` : 'not found',
          legacyToken: legacyToken ? `${legacyToken.substring(0, 10)}...` : 'not found'
        });
        
        // Use either token if available
        const availableToken = token || legacyToken;
        
        if (availableToken) {
          console.log('✅ Token found, attempting validation...');
          // If we have a token, validate it
          get().validateSession();
        } else {
          console.log('❌ No token found, logging out...');
          // No token found, ensure user is logged out
          get().logout();
        }
      },

      // Session validation (reduce API calls)
      validateSession: async () => {
        const token = localStorage.getItem('auth_token');
        const legacyToken = localStorage.getItem('anand_mobiles_token');
        const availableToken = token || legacyToken;
        
        console.log('🔍 Validating session...', {
          hasAuthToken: !!token,
          hasLegacyToken: !!legacyToken,
          usingToken: availableToken ? `${availableToken.substring(0, 10)}...` : 'none'
        });
        
        if (!availableToken) {
          console.log('❌ No token available, logging out...');
          get().logout();
          return false;
        }

        try {
          // Use the correct unified auth endpoint that exists in the backend
          const response = await apiClient.makeRequest('/api/auth/profile/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${availableToken}`,
            },
          });

          console.log('✅ Session validation response:', response);

          // Check if we got valid user data back
          if (response && (response.email || response.user_id)) {
            // Transform the response to match our user structure
            const userData = {
              uid: response.user_id || response.uid,
              email: response.email,
              first_name: response.first_name,
              last_name: response.last_name,
              phone: response.phone_number || response.phone || "",
              user_type: response.user_type || 'customer'
            };

            // Update store with validated user data
            set({
              user: userData,
              userRole: userData.user_type,
              isAuthenticated: true,
              lastActivity: Date.now(),
            });
            
            // Ensure both tokens are set for compatibility
            if (token && !legacyToken) {
              localStorage.setItem('anand_mobiles_token', token);
            } else if (legacyToken && !token) {
              localStorage.setItem('auth_token', legacyToken);
            }
            
            console.log('✅ Session validated successfully');
            return true;
          } else {
            console.log('❌ Session validation failed, logging out...');
            get().logout();
            return false;
          }
        } catch (error) {
          console.error('❌ Session validation error:', error);
          // Only logout on certain errors to avoid infinite loops
          if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
            get().logout();
          }
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
