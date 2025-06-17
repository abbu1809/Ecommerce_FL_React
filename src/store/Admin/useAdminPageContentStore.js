import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { adminApi } from "../../services/api";

export const useAdminPageContentStore = create(
  devtools((set) => ({
    // State
    pages: [
      { path: "terms-conditions", title: "Terms & Conditions" },
      { path: "privacy-policy", title: "Privacy Policy" },
      {
        path: "cancellation-refund-policy",
        title: "Cancellation & Refund Policy",
      },
      { path: "shipping-policy", title: "Shipping Policy" },
      { path: "about-us", title: "About Us" },
      { path: "contact-us", title: "Contact Us" },
      { path: "faq", title: "FAQ" },
      { path: "careers", title: "Careers" },
    ],
    content: null,
    loading: false,
    error: null,
    savingPage: false,

    // Actions
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSavingPage: (savingPage) => set({ savingPage }),
    setContent: (content) => set({ content }),

    // Clear state when component unmounts
    clearContent: () => set({ content: null, loading: false, error: null }),

    // Clear error
    clearError: () => set({ error: null }),

    // Fetch page content (admin version)
    fetchPageContent: async (pagePath) => {
      if (!pagePath) return;

      set({ loading: true, error: null });
      try {
        const response = await adminApi.get(`/admin/page-content/${pagePath}/`);
        if (response.status === 200) {
          set({
            content: response.data.content || "",
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
        throw error;
      }
    },

    // Update page content (admin only)
    updatePageContent: async (pagePath, content) => {
      if (!pagePath) return;

      set({ savingPage: true, error: null });
      try {
        const response = await adminApi.put(
          `/admin/page-content/update/${pagePath}/`,
          { content }
        );

        if (response.status === 200) {
          set({
            content,
            savingPage: false,
          });
          return true;
        }
      } catch (error) {
        console.error("Error updating page content:", error);
        set({
          error: error.response?.data?.error || "Failed to update page content",
          savingPage: false,
        });
        throw error;
      }
    },

    // Add a custom page
    addCustomPage: async (title, pagePath) => {
      // Normalize the path - lowercase, replace spaces with hyphens, remove special chars
      const normalizedPath = pagePath
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

      set((state) => {
        // Check if page with this path already exists
        const pageExists = state.pages.some(
          (page) => page.path === normalizedPath
        );
        if (pageExists) {
          throw new Error("A page with this path already exists");
        }

        // Add new page to the list
        return {
          pages: [
            ...state.pages,
            { path: normalizedPath, title, isCustom: true },
          ],
        };
      });

      // Create the page with empty content
      try {
        await adminApi.put(`/admin/page-content/update/${normalizedPath}/`, {
          content: "",
        });
        return normalizedPath;
      } catch (error) {
        console.error("Error creating custom page:", error);

        // Remove page from list if API call failed
        set((state) => ({
          pages: state.pages.filter((page) => page.path !== normalizedPath),
          error: error.response?.data?.error || "Failed to create custom page",
        }));

        throw error;
      }
    },

    // Delete a custom page
    deleteCustomPage: async (pagePath) => {
      // First, check if it's a custom page
      set((state) => {
        const pageToDelete = state.pages.find((page) => page.path === pagePath);
        if (!pageToDelete || !pageToDelete.isCustom) {
          throw new Error("Only custom pages can be deleted");
        }
        return state;
      });

      try {
        // Delete page content from backend
        await adminApi.delete(`/admin/page-content/${pagePath}/`);

        // Remove page from list
        set((state) => ({
          pages: state.pages.filter((page) => page.path !== pagePath),
        }));

        return true;
      } catch (error) {
        console.error("Error deleting custom page:", error);
        set({
          error: error.response?.data?.error || "Failed to delete custom page",
        });
        throw error;
      }
    },
  }))
);

export default useAdminPageContentStore;
