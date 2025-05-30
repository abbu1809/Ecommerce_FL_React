import axios from "axios";
import {
  API_URL,
  TOKEN_KEY,
  USER_KEY,
  DELIVERY_TOKEN_KEY,
} from "../utils/constants";

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_URL, // Use API_URL from constants
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common response issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could clear auth state and redirect to login
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    return Promise.reject(error);
  }
);

// Create an admin API instance with separate token handling
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for admin API to include the admin token
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem("admin_token");
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for admin API to handle unauthorized responses
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear admin auth state
      localStorage.removeItem("admin_token");
    }
    return Promise.reject(error);
  }
);

// Create a delivery partner API instance
const deliveryApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the delivery partner token in requests
deliveryApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(DELIVERY_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle unauthorized access
deliveryApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear delivery partner auth state
      localStorage.removeItem(DELIVERY_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

export default api;
export { adminApi, deliveryApi };
