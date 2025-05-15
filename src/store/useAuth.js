import { create } from "zustand";
import { authService } from "../services/authService";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: true,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      const data = await authService.login(credentials);
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
    } catch (error) {
      set({
        error:
          error.response?.data?.message ||
          "Login failed. Please check your credentials.",
        isLoading: false,
      });
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const data = await authService.signup(userData);
      set({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Signup failed. Please try again.",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuthStatus: async () => {
    try {
      set({ isLoading: true });
      if (authService.isAuthenticated()) {
        const userData = await authService.getCurrentUser();
        set({ user: userData, isAuthenticated: true, isLoading: false });
        return userData;
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return null;
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired",
      });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
