import { create } from "zustand";
import { adminApi } from "../../services/api";

const useAdminSellPhone = create((set) => ({
  // State for sell phone inquiries
  inquiries: {
    list: [],
    loading: false,
    error: null,
  },

  // State for sell phone catalogs
  catalogs: {
    list: [],
    loading: false,
    error: null,
  },

  // Currently selected inquiry for viewing details
  selectedInquiry: null,

  // Currently selected catalog item
  selectedCatalog: null,

  // Fetch all sell phone inquiries from the API
  fetchInquiries: async () => {
    set((state) => ({
      inquiries: {
        ...state.inquiries,
        loading: true,
        error: null,
      },
    }));
    try {
      const response = await adminApi.get("/sell-mobile/inquiries/");
      const inquiries = response.data.data;

      set({
        inquiries: {
          list: inquiries,
          loading: false,
          error: null,
        },
      });

      return {
        success: true,
        data: inquiries,
      };
    } catch (error) {
      set((state) => ({
        inquiries: {
          ...state.inquiries,
          loading: false,
          error: error.response?.data?.error || "Failed to fetch inquiries",
        },
      }));

      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch inquiries",
      };
    }
  },

  // Set selected inquiry for viewing details
  setSelectedInquiry: (inquiry) => {
    set({ selectedInquiry: inquiry });
  },

  // Clear selected inquiry
  clearSelectedInquiry: () => {
    set({ selectedInquiry: null });
  },

  // Update inquiry status (approve/reject/complete)
  updateInquiryStatus: async (inquiryId, newStatus) => {
    set((state) => ({
      inquiries: {
        ...state.inquiries,
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await adminApi.patch(
        `/sell-mobile/inquiries/${inquiryId}/status/`,
        { status: newStatus }
      );

      if (response.status === 200) {
        set((state) => {
          // Update the inquiry in the list
          const updatedInquiriesList = state.inquiries.list.map((inquiry) => {
            if (inquiry.id === inquiryId) {
              return { ...inquiry, status: newStatus };
            }
            return inquiry;
          });

          return {
            inquiries: {
              ...state.inquiries,
              list: updatedInquiriesList,
              loading: false,
              error: null,
            },
          };
        });

        return {
          success: true,
          message: response.data.message || `Inquiry status updated successfully`,
        };
      }
    } catch (error) {
      set((state) => ({
        inquiries: {
          ...state.inquiries,
          loading: false,
          error: error.response?.data?.error || "Failed to update inquiry status",
        },
      }));

      return {
        success: false,
        error: error.response?.data?.error || "Failed to update inquiry status",
      };
    }
  },

  // Delete an inquiry
  deleteInquiry: async (inquiryId) => {
    set((state) => ({
      inquiries: {
        ...state.inquiries,
        loading: true,
        error: null,
      },
    }));

    try {
      const response = await adminApi.delete(
        `/sell-mobile/inquiries/${inquiryId}/delete/`
      );

      if (response.status === 200) {
        set((state) => ({
          inquiries: {
            ...state.inquiries,
            list: state.inquiries.list.filter(
              (inquiry) => inquiry.id !== inquiryId
            ),
            loading: false,
            error: null,
          },
        }));

        return {
          success: true,
          message: response.data.message || "Inquiry deleted successfully",
        };
      }
    } catch (error) {
      set((state) => ({
        inquiries: {
          ...state.inquiries,
          loading: false,
          error: error.response?.data?.error || "Failed to delete inquiry",
        },
      }));

      return {
        success: false,
        error: error.response?.data?.error || "Failed to delete inquiry",
      };
    }
  },

  // Fetch all sell phone catalogs from the API
  fetchCatalogs: async () => {
    set((state) => ({
      catalogs: {
        ...state.catalogs,
        loading: true,
        error: null,
      },
    }));
    try {
      const response = await adminApi.get("/sell-mobile/catalog/");
      const catalogs = response.data.data;

      set({
        catalogs: {
          list: catalogs,
          loading: false,
          error: null,
        },
      });

      return {
        success: true,
        data: catalogs,
      };
    } catch (error) {
      set((state) => ({
        catalogs: {
          ...state.catalogs,
          loading: false,
          error: error.response?.data?.error || "Failed to fetch phone catalogs",
        },
      }));

      return {
        success: false,
        error: error.response?.data?.error || "Failed to fetch phone catalogs",
      };
    }
  },

  // Set selected catalog for viewing details
  setSelectedCatalog: (catalog) => {
    set({ selectedCatalog: catalog });
  },

  // Clear selected catalog
  clearSelectedCatalog: () => {
    set({ selectedCatalog: null });
  },
}));

export default useAdminSellPhone;
