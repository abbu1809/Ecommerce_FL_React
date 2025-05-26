import { create } from "zustand";
import api from "../../services/api";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_USER_KEY = "admin_user";

export const useAdminAuthStore = create((set) => {
  return {
    admin: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
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
        const response = await api.post("/admin/login", {
          username: credentials.username,
          password: credentials.password,
        });

        const data = response.data;

        // Store token in localStorage if received
        if (data.token) {
          localStorage.setItem(ADMIN_TOKEN_KEY, data.token);

          // Store admin data in localStorage
          const adminData = {
            id: data.admin_id,
            username: credentials.username,
          };
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(adminData));
        }

        // Update store with admin data
        set({
          admin: {
            id: data.admin_id,
            username: credentials.username,
          },
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
        const response = await api.post("/admin/signup", {
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
    },

    // Admin logout function
    adminLogout: () => {
      // Clear token and admin data from localStorage
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);

      // Reset store state
      set({ admin: null, isAuthenticated: false, error: null });
    }, // Check admin authentication status
    checkAdminAuthStatus: () => {
      try {
        // Check if admin token exists in localStorage
        const token = localStorage.getItem(ADMIN_TOKEN_KEY);

        if (token) {
          // Get admin data from localStorage
          const adminDataStr = localStorage.getItem(ADMIN_USER_KEY);

          if (adminDataStr) {
            const adminData = JSON.parse(adminDataStr);
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
        // Clear auth state on error
        console.error("Auth check error:", error);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_USER_KEY);
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
