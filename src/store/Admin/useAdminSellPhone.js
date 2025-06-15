import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminApi } from "../../services/api";
import { toast } from "../../utils/toast";

const useAdminSellPhone = create(
  persist(
    (set, get) => ({
      catalogs: { data: [], loading: false, error: null },
      inquiries: { data: [], loading: false, error: null },
      faq: { data: [], loading: false, error: null },

      // State for sell phone inquiries
      inquiries: {
        list: [],
        loading: false,
        error: null,
      },

      // State for sell phone catalogs - updated structure
      catalogs: {
        data: null, // Changed from list: [] to data: null to store the nested brands object
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
          // URL /sell-mobile/inquiries/ seems consistent with new pattern: path('inquiries/', fetch_inquiries_for_mobile)
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
      // URL and method updated based on new pattern: path('listings/<str:mobile_id>/status/', update_sell_mobile_status) which is a PUT
      updateInquiryStatus: async (inquiryId, newStatus) => {
        set((state) => ({
          inquiries: {
            ...state.inquiries,
            loading: true,
            error: null,
          },
        }));

        try {
          const response = await adminApi.put(
            `/sell-mobile/listings/${inquiryId}/status/`, // Changed URL and method from PATCH to PUT
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
      // Note: The URL /sell-mobile/inquiries/${inquiryId}/delete/ was not found in the provided new urlpatterns.
      // This function will call the old endpoint. If it's removed, this will fail.
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

      // Fetch all sell phone catalogs from the API - updated URL and data structure
      fetchCatalogs: async () => {
        set((state) => ({
          catalogs: {
            ...state.catalogs,
            loading: true,
            error: null,
          },
        }));
        try {
          // Updated URL based on new pattern: path(\'catalog/all/\', fetch_all_mobiles_catalog)
          const response = await adminApi.get("/sell-mobile/catalog/all/");
          // New data structure: response.data.data contains { brands: { ... } }
          const catalogData = response.data.data.brands;

          set({
            catalogs: {
              data: catalogData, // Store the brands object
              loading: false,
              error: null,
            },
          });

          return {
            success: true,
            data: catalogData,
          };
        } catch (error) {
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              data: null, // Ensure data is reset on error
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

      // Add a new brand
      addBrand: async (brandData) => {
        // brandData should be an object like { id: "apple", logo_url: "..." }
        // The store will be optimistic and add it, then refetch or update based on API response.
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          // Assuming endpoint /sell-mobile/catalog/brands for POSTing new brand
          // The backend should create the brand with an empty phone_series object.
          const response = await adminApi.post("/sell-mobile/catalog/brands", brandData);
          if (response.status === 201 || response.status === 200) { // 201 Created or 200 OK
            // Successfully added, refetch all catalogs to get the updated list
            // Or, if API returns the new brand structure, update state directly
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
                // Optionally update data optimistically or wait for refetch
              },
            }));
            // Trigger a refetch of catalogs
            useAdminSellPhone.getState().fetchCatalogs();
            return { success: true, data: response.data };
          } else {
            throw new Error(response.data?.error || "Failed to add brand");
          }
        } catch (error) {
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: error.message || "Failed to add brand",
            },
          }));
          return { success: false, error: error.message || "Failed to add brand" };
        }
      },

      // Update an existing brand (e.g., logo_url)
      updateBrand: async (brandId, updatedData) => {
        // updatedData could be { logo_url: "new_url" }
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          // Assuming endpoint /sell-mobile/catalog/brands/{brandId} for PUT
          const response = await adminApi.put(`/sell-mobile/catalog/brands/${brandId}`, updatedData);
          if (response.status === 200) {
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
                // Update data optimistically or wait for refetch
              },
            }));
            // Trigger a refetch of catalogs
            useAdminSellPhone.getState().fetchCatalogs();
            return { success: true, data: response.data };
          } else {
            throw new Error(response.data?.error || "Failed to update brand");
          }
        } catch (error) {
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: error.message || "Failed to update brand",
            },
          }));
          return { success: false, error: error.message || "Failed to update brand" };
        }
      },

      // Delete a brand
      deleteBrand: async (brandId) => {
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          // Assuming endpoint /sell-mobile/catalog/brands/{brandId} for DELETE
          const response = await adminApi.delete(`/sell-mobile/catalog/brands/${brandId}`);
          if (response.status === 200 || response.status === 204) { // 204 No Content or 200 OK
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
                // Update data optimistically or wait for refetch
              },
            }));
            // Trigger a refetch of catalogs
            useAdminSellPhone.getState().fetchCatalogs();
            return { success: true };
          } else {
            throw new Error(response.data?.error || "Failed to delete brand");
          }
        } catch (error) {
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: error.message || "Failed to delete brand",
            },
          }));
          return { success: false, error: error.message || "Failed to delete brand" };
        }
      },

      // Series CRUD
      addSeries: async (brandId, seriesData) => {
        try {
          const response = await api.post(`/sell-mobile/catalog/brands/${brandId}/series/`, seriesData);
          if (response.status === 201) {
            toast.success("Series added successfully");
            get().fetchCatalogs();
            return response.data;
          }
        } catch (error) {
          console.error("Failed to add series:", error);
          toast.error(error.response?.data?.message || "Failed to add series");
          throw error;
        }
      },
      updateSeries: async (brandId, seriesId, seriesData) => {
        try {
          const response = await api.put(`/sell-mobile/catalog/brands/${brandId}/series/${seriesId}/`, seriesData);
          if (response.status === 200) {
            toast.success("Series updated successfully");
            get().fetchCatalogs();
            return response.data;
          }
        } catch (error) {
          console.error("Failed to update series:", error);
          toast.error(error.response?.data?.message || "Failed to update series");
          throw error;
        }
      },
      deleteSeries: async (brandId, seriesId) => {
        try {
          const response = await api.delete(`/sell-mobile/catalog/brands/${brandId}/series/${seriesId}/`);
          if (response.status === 204 || response.status === 200) {
            toast.success("Series deleted successfully");
            get().fetchCatalogs();
            return true;
          }
        } catch (error) {
          console.error("Failed to delete series:", error);
          toast.error(error.response?.data?.message || "Failed to delete series");
          throw error;
        }
      },

      // Model CRUD
      addModel: async (seriesId, modelData) => {
        // Assuming modelData includes image file or image URL
        // If it's a file, it might need FormData handling depending on API setup
        try {
          const response = await api.post(`/sell-mobile/catalog/series/${seriesId}/models/`, modelData);
          if (response.status === 201) {
            toast.success("Model added successfully");
            get().fetchCatalogs();
            return response.data;
          }
        } catch (error) {
          console.error("Failed to add model:", error);
          toast.error(error.response?.data?.message || "Failed to add model");
          throw error;
        }
      },
      updateModel: async (seriesId, modelId, modelData) => {
        try {
          const response = await api.put(`/sell-mobile/catalog/series/${seriesId}/models/${modelId}/`, modelData);
          if (response.status === 200) {
            toast.success("Model updated successfully");
            get().fetchCatalogs();
            return response.data;
          }
        } catch (error) {
          console.error("Failed to update model:", error);
          toast.error(error.response?.data?.message || "Failed to update model");
          throw error;
        }
      },
      deleteModel: async (seriesId, modelId) => {
        try {
          const response = await api.delete(`/sell-mobile/catalog/series/${seriesId}/models/${modelId}/`);
          if (response.status === 204 || response.status === 200) {
            toast.success("Model deleted successfully");
            get().fetchCatalogs();
            return true;
          }
        } catch (error) {
          console.error("Failed to delete model:", error);
          toast.error(error.response?.data?.message || "Failed to delete model");
          throw error;
        }
      },
      
      // FAQ CRUD (example, adjust as needed)
      fetchFaq: async () => {
        // ...existing code...
      },
      addFaq: async (faqData) => {
        // ...existing code...
      },
      updateFaq: async (faqId, faqData) => {
        // ...existing code...
      },
      deleteFaq: async (faqId) => {
        // ...existing code...
      },
    }),
    {
      name: "admin-sell-phone-store",
    }
  )
);

export default useAdminSellPhone;
