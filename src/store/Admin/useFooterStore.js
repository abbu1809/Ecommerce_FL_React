import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { adminApi } from "../../services/api";

export const useFooterStore = create(
  devtools((set, get) => ({
    // State
    footerConfig: null,
    loading: false,
    error: null,
    pageContentLoading: false,

    // Actions
    setFooterConfig: (config) => set({ footerConfig: config }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    // Clear error
    clearError: () => set({ error: null }),

    // Fetch footer configuration
    fetchFooterConfig: async () => {
      set({ loading: true, error: null });
      try {
        const response = await adminApi.get("/admin/footer/");
        if (response.status === 200) {
          set({
            footerConfig: response.data.footer_config,
            loading: false,
          });
          return response.data.footer_config;
        }
      } catch (error) {
        console.error("Error fetching footer config:", error);
        set({
          error:
            error.response?.data?.error ||
            "Failed to fetch footer configuration",
          loading: false,
        });
        throw error;
      }
    },

    // Update footer configuration
    updateFooterConfig: async (footerConfig) => {
      set({ loading: true, error: null });
      try {
        const response = await adminApi.put("/admin/footer/update/", {
          footer_config: footerConfig,
        });

        if (response.status === 200) {
          set({
            footerConfig: footerConfig,
            loading: false,
          });
          return true;
        }
      } catch (error) {
        console.error("Error updating footer config:", error);
        set({
          error:
            error.response?.data?.error ||
            "Failed to update footer configuration",
          loading: false,
        });
        throw error;
      }
    },

    // Add footer link
    addFooterLink: async (section, link) => {
      set({ loading: true, error: null });
      try {
        const currentFooterConfig = get().footerConfig;
        const updatedFooterConfig = { ...currentFooterConfig };

        if (!Array.isArray(updatedFooterConfig[section])) {
          updatedFooterConfig[section] = [];
        }

        updatedFooterConfig[section].push(link);

        const response = await adminApi.put("/admin/footer/update/", {
          footer_config: updatedFooterConfig,
        });

        if (response.status === 200) {
          set({
            footerConfig: updatedFooterConfig,
            loading: false,
          });
          return true;
        }
      } catch (error) {
        console.error("Error adding footer link:", error);
        set({
          error: error.response?.data?.error || "Failed to add footer link",
          loading: false,
        });
        throw error;
      }
    },

    // Delete footer link
    deleteFooterLink: async (section, linkIndex) => {
      set({ loading: true, error: null });
      try {
        const currentFooterConfig = get().footerConfig;
        const updatedFooterConfig = { ...currentFooterConfig };

        if (Array.isArray(updatedFooterConfig[section])) {
          updatedFooterConfig[section].splice(linkIndex, 1);
        }

        const response = await adminApi.put("/admin/footer/update/", {
          footer_config: updatedFooterConfig,
        });

        if (response.status === 200) {
          set({
            footerConfig: updatedFooterConfig,
            loading: false,
          });
          return true;
        }
      } catch (error) {
        console.error("Error deleting footer link:", error);
        set({
          error: error.response?.data?.error || "Failed to delete footer link",
          loading: false,
        });
        throw error;
      }
    },

    // Toggle footer section
    toggleFooterSection: async (section, enabled) => {
      set({ loading: true, error: null });
      try {
        const currentFooterConfig = get().footerConfig;
        const updatedFooterConfig = { ...currentFooterConfig };

        if (!updatedFooterConfig[section]) {
          updatedFooterConfig[section] = { enabled };
        } else if (
          typeof updatedFooterConfig[section] === "object" &&
          !Array.isArray(updatedFooterConfig[section])
        ) {
          updatedFooterConfig[section] = {
            ...updatedFooterConfig[section],
            enabled,
          };
        } else {
          updatedFooterConfig[section] = {
            enabled,
            ...updatedFooterConfig[section],
          };
        }

        const response = await adminApi.put("/admin/footer/update/", {
          footer_config: updatedFooterConfig,
        });

        if (response.status === 200) {
          set({
            footerConfig: updatedFooterConfig,
            loading: false,
          });
          return true;
        }
      } catch (error) {
        console.error("Error toggling footer section:", error);
        set({
          error:
            error.response?.data?.error || "Failed to toggle footer section",
          loading: false,
        });
        throw error;
      }
    },
    // Fetch page content
    fetchPageContent: async (pagePath) => {
      set({ pageContentLoading: true, error: null });
      try {
        const response = await adminApi.get(
          `/admin/page-content/${pagePath.replace(/^\//, "")}/`
        );
        set({ pageContentLoading: false });
        return response.data.content;
      } catch (error) {
        console.error("Error fetching page content:", error);
        set({
          error: error.response?.data?.error || "Failed to fetch page content",
          pageContentLoading: false,
        });
        throw error;
      }
    },

    // Update page content
    updatePageContent: async (pagePath, content) => {
      set({ pageContentLoading: true, error: null });
      try {
        const response = await adminApi.put(
          `/admin/page-content/update/${pagePath.replace(/^\//, "")}/`,
          {
            content,
          }
        );
        set({ pageContentLoading: false });
        return response.data;
      } catch (error) {
        console.error("Error updating page content:", error);
        set({
          error: error.response?.data?.error || "Failed to update page content",
          pageContentLoading: false,
        });
        throw error;
      }
    },
  }))
);

export default useFooterStore;
