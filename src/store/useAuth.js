import { create } from "zustand";
import api from "../services/api";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

// Helper function to safely parse JSON from localStorage
const getStoredData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error parsing stored data for key ${key}:`, error);
    return null;
  }
};

// Helper function to safely store data in localStorage
const storeData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
    return false;
  }
};

// Helper function to persist user authentication data
const persistAuthData = (token, userData) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    if (userData) {
      storeData(USER_KEY, userData);
    }
    return true;
  } catch (error) {
    console.error("Error persisting auth data:", error);
    return false;
  }
};

// Helper function to clear all auth data
const clearAuthData = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Error clearing auth data:", error);
  }
};

// Initialize state with persisted data
const getInitialState = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userData = getStoredData(USER_KEY);

  return {
    user: userData,
    isAuthenticated: !!(token && userData),
    isLoading: false,
    error: null,
  };
};

export const useAuthStore = create((set) => ({
  ...getInitialState(),
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });

      // Direct API call to login endpoint
      const response = await api.post("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      const data = response.data;

      // Prepare user data for consistent structure
      const userData = {
        uid: data.user_id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone_number || data.phone || "",
      };

      // Persist authentication data
      persistAuthData(data.token, userData);

      // Update store state
      set({
        user: userData,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Login failed. Please check your credentials.",
        isLoading: false,
      });
      throw error;
    }
  },
  signup: async (userData) => {
    try {
      set({ isLoading: true, error: null });

      // Handle Google ID token signup
      if (userData.idToken) {
        const response = await api.post("/auth/register", {
          idToken: userData.idToken,
        });

        const data = response.data;

        // Prepare user data for consistent structure
        const userInfo = {
          uid: data.user_id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone_number || "",
        };

        // Persist authentication data
        persistAuthData(data.token, userInfo);

        // Update store state
        set({
          user: userInfo,
          isAuthenticated: true,
          isLoading: false,
        });

        return data;
      }

      // Regular email/password signup
      const requestData = {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName || userData.first_name || "",
        last_name: userData.lastName || userData.last_name || "",
        phone_number: userData.phone || userData.phone_number || "",
      };

      // Add metadata if provided
      if (userData.metadata) {
        requestData.metadata = userData.metadata;
      }

      // Direct API call to signup endpoint
      const response = await api.post("/auth/register", requestData);
      const data = response.data;

      // Prepare user data for consistent structure
      const userInfo = {
        uid: data.user_id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone_number || requestData.phone_number || "",
      };

      // Persist authentication data
      persistAuthData(data.token, userInfo);

      // Update store state
      set({
        user: userInfo,
        isAuthenticated: true,
        isLoading: false,
      });

      return data;
    } catch (error) {
      set({
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Signup failed. Please try again.",
        isLoading: false,
      });
      throw error;
    }
  },
  googleSignup: async () => {
    try {
      set({ isLoading: true, error: null });

      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Use the regular signup function with idToken
      return await useAuthStore.getState().signup({ idToken });
    } catch (error) {
      set({
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Google signup failed. Please try again.",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    // Clear all authentication data
    clearAuthData();

    // Reset store state
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
    });
  },
  checkAuthStatus: async () => {
    try {
      set({ isLoading: true });

      // Check if token exists in localStorage
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        try {
          // Try to get user data from localStorage first
          let userData = getStoredData(USER_KEY);

          if (!userData) {
            // If user data not in localStorage, fetch from API
            const response = await api.get("/users/profile/");
            userData = {
              uid: response.data.user_id || response.data.uid,
              email: response.data.email,
              first_name: response.data.first_name,
              last_name: response.data.last_name,
              phone: response.data.phone_number || response.data.phone || "",
            };

            // Update localStorage with fresh data
            storeData(USER_KEY, userData);
          }

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
          return userData;
        } catch (err) {
          // If API call fails, clear auth state
          clearAuthData();

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: err.message || "Session expired",
          });
          return null;
        }
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return null;
      }
    } catch (err) {
      // Clear auth state on error
      clearAuthData();

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: err.message || "Session expired",
      });
      return null;
    }
  },

  // Update user profile data
  updateUserProfile: (updatedData) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updatedData };

    // Persist updated user data
    storeData(USER_KEY, updatedUser);

    // Update store state
    set({ user: updatedUser });
  },

  // Fetch user profile from API
  fetchUserProfile: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get("/users/profile/");
      const profileData = response.data;

      const userData = {
        uid: profileData.user_id || profileData.uid,
        email: profileData.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        phone: profileData.phone_number || profileData.phone || "",
        auth_provider: profileData.auth_provider,
      };

      // Update localStorage with fresh data
      storeData(USER_KEY, userData);

      set({
        user: userData,
        isLoading: false,
      });

      return userData;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch profile",
        isLoading: false,
      });
      throw error;
    }
  },

  // Update user profile via API
  updateUserProfileAPI: async (profileData) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post("/users/profile/update/", profileData);
      const updatedProfile = response.data.user;

      const userData = {
        uid: updatedProfile.user_id || useAuthStore.getState().user?.uid,
        email: updatedProfile.email,
        first_name: updatedProfile.first_name,
        last_name: updatedProfile.last_name,
        phone: updatedProfile.phone_number || updatedProfile.phone || "",
        auth_provider: useAuthStore.getState().user?.auth_provider,
      };

      // Update localStorage with fresh data
      storeData(USER_KEY, userData);

      set({
        user: userData,
        isLoading: false,
      });

      return {
        success: true,
        message: response.data.message,
        user: userData,
      };
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to update profile",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get current authentication token
  getToken: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
