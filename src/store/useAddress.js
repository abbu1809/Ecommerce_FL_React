import { create } from "zustand";
import api from "../services/api";
import { useAuthStore } from "./useAuth";
import { showToast } from "../utils/toast";

const useAddressStore = create((set, get) => ({
  // State
  addresses: [],
  isLoading: false,
  error: null,

  // Fetch all addresses for the current user
  fetchAddresses: async () => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      set({ addresses: [], error: "User not authenticated" });
      return [];
    }

    try {
      set({ isLoading: true, error: null });

      const response = await api.get("/users/addresses/");
      const addresses = response.data.addresses || [];

      set({
        addresses,
        isLoading: false,
      });

      return addresses;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to fetch addresses",
      });
      return [];
    }
  },

  // Add a new address
  addAddress: async (addressData) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      showToast.error("Please login to add an address");
      return null;
    }

    try {
      set({ isLoading: true, error: null });

      const response = await api.post("/users/addresses/add/", addressData);
      const newAddress = response.data.address;

      set((state) => ({
        addresses: [...state.addresses, newAddress],
        isLoading: false,
      }));

      showToast.success("Address added successfully");

      // If this is the first address or it's marked as default, update other addresses
      if (addressData.isDefault || get().addresses.length === 0) {
        get().setDefaultAddress(newAddress.id);
      }

      return newAddress;
    } catch (error) {
      console.error("Error adding address:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to add address",
      });
      showToast.error("Failed to add address");
      return null;
    }
  },

  // Update an existing address
  updateAddress: async (id, addressData) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      showToast.error("Please login to update an address");
      return false;
    }

    try {
      set({ isLoading: true, error: null });

      await api.put(`/users/addresses/${id}/`, addressData);

      set((state) => ({
        addresses: state.addresses.map((addr) =>
          addr.id === id ? { ...addr, ...addressData } : addr
        ),
        isLoading: false,
      }));

      showToast.success("Address updated successfully");

      // If this address is marked as default, update other addresses
      if (addressData.isDefault) {
        get().setDefaultAddress(id);
      }

      return true;
    } catch (error) {
      console.error("Error updating address:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to update address",
      });
      showToast.error("Failed to update address");
      return false;
    }
  },

  // Delete an address
  deleteAddress: async (id) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      showToast.error("Please login to delete an address");
      return false;
    }

    try {
      set({ isLoading: true, error: null });

      await api.delete(`/users/addresses/${id}/`);

      set((state) => ({
        addresses: state.addresses.filter((addr) => addr.id !== id),
        isLoading: false,
      }));

      showToast.success("Address deleted successfully");

      // If we deleted a default address and there are other addresses,
      // make another one default
      const { addresses } = get();
      if (addresses.length > 0) {
        const wasDefault = addresses.find((addr) => addr.id === id)?.isDefault;
        if (wasDefault) {
          get().setDefaultAddress(addresses[0].id);
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting address:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to delete address",
      });
      showToast.error("Failed to delete address");
      return false;
    }
  },

  // Set an address as default
  setDefaultAddress: async (id) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      showToast.error("Please login to set default address");
      return false;
    }

    try {
      set({ isLoading: true, error: null });

      await api.post(`/users/addresses/${id}/default/`);

      set((state) => ({
        addresses: state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
        })),
        isLoading: false,
      }));

      showToast.success("Default address updated");
      return true;
    } catch (error) {
      console.error("Error setting default address:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to set default address",
      });
      showToast.error("Failed to set default address");
      return false;
    }
  },

  // Get a single address by ID
  getAddressById: (id) => {
    return get().addresses.find((address) => address.id === id) || null;
  },

  // Get the default address
  getDefaultAddress: () => {
    return (
      get().addresses.find((address) => address.isDefault) ||
      (get().addresses.length > 0 ? get().addresses[0] : null)
    );
  },

  // Clear any error
  clearError: () => set({ error: null }),
}));

export default useAddressStore;
