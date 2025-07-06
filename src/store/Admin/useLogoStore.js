import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { adminApi } from "../../services/api";

export const useLogoStore = create(
  devtools((set, get) => ({
    // State
    logo: null,
    loading: false,
    error: null,

    // Actions
    setLogo: (logo) => set({ logo }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    // Fetch logo
    fetchLogo: async () => {
      const currentState = get();
      // Prevent duplicate fetches
      if (currentState.loading || currentState.logo) {
        return currentState.logo;
      }
      
      set({ loading: true, error: null });
      try {
        const response = await adminApi.get("/admin/content/logo");
        if (response.status === 200) {
          set({ logo: response.data.logo_url, loading: false });
          return response.data.logo_url;
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
        set({
          error: error.response?.data?.error || "Failed to fetch logo",
          loading: false,
        });
        throw error;
      }
    },

    // Upload new logo
    uploadLogo: async (formData) => {
      set({ loading: true, error: null });
      try {
        const response = await adminApi.post(
          "/admin/content/logo/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          set({ logo: response.data.logo_url, loading: false });
          return response.data;
        }
      } catch (error) {
        console.error("Error uploading logo:", error);
        set({
          error: error.response?.data?.error || "Failed to upload logo",
          loading: false,
        });
        throw error;
      }
    },

    // Delete logo
    deleteLogo: async () => {
      set({ loading: true, error: null });
      try {
        const response = await adminApi.delete("/admin/content/logo");

        if (response.status === 200) {
          set({ logo: null, loading: false });
          return response.data;
        }
      } catch (error) {
        console.error("Error deleting logo:", error);
        set({
          error: error.response?.data?.error || "Failed to delete logo",
          loading: false,
        });
        throw error;
      }
    },

    // Clear error
    clearError: () => set({ error: null }),
  }))
);

export default useLogoStore;
