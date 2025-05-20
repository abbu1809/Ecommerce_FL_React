import { TOKEN_KEY, USER_KEY } from "../utils/constants";
import api from "./api";

export const authService = {
  // Login user with email and password
  login: async (credentials) => {
    const response = await api.post("/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);

      // Store user data if available
      const userData = {
        uid: response.data.uid,
        email: response.data.email,
        display_name: response.data.display_name,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    }
    return response.data;
  },  // Register a new user
  signup: async (userData) => {
    const response = await api.post("/auth/signup", {
      email: userData.email,
      password: userData.password,
      display_name: userData.display_name || userData.name || "",
      phone_number: userData.phone_number || userData.phone || ""
    });
    
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      
      // Store user data
      const userObj = {
        uid: response.data.uid,
        email: response.data.email,
        display_name: response.data.display_name
      };
      localStorage.setItem(USER_KEY, JSON.stringify(userObj));
      
      // Set the token for future API calls
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
  // Get current user data
  getCurrentUser: async () => {
    // Try to get from localStorage first
    const cachedUser = localStorage.getItem(USER_KEY);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    try {
      // If not available, fetch from API
      const response = await api.get("/users/profile");
      // Update the cache
      if (response.data) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },
};
