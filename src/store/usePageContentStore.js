import { create } from "zustand";
import api from "../services/api";

export const usePageContentStore = create((set) => ({
  // State
  content: null,
  loading: false,
  error: null,

  // Fetch page content from the API
  fetchPageContent: async (pagePath) => {
    set({ loading: true, error: null, content: null });
    try {
      // Use the public endpoint to get page content
      const response = await api.get(
        `/content/pages/${pagePath.replace(/^\//, "")}/`
      );

      if (response.status === 200) {
        set({
          content: response.data.content,
          loading: false,
        });
        return response.data.content;
      }
    } catch (error) {
      console.error("Error fetching page content:", error);
      set({
        error: error.response?.data?.error || "Failed to fetch page content",
        loading: false,
      });
    }
  },

  // Clear content when component unmounts
  clearContent: () => {
    set({ content: null, loading: false, error: null });
  },
}));

export default usePageContentStore;
