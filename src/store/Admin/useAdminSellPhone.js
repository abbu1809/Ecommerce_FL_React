import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminApi } from "../../services/api";
import { toast } from "../../utils/toast";

const useAdminSellPhone = create(
  persist(
    (set, get) => ({
      // State for sell phone inquiries
      inquiries: {
        list: [],
        loading: false,
        error: null,
      },

      // State for sell phone catalogs - updated structure to match API response
      catalogs: {
        data: null, // Will store the nested brands object: { brands: { apple: {...}, samsung: {...} } }
        loading: false,
        error: null,
      },

      // FAQ state
      faq: { 
        data: [], 
        loading: false, 
        error: null 
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
      },      // Add a new brand
      addBrand: async (brandData) => {
        // brandData should be an object like { id: "apple", logo_url: "..." }
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          const response = await adminApi.post("/sell-mobile/catalog/brands/", brandData);
          if (response.status === 201 || response.status === 200) {
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
              },
            }));
            // Refetch catalogs to get updated data
            await get().fetchCatalogs();
            toast.success("Brand added successfully");
            return { success: true, data: response.data };
          } else {
            throw new Error(response.data?.error || "Failed to add brand");
          }
        } catch (error) {
          const errorMsg = error.response?.data?.error || error.message || "Failed to add brand";
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      },

      // Update an existing brand (e.g., logo_url)
      updateBrand: async (brandId, updatedData) => {
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          const response = await adminApi.put(`/sell-mobile/catalog/brands/${brandId}/`, updatedData);
          if (response.status === 200) {
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
              },
            }));
            await get().fetchCatalogs();
            toast.success("Brand updated successfully");
            return { success: true, data: response.data };
          } else {
            throw new Error(response.data?.error || "Failed to update brand");
          }
        } catch (error) {
          const errorMsg = error.response?.data?.error || error.message || "Failed to update brand";
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      },

      // Delete a brand
      deleteBrand: async (brandId) => {
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          const response = await adminApi.delete(`/sell-mobile/catalog/brands/${brandId}/`);
          if (response.status === 200 || response.status === 204) {
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
              },
            }));
            await get().fetchCatalogs();
            toast.success("Brand deleted successfully");
            return { success: true };
          } else {
            throw new Error(response.data?.error || "Failed to delete brand");
          }
        } catch (error) {
          const errorMsg = error.response?.data?.error || error.message || "Failed to delete brand";
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      },      // Series CRUD
      addSeries: async (brandId, seriesData) => {
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          const response = await adminApi.post(`/sell-mobile/catalog/brands/${brandId}/series/`, seriesData);
          if (response.status === 201 || response.status === 200) {
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
              },
            }));
            await get().fetchCatalogs();
            toast.success("Series added successfully");
            return { success: true, data: response.data };
          }
        } catch (error) {
          const errorMsg = error.response?.data?.error || error.message || "Failed to add series";
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          throw error;
        }
      },
      
      updateSeries: async (brandId, seriesId, seriesData) => {
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          const response = await adminApi.put(`/sell-mobile/catalog/brands/${brandId}/series/${seriesId}/`, seriesData);
          if (response.status === 200) {
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
              },
            }));
            await get().fetchCatalogs();
            toast.success("Series updated successfully");
            return { success: true, data: response.data };
          }
        } catch (error) {
          const errorMsg = error.response?.data?.error || error.message || "Failed to update series";
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          throw error;
        }
      },
      
      deleteSeries: async (brandId, seriesId) => {
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          const response = await adminApi.delete(`/sell-mobile/catalog/brands/${brandId}/series/${seriesId}/`);
          if (response.status === 204 || response.status === 200) {
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
              },
            }));
            await get().fetchCatalogs();
            toast.success("Series deleted successfully");
            return { success: true };
          }
        } catch (error) {
          const errorMsg = error.response?.data?.error || error.message || "Failed to delete series";
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          throw error;
        }
      },

      // Model CRUD
      addModel: async (seriesId, modelData) => {
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          const response = await adminApi.post(`/sell-mobile/catalog/series/${seriesId}/models/`, modelData);
          if (response.status === 201 || response.status === 200) {
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
              },
            }));
            await get().fetchCatalogs();
            toast.success("Model added successfully");
            return { success: true, data: response.data };
          }
        } catch (error) {
          const errorMsg = error.response?.data?.error || error.message || "Failed to add model";
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          throw error;
        }
      },
      
      updateModel: async (seriesId, modelId, modelData) => {
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          const response = await adminApi.put(`/sell-mobile/catalog/series/${seriesId}/models/${modelId}/`, modelData);
          if (response.status === 200) {
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
              },
            }));
            await get().fetchCatalogs();
            toast.success("Model updated successfully");
            return { success: true, data: response.data };
          }
        } catch (error) {
          const errorMsg = error.response?.data?.error || error.message || "Failed to update model";
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          throw error;
        }
      },
      
      deleteModel: async (seriesId, modelId) => {
        set((state) => ({
          catalogs: { ...state.catalogs, loading: true, error: null },
        }));
        try {
          const response = await adminApi.delete(`/sell-mobile/catalog/series/${seriesId}/models/${modelId}/`);
          if (response.status === 204 || response.status === 200) {
            set((state) => ({
              catalogs: {
                ...state.catalogs,
                loading: false,
              },
            }));
            await get().fetchCatalogs();
            toast.success("Model deleted successfully");
            return { success: true };
          }
        } catch (error) {
          const errorMsg = error.response?.data?.error || error.message || "Failed to delete model";
          set((state) => ({
            catalogs: {
              ...state.catalogs,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          throw error;
        }
      },        // FAQ CRUD - Updated to match Django REST framework views
      fetchFaq: async () => {
        set((state) => ({
          faq: { ...state.faq, loading: true, error: null },
        }));
        try {
          const response = await adminApi.get("/sell-mobile/faqs/");
          // Handle different possible response structures from Django
          let faqData = [];
          if (response.data.faqs) {
            // If data is nested under 'faqs' key
            faqData = response.data.faqs;
          } else if (Array.isArray(response.data)) {
            // If data is directly an array
            faqData = response.data;
          } else if (response.data.results) {
            // If using Django REST framework pagination
            faqData = response.data.results;
          } else if (response.data.data) {
            // If data is nested under 'data' key
            faqData = response.data.data;
          }

          set({
            faq: {
              data: faqData,
              loading: false,
              error: null,
            },
          });
          return { success: true, data: faqData };
        } catch (error) {
          const errorMsg = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to fetch FAQs";
          set((state) => ({
            faq: {
              ...state.faq,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          return { success: false, error: errorMsg };
        }
      },
        addFaq: async (faqData) => {
        set((state) => ({
          faq: { ...state.faq, loading: true, error: null },
        }));
        try {
          const response = await adminApi.post("/sell-mobile/faqs/", faqData);
          if (response.status === 201 || response.status === 200) {
            // Refresh FAQ list to get the latest data
            await get().fetchFaq();
            const message = response.data.message || 
                           response.data.detail || 
                           "FAQ added successfully";
            toast.success(message);
            return { success: true, data: response.data };
          } else {
            throw new Error("Unexpected response status");
          }
        } catch (error) {
          const errorMsg = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data?.detail ||
                          error.message || 
                          "Failed to add FAQ";
          set((state) => ({
            faq: {
              ...state.faq,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          throw error;
        }
      },
        updateFaq: async (faqId, faqData) => {
        set((state) => ({
          faq: { ...state.faq, loading: true, error: null },
        }));
        try {
          const response = await adminApi.put(`/sell-mobile/faqs/${faqId}/`, faqData);
          if (response.status === 200) {
            // Refresh FAQ list to get the latest data
            await get().fetchFaq();
            const message = response.data.message || 
                           response.data.detail || 
                           "FAQ updated successfully";
            toast.success(message);
            return { success: true, data: response.data };
          } else {
            throw new Error("Unexpected response status");
          }
        } catch (error) {
          const errorMsg = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data?.detail ||
                          error.message || 
                          "Failed to update FAQ";
          set((state) => ({
            faq: {
              ...state.faq,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          throw error;
        }
      },
        deleteFaq: async (faqId) => {
        set((state) => ({
          faq: { ...state.faq, loading: true, error: null },
        }));
        try {
          const response = await adminApi.delete(`/sell-mobile/faqs/${faqId}/`);
          if (response.status === 204 || response.status === 200) {
            // Refresh FAQ list to get the latest data
            await get().fetchFaq();
            const message = response.data?.message || 
                           response.data?.detail || 
                           "FAQ deleted successfully";
            toast.success(message);
            return { success: true };
          } else {
            throw new Error("Unexpected response status");
          }
        } catch (error) {
          const errorMsg = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data?.detail ||
                          error.message || 
                          "Failed to delete FAQ";
          set((state) => ({
            faq: {
              ...state.faq,
              loading: false,
              error: errorMsg,
            },
          }));
          toast.error(errorMsg);
          throw error;
        }
      },
    }),
    {
      name: "admin-sell-phone-store",
    }
  )
);

export default useAdminSellPhone;
