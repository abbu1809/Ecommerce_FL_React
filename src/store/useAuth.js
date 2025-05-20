import { create } from "zustand";
import api from "../services/api";
import { TOKEN_KEY, USER_KEY } from "../utils/constants";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth"; // Import signInWithPopup

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false, // Initially set to false until authentication check
  isLoading: false,
  error: null,

  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });

      // Direct API call to login endpoint
      const response = await api.post("/users/login", {
        email: credentials.email,
        password: credentials.password,
      });

      const data = response.data;

      // Store token in localStorage if received
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);

        // Store user data in localStorage
        const userData = {
          uid: data.user_id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }

      // Store user data in the store
      set({
        user: {
          uid: data.user_id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        },
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
      set({ isLoading: true, error: null }); // Direct API call to signup endpoint
      const response = await api.post("/users/signup", {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName || userData.first_name || "",
        last_name: userData.lastName || userData.last_name || "",
        phone_number: userData.phone || userData.phone_number || "",
      });

      const data = response.data;

      // Store token in localStorage if received
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);

        // Store user data in localStorage
        const userData = {
          uid: data.user_id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }

      // Update store with user data
      set({
        user: {
          uid: data.user_id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        },
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
  googleSignup: async (idToken) => {
    try {
      set({ isLoading: true, error: null });

      // Extract user details from the ID token
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google user:", user);
      const { email, displayName } = user;
      let first_name = "";
      let last_name = "";

      if (displayName) {
        const nameParts = displayName.split(" ");
        first_name = nameParts[0] || "";
        last_name = nameParts.slice(1).join(" ") || "";
      }

      // Direct API call to signup endpoint for Google
      const response = await api.post("/users/signup", {
        idToken,
        email,
        first_name,
        last_name,
      });

      const data = response.data;

      // Store user data in localStorage
      const userData = {
        uid: data.user_id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      // Update store with user data
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
          "Google signup failed. Please try again.",
        isLoading: false,
      });
      throw error;
    }
  },
  logout: () => {
    // Clear token and user data from localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Reset store state
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuthStatus: async () => {
    try {
      set({ isLoading: true });

      // Check if token exists in localStorage
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        try {
          // Try to get user data from localStorage first
          const userDataStr = localStorage.getItem(USER_KEY);
          let userData = null;

          if (userDataStr) {
            userData = JSON.parse(userDataStr);
          } else {
            // If user data not in localStorage, fetch from API
            const response = await api.get("/users/profile");
            userData = response.data;

            // Update localStorage with fresh data
            if (userData) {
              localStorage.setItem(USER_KEY, JSON.stringify(userData));
            }
          }

          set({ user: userData, isAuthenticated: true, isLoading: false });
          return userData;
        } catch (err) {
          // If API call fails, clear auth state
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: err.message || "Session expired",
          });
          return null;
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return null;
      }
    } catch (err) {
      // Clear auth state on error
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: err.message || "Session expired",
      });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
