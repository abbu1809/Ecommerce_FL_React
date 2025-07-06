import axios from "axios";
import { API_URL, DELIVERY_TOKEN_KEY } from "../utils/constants";

// Create a delivery API instance with base configuration
const deliveryApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token in all requests
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

// Add a response interceptor to handle common response issues
deliveryApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear delivery auth state
      localStorage.removeItem(DELIVERY_TOKEN_KEY);
    }
    return Promise.reject(error);
  }
);

// Delivery partner API functions
const deliveryService = {
  // Auth endpoints
  register: (userData) => {
    return deliveryApi.post("/partners/register/", userData);
  },

  login: (credentials) => {
    return deliveryApi.post("/partners/login/", credentials);
  },

  // Delivery management endpoints
  getAssignedDeliveries: () => {
    return deliveryApi.get("/partners/deliveries/assigned/");
  },

  updateDeliveryStatus: (orderId, status) => {
    return deliveryApi.patch(`/partners/deliveries/update_status/${orderId}/`, {
      status,
    });
  },

  getDeliveryHistory: () => {
    return deliveryApi.get("/partners/deliveries/history/");
  },
  // Admin endpoints for managing delivery partners
  getAllPartners: () => {
    return deliveryApi.get("/admin/delivery_partners/");
  },

  verifyPartner: (partnerId) => {
    return deliveryApi.patch(`/partners/verify/${partnerId}/`);
  },

  assignDeliveryPartner: (orderId, partnerId) => {
    return deliveryApi.post("/admin/assign_delivery_partner/", {
      order_id: orderId,
      partner_id: partnerId,
    });
  },

  // Partner authentication
  partnerRegister: (partnerData) => {
    return deliveryApi.post("/partners/register/", partnerData);
  },

  partnerLogin: (credentials) => {
    return deliveryApi.post("/partners/login/", credentials);
  },
};

export { deliveryApi };
export default deliveryService;
