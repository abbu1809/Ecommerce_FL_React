import { create } from "zustand";
import api from "../services/api";
import { useUnifiedAuthStoreImproved } from "./unifiedAuthStoreImproved";
import toast from "react-hot-toast";

const useAddressStore = create((set, get) => ({
  // State
  addresses: [],
  isLoading: false,
  error: null,
  // Fetch all addresses for the current user
  fetchAddresses: async () => {
    const { isAuthenticated } = useUnifiedAuthStoreImproved.getState();

    if (!isAuthenticated) {
      set({ addresses: [], error: "User not authenticated" });
      return [];
    }

    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/users/addresses/");
      const addresses = response.data.addresses || [];

      // Transform API data to UI format
      const transformedAddresses = addresses.map((addr) => ({
        id: addr.id,
        name: addr.type,
        address: addr.street_address,
        city: addr.city,
        state: addr.state,
        pincode: addr.postal_code,
        phone: addr.phone_number,
        isDefault: addr.is_default,
        // Keep original fields for API operations
        type: addr.type,
        street_address: addr.street_address,
        postal_code: addr.postal_code,
        phone_number: addr.phone_number,
        is_default: addr.is_default,
        created_at: addr.created_at,
        updated_at: addr.updated_at,
      }));

      set({
        addresses: transformedAddresses,
        isLoading: false,
      });

      return transformedAddresses;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to fetch addresses",
      });
      return [];
    }
  },
  // Add a new address
  addAddress: async (addressData) => {
    const { isAuthenticated } = useUnifiedAuthStoreImproved.getState();

    if (!isAuthenticated) {
      toast.error("Please login to add an address");
      return null;
    }

    try {
      set({ isLoading: true, error: null });

      // Transform the address data to match API format
      const apiData = {
        type: addressData.type || addressData.name,
        street_address: addressData.street_address || addressData.address,
        city: addressData.city,
        state: addressData.state,
        postal_code: addressData.postal_code || addressData.pincode,
        phone_number: addressData.phone_number || addressData.phone,
        is_default: addressData.is_default || addressData.isDefault || false,
      };
      const response = await api.post("/users/addresses/add/", apiData);
      const newAddress = response.data.address;

      // Transform response data to match UI format
      const uiAddress = {
        id: response.data.address_id,
        name: newAddress.type,
        address: newAddress.street_address,
        city: newAddress.city,
        state: newAddress.state,
        pincode: newAddress.postal_code,
        phone: newAddress.phone_number,
        isDefault: newAddress.is_default,
        ...newAddress,
      };

      set((state) => ({
        addresses: [...state.addresses, uiAddress],
        isLoading: false,
      }));

      toast.success("Address added successfully");
      return uiAddress;
    } catch (error) {
      console.error("Error adding address:", error);
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to add address",
      });
      toast.error(error.response?.data?.error || "Failed to add address");
      return null;
    }
  },
  // Update an existing address
  updateAddress: async (id, addressData) => {
    const { isAuthenticated } = useUnifiedAuthStoreImproved.getState();

    if (!isAuthenticated) {
      toast.error("Please login to update an address");
      return false;
    }

    try {
      set({ isLoading: true, error: null });

      // Transform the address data to match API format
      const apiData = {
        type: addressData.type || addressData.name,
        street_address: addressData.street_address || addressData.address,
        city: addressData.city,
        state: addressData.state,
        postal_code: addressData.postal_code || addressData.pincode,
        phone_number: addressData.phone_number || addressData.phone,
        is_default: addressData.is_default || addressData.isDefault || false,
      };
      const response = await api.put(`/users/addresses/update/${id}/`, apiData);
      const updatedAddress = response.data.address;

      // Transform response data to match UI format
      const uiAddress = {
        id: updatedAddress.id || id,
        name: updatedAddress.type,
        address: updatedAddress.street_address,
        city: updatedAddress.city,
        state: updatedAddress.state,
        pincode: updatedAddress.postal_code,
        phone: updatedAddress.phone_number,
        isDefault: updatedAddress.is_default,
        // Keep original fields for API operations
        type: updatedAddress.type,
        street_address: updatedAddress.street_address,
        postal_code: updatedAddress.postal_code,
        phone_number: updatedAddress.phone_number,
        is_default: updatedAddress.is_default,
        created_at: updatedAddress.created_at,
        updated_at: updatedAddress.updated_at,
      };

      set((state) => ({
        addresses: state.addresses.map((addr) =>
          addr.id === id ? uiAddress : addr
        ),
        isLoading: false,
      }));

      toast.success("Address updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating address:", error);
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to update address",
      });
      toast.error(error.response?.data?.error || "Failed to update address");
      return false;
    }
  },
  // Delete an address
  deleteAddress: async (id) => {
    const { isAuthenticated } = useUnifiedAuthStoreImproved.getState();

    if (!isAuthenticated) {
      toast.error("Please login to delete an address");
      return false;
    }

    try {
      set({ isLoading: true, error: null });

      await api.delete(`/users/addresses/delete/${id}/`);

      set((state) => ({
        addresses: state.addresses.filter((addr) => addr.id !== id),
        isLoading: false,
      }));

      toast.success("Address deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting address:", error);
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to delete address",
      });
      toast.error(error.response?.data?.error || "Failed to delete address");
      return false;
    }
  },
  // Set an address as default
  setDefaultAddress: async (id) => {
    const { isAuthenticated } = useUnifiedAuthStoreImproved.getState();

    if (!isAuthenticated) {
      toast.error("Please login to set default address");
      return false;
    }

    try {
      set({ isLoading: true, error: null });

      await api.post(`/users/addresses/set-default/${id}/`);

      set((state) => ({
        addresses: state.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === id,
          is_default: addr.id === id,
        })),
        isLoading: false,
      }));

      toast.success("Default address updated");
      return true;
    } catch (error) {
      console.error("Error setting default address:", error);
      set({
        isLoading: false,
        error: error.response?.data?.error || "Failed to set default address",
      });
      toast.error(
        error.response?.data?.error || "Failed to set default address"
      );
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
