import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { deliveryApi } from "../../services/deliveryApi";

// Delivery store for admin management of delivery partners
export const useDeliveryStore = create(
  devtools((set) => ({
    // Partners data
    partners: {
      list: [],
      loading: false,
      error: null,
    }, // Register a new delivery partner
    registerPartner: async (partnerData) => {
      set((state) => ({
        partners: { ...state.partners, loading: true, error: null },
      }));

      try {
        // Use the deliveryService.partnerRegister method from deliveryApi.js
        const response = await deliveryApi.post(
          "/delivery/register/",
          partnerData
        );

        set((state) => ({
          partners: {
            ...state.partners,
            loading: false,
          },
        }));

        return response.data;
      } catch (error) {
        set((state) => ({
          partners: {
            ...state.partners,
            loading: false,
            error: error.response?.data?.error || "Failed to register partner",
          },
        }));
        throw error;
      }
    },

    // Fetch all delivery partners (admin only)
    fetchPartners: async () => {
      set((state) => ({
        partners: { ...state.partners, loading: true, error: null },
      }));

      try {
        const response = await deliveryApi.get("/admin/delivery_partners/");

        set({
          partners: {
            list: response.data.partners,
            loading: false,
            error: null,
          },
        });

        return response.data.partners;
      } catch (error) {
        set((state) => ({
          partners: {
            ...state.partners,
            loading: false,
            error: error.response?.data?.error || "Failed to fetch partners",
          },
        }));
        throw error;
      }
    },
    // Verify a delivery partner (admin only)
    verifyPartner: async (partnerId) => {
      set((state) => ({
        partners: { ...state.partners, loading: true, error: null },
      }));

      try {
        // Use the API endpoint for verifying a partner
        const response = await deliveryApi.patch(
          `/delivery/verify/${partnerId}/`
        ); // Update the partner in the list
        set((state) => {
          const updatedList = state.partners.list.map((partner) =>
            partner.partner_id === partnerId
              ? { ...partner, is_verified: true }
              : partner
          );

          return {
            partners: {
              ...state.partners,
              list: updatedList,
              loading: false,
              error: null,
            },
          };
        });

        return response.data;
      } catch (error) {
        set((state) => ({
          partners: {
            ...state.partners,
            loading: false,
            error: error.response?.data?.error || "Failed to verify partner",
          },
        }));
        throw error;
      }
    },

    // Assign a delivery partner to an order (admin only)
    assignDeliveryPartner: async (orderId, partnerId) => {
      set((state) => ({
        partners: { ...state.partners, loading: true, error: null },
      }));

      try {
        const response = await deliveryApi.post(
          "/admin/assign_delivery_partner/",
          {
            order_id: orderId,
            partner_id: partnerId,
          }
        );

        set((state) => ({
          partners: {
            ...state.partners,
            loading: false,
          },
        }));

        return response.data;
      } catch (error) {
        set((state) => ({
          partners: {
            ...state.partners,
            loading: false,
            error:
              error.response?.data?.error ||
              "Failed to assign delivery partner",
          },
        }));
        throw error;
      }
    },
  }))
);

export default useDeliveryStore;
