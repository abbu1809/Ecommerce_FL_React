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
        set({
          error:
            error.response?.data?.error ||
            "Login failed. Please check your credentials.",
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
        set({
          error:
            error.response?.data?.error ||
            "Registration failed. Please try again.",
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
  };
});
