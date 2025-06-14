import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { deliveryApi } from "../../services/api";
import { DELIVERY_TOKEN_KEY } from "../../utils/constants";

export const useDeliveryPartnerStore = create(
  devtools((set, get) => ({
    // Auth state
    isAuthenticated: !!localStorage.getItem(DELIVERY_TOKEN_KEY),
    partner: JSON.parse(localStorage.getItem("delivery_partner") || "null"),
    loading: false,
    error: null,

    // Dashboard data
    assignedDeliveries: [],
    deliveryHistory: [],

    // Profile data
    partnerProfile: null,

    // Auth actions
    registerPartner: async (partnerData) => {
      set({ loading: true, error: null });
      try {
        const response = await deliveryApi.post(
          "/partners/register/",
          partnerData
        );
        set({
          loading: false,
          error: null,
        });
        return response.data;
      } catch (error) {
        set({
          loading: false,
          error: error.response?.data?.error || "Registration failed",
        });
        throw error;
      }
    },

    loginPartner: async (credentials) => {
      set({ loading: true, error: null });
      try {
        const response = await deliveryApi.post(
          "/partners/login/",
          credentials
        );
        const { token, partner_id } = response.data;

        // Store token in localStorage
        localStorage.setItem(DELIVERY_TOKEN_KEY, token);

        // Get partner details or save basic info
        const partnerData = {
          id: partner_id,
          email: credentials.email,
        };
        localStorage.setItem("delivery_partner", JSON.stringify(partnerData));

        set({
          isAuthenticated: true,
          partner: partnerData,
          loading: false,
          error: null,
        });
        return response.data;
      } catch (error) {
        set({
          loading: false,
          error: error.response?.data?.error || "Login failed",
        });
        throw error;
      }
    },

    // Profile management actions
    fetchPartnerProfile: async () => {
      set({ loading: true, error: null });
      try {
        const response = await deliveryApi.get("/partners/profile/");

        const partnerData = response.data.partner;

        set({
          partnerProfile: partnerData,
          loading: false,
          error: null,
        });

        return partnerData;
      } catch (error) {
        set({
          loading: false,
          error: error.response?.data?.error || "Failed to fetch profile",
        });
        throw error;
      }
    },

    updatePartnerProfile: async (profileData) => {
      set({ loading: true, error: null });
      try {
        const response = await deliveryApi.patch(
          "/partners/profile/update/",
          profileData
        );

        // Refresh profile data after successful update
        await get().fetchPartnerProfile();

        set({
          loading: false,
          error: null,
        });

        return response.data;
      } catch (error) {
        set({
          loading: false,
          error: error.response?.data?.error || "Failed to update profile",
        });
        throw error;
      }
    },

    logoutPartner: () => {
      localStorage.removeItem(DELIVERY_TOKEN_KEY);
      localStorage.removeItem("delivery_partner");
      set({
        isAuthenticated: false,
        partner: null,
        partnerProfile: null,
        assignedDeliveries: [],
        deliveryHistory: [],
      });
    },

    // Delivery management actions
    fetchAssignedDeliveries: async () => {
      set({ loading: true, error: null });
      try {
        const response = await deliveryApi.get(
          "/partners/deliveries/assigned/"
        );

        // Updated to handle assigned_orders instead of assigned_deliveries
        const assignedDeliveries = response.data.assigned_orders || [];

        set({
          assignedDeliveries: assignedDeliveries,
          loading: false,
          error: null,
        });

        return assignedDeliveries;
      } catch (error) {
        set({
          loading: false,
          error:
            error.response?.data?.error ||
            "Failed to fetch assigned deliveries",
        });
        throw error;
      }
    },

    fetchDeliveryHistory: async () => {
      set({ loading: true, error: null });
      try {
        const response = await deliveryApi.get("/partners/deliveries/history/");
        set({
          deliveryHistory: response.data.delivery_history,
          loading: false,
          error: null,
        });
        return response.data.delivery_history;
      } catch (error) {
        set({
          loading: false,
          error:
            error.response?.data?.error || "Failed to fetch delivery history",
        });
        throw error;
      }
    },
    updateDeliveryStatus: async (orderId, status, additionalData = {}) => {
      set({ loading: true, error: null });
      try {
        // Combine status with additional data like notes, estimated_delivery, etc.
        const updateData = {
          status,
          ...additionalData,
        };

        const response = await deliveryApi.patch(
          `/partners/deliveries/update_status/${orderId}/`,
          updateData
        );

        // Update the local state by fetching fresh data
        await useDeliveryPartnerStore.getState().fetchAssignedDeliveries();

        set({ loading: false, error: null });
        return response.data;
      } catch (error) {
        set({
          loading: false,
          error:
            error.response?.data?.error || "Failed to update delivery status",
        });
        throw error;
      }
    },
  }))
);

export { deliveryApi };
export default useDeliveryPartnerStore;
