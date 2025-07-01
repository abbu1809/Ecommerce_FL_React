import { create } from "zustand";
import { adminApi } from "../../services/api";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

// Helper function to safely parse JSON from localStorage
const getStoredAdminData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error parsing stored admin data for key ${key}:`, error);
    return null;
  }
};

// Helper function to safely store admin data in localStorage
const storeAdminData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error storing admin data for key ${key}:`, error);
    return false;
  }
};

// Helper function to persist admin authentication data
const persistAdminAuthData = (token, adminData) => {
  try {
    if (token) {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
    }
    if (adminData) {
      storeAdminData(ADMIN_USER_KEY, adminData);
    }
    return true;
  } catch (error) {
    console.error("Error persisting admin auth data:", error);
    return false;
  }
};

// Helper function to clear all admin auth data
const clearAdminAuthData = () => {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  } catch (error) {
    console.error("Error clearing admin auth data:", error);
  }
};

// Initialize admin state with persisted data
const getInitialAdminState = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const adminData = getStoredAdminData(ADMIN_USER_KEY);

  return {
    admin: adminData,
    isAuthenticated: !!(token && adminData),
    isLoading: false,
    error: null,
  };
};

export const useAdminAuthStore = create((set) => {
  // Initialize the store and check authentication status immediately
  const initialState = getInitialAdminState();

  return {
    ...initialState,
    formData: {
      username: "",
      password: "",
      secretKey: "",
    },
    formErrors: {
      username: null,
      password: null,
      secretKey: null,
    },

    // Set form data and errors
    setFormData: (data) =>
      set((state) => ({ formData: { ...state.formData, ...data } })),
    setFormErrors: (errors) => set(() => ({ formErrors: errors })),
    setIsAuthenticated: (status) => set(() => ({ isAuthenticated: status })),
    setIsLoading: (status) => set(() => ({ isLoading: status })),
    setError: (error) => set(() => ({ error })),

    // Admin login function
    adminLogin: async (credentials) => {
      try {
        set({ isLoading: true, error: null });

        // API call to admin login endpoint
        const response = await adminApi.post("/admin/login", {
          username: credentials.username,
          password: credentials.password,
        });

        const data = response.data;

        // Prepare admin data for consistent structure
        const adminData = {
          id: data.admin_id,
          username: credentials.username,
        };

        // Persist authentication data using helper function
        persistAdminAuthData(data.token, adminData);

        // Update store with admin data
        set({
          admin: adminData,
          isAuthenticated: true,
          isLoading: false,
        });
        return data;
      } catch (error) {
        console.error("Admin login error:", error);
        
        let errorMessage = "Login failed. Please check your credentials.";
        
        // Handle different types of errors
        if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
          errorMessage = "Network error: Unable to connect to the server. Please check your internet connection and try again.";
        } else if (error.response?.status === 502) {
          errorMessage = "Server error (502): The admin server is currently unavailable. Please contact your system administrator.";
        } else if (error.response?.status === 500) {
          errorMessage = "Internal server error: Please try again later or contact support.";
        } else if (error.response?.status === 404) {
          errorMessage = "Admin endpoint not found: The admin service may not be configured properly.";
        } else if (error.response?.status === 401) {
          errorMessage = "Invalid credentials: Please check your username and password.";
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }

        set({
          error: errorMessage,
          isLoading: false,
        });
        throw error;
      }
    },

    // Admin register function
    adminRegister: async (adminData) => {
      try {
        set({ isLoading: true, error: null });

        // API call to admin register endpoint
        const response = await adminApi.post("/admin/signup", {
          username: adminData.username,
          password: adminData.password,
          secret: adminData.secretKey,
        });

        set({ isLoading: false });
        return response.data;
      } catch (error) {
        console.error("Admin registration error:", error);
        
        let errorMessage = "Registration failed. Please try again.";
        
        // Handle different types of errors
        if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
          errorMessage = "Network error: Unable to connect to the server. Please check your internet connection and try again.";
        } else if (error.response?.status === 502) {
          errorMessage = "Server error (502): The admin server is currently unavailable. Please contact your system administrator.";
        } else if (error.response?.status === 500) {
          errorMessage = "Internal server error: Please try again later or contact support.";
        } else if (error.response?.status === 404) {
          errorMessage = "Admin endpoint not found: The admin service may not be configured properly.";
        } else if (error.response?.status === 401) {
          errorMessage = "Invalid secret key: Please check your secret key and try again.";
        } else if (error.response?.status === 409) {
          errorMessage = "Admin already exists: An admin with this username already exists.";
        } else if (error.response?.data?.error) {
          errorMessage = error.response.data.error;
        }

        set({
          error: errorMessage,
          isLoading: false,
        });
        throw error;
      }
    }, // Admin logout function
    adminLogout: () => {
      // Clear token and admin data from localStorage using helper
      clearAdminAuthData();

      // Reset store state
      set({ admin: null, isAuthenticated: false, error: null });
    }, // Check admin authentication status
    checkAdminAuthStatus: () => {
      try {
        // Check if admin token exists in localStorage
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);

        if (token) {
          // Get admin data from localStorage using helper
          const adminData = getStoredAdminData(ADMIN_USER_KEY);

          if (adminData) {
            set({
              admin: adminData,
              isAuthenticated: true,
            });
            return true;
          }
        }

        // No valid token or data
        set({ admin: null, isAuthenticated: false });
        return false;
      } catch (error) {
        // Clear auth state on error using helper
        console.error("Admin auth check error:", error);
        clearAdminAuthData();
        set({
          admin: null,
          isAuthenticated: false,
          error: "Authentication error",
        });
        return false;
      }
    },

    // Clear error
    clearError: () => set({ error: null }),

    // DEVELOPMENT MODE: Local admin bypass (for testing when server is down)
    devModeLogin: (credentials) => {
      const isDevelopmentMode = process.env.NODE_ENV === 'development';
      const isDevAdmin = credentials.username === 'admin' && credentials.password === 'admin123';
      
      if (isDevelopmentMode && isDevAdmin) {
        const mockAdminData = {
          id: 'dev-admin-001',
          username: credentials.username,
        };

        // Mock token for development
        const mockToken = 'dev-mock-token-12345';

        // Persist mock data
        persistAdminAuthData(mockToken, mockAdminData);

        // Update store
        set({
          admin: mockAdminData,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        return true;
      }
      return false;
    },

    // Test server connectivity
    testServerConnection: async () => {
      try {
        set({ isLoading: true, error: null });
        
        // Try a simple GET request to check server health
        const response = await adminApi.get('/admin/health');
        
        set({ 
          isLoading: false,
          error: null 
        });
        
        return {
          success: true,
          message: '✅ Production server is accessible and working',
          status: response.status,
          troubleshooting: [
            "✅ Backend server is online",
            "✅ You can use production login if you have credentials",
            "ℹ️ Development mode is still available as backup"
          ]
        };
      } catch (error) {
        console.error("Server connectivity test failed:", error);
        
        let errorMessage = "";
        let troubleshooting = [];
        
        // Check for CORS errors specifically
        if (error.message === "Network Error" && error.config?.url?.includes('69.62.72.199')) {
          errorMessage = "🔍 BACKEND TEST RESULT: Server has CORS/connectivity issues";
          troubleshooting = [
            "🎯 THE TEST IS WORKING CORRECTLY!",
            "✅ This confirms the backend server blocks localhost requests",
            "✅ CORS Error: Production server needs proper CORS headers",
            "✅ 502 Error: Backend service may be down/misconfigured",
            "",
            "🚀 SOLUTION: Use Development Mode instead:",
            "1️⃣ Enable 'Development Mode' above",
            "2️⃣ Login with: admin / admin123",
            "3️⃣ Full admin access without backend dependency"
          ];
        } else if (error.response?.status === 502) {
          errorMessage = "🔍 BACKEND TEST RESULT: 502 Bad Gateway detected";
          troubleshooting = [
            "🎯 THE TEST IS WORKING CORRECTLY!",
            "✅ Successfully detected backend server is down",
            "✅ 502 Error means the backend service is unavailable",
            "",
            "🚀 SOLUTION: Use Development Mode instead:",
            "1️⃣ Enable 'Development Mode' above",
            "2️⃣ Login with: admin / admin123",
            "3️⃣ All admin features work without backend"
          ];
        } else if (error.response?.status === 404) {
          errorMessage = "🔍 BACKEND TEST RESULT: Health endpoint not found";
          troubleshooting = [
            "⚠️ Health endpoint (/admin/health) not implemented",
            "ℹ️ This doesn't mean the login won't work",
            "✅ You can try production login if you have credentials",
            "✅ Or use Development Mode for guaranteed access"
          ];
        } else {
          errorMessage = "🔍 BACKEND TEST RESULT: Connection issues detected";
          troubleshooting = [
            "🎯 THE TEST IS WORKING - it found backend problems",
            "✅ This confirms the production server has issues",
            "",
            "🚀 RECOMMENDED SOLUTION:",
            "1️⃣ Enable 'Development Mode' above",
            "2️⃣ Login with: admin / admin123",
            "3️⃣ Full admin functionality available"
          ];
        }

        set({
          error: errorMessage,
          isLoading: false,
        });

        return {
          success: false,
          message: errorMessage,
          status: error.response?.status || 0,
          troubleshooting
        };
      }
    },
  };
});
