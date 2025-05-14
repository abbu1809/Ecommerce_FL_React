import axios from "axios";
import { API_URL, TOKEN_KEY, USER_KEY } from "../utils/constants";

// Create a custom axios instance for auth-related requests
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercept requests to add auth token if available
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  // Login user with email and password
  login: async (credentials) => {
    const response = await authAxios.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      if (response.data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },

  // Register a new user
  signup: async (userData) => {
    const response = await authAxios.post("/auth/signup", userData);
    if (response.data.token) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
      if (response.data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
      }
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

    // If not available, fetch from API
    const response = await authAxios.get("/user/profile");
    // Update the cache
    if (response.data) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    }
    return response.data;
  },
};
