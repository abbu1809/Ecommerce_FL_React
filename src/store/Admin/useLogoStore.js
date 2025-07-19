import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { adminApi } from "../../services/api";

// Default logo fallback
const DEFAULT_LOGO = '/src/assets/logo.png'; // Adjust path as needed

export const useLogoStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        logo: null,
        logoCache: null, // Separate cache for persistence
        loading: false,
        error: null,
        lastFetched: null,

        // Actions
        setLogo: (logo) => {
          const timestamp = Date.now();
          set({ 
            logo, 
            logoCache: logo,
            lastFetched: timestamp,
            error: null
          });
        },
        
        setLoading: (loading) => set({ loading }),
        setError: (error) => set({ error }),

        // Enhanced fetch logo with caching and fallbacks
        fetchLogo: async (forceRefresh = false) => {
          const currentState = get();
          const now = Date.now();
          const cacheValid = currentState.lastFetched && 
                           (now - currentState.lastFetched) < 300000; // 5 minutes cache

          // Return cached logo if valid and not forcing refresh
          if (!forceRefresh && cacheValid && currentState.logoCache) {
            if (!currentState.logo) {
              set({ logo: currentState.logoCache });
            }
            return currentState.logoCache;
          }

          // Prevent duplicate fetches
          if (currentState.loading && !forceRefresh) {
            return currentState.logo || currentState.logoCache;
          }
          
          set({ loading: true, error: null });
          try {
            const response = await adminApi.get("/admin/content/logo/", {
              timeout: 10000, // 10 second timeout
              headers: {
                'Cache-Control': forceRefresh ? 'no-cache' : 'max-age=300'
              }
            });

            if (response.status === 200 && response.data?.logo_url) {
              const logoUrl = response.data.logo_url;
              set({ 
                logo: logoUrl,
                logoCache: logoUrl,
                loading: false,
                lastFetched: now,
                error: null
              });
              return logoUrl;
            } else {
              // No logo found but request was successful
              const fallback = currentState.logoCache || DEFAULT_LOGO;
              set({ 
                logo: fallback,
                logoCache: currentState.logoCache, // Keep existing cache
                loading: false,
                lastFetched: now
              });
              return fallback;
            }
          } catch (error) {
            console.error("Error fetching logo:", error);
            
            // Determine fallback logo
            const fallbackLogo = currentState.logoCache || DEFAULT_LOGO;
            
            // Set error but keep using cached/default logo
            set({
              logo: fallbackLogo,
              error: error.response?.status === 404 ? 
                     'No logo configured' : 
                     'Failed to load logo, using cached version',
              loading: false,
              lastFetched: now
            });
            
            // Don't throw error, return fallback instead
            return fallbackLogo;
          }
        },

        // Upload new logo with optimistic updates
        uploadLogo: async (formData) => {
          set({ loading: true, error: null });
          
          // Create preview for optimistic update
          let previewUrl = null;
          const file = formData.get('logo');
          if (file && file.type?.startsWith('image/')) {
            previewUrl = URL.createObjectURL(file);
          }

          try {
            const response = await adminApi.post(
              "/admin/content/logo/upload/",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                timeout: 30000 // 30 seconds for upload
              }
            );

            if (response.status === 200 || response.status === 201) {
              const logoUrl = response.data.logo_url;
              const now = Date.now();
              
              // Clean up preview URL
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
              }

              set({ 
                logo: logoUrl,
                logoCache: logoUrl,
                loading: false,
                lastFetched: now,
                error: null
              });
              return response.data;
            }
          } catch (error) {
            console.error("Error uploading logo:", error);
            
            // Clean up preview URL on error
            if (previewUrl) {
              URL.revokeObjectURL(previewUrl);
            }

            set({
              error: error.response?.data?.error || 
                     error.response?.data?.message ||
                     "Failed to upload logo",
              loading: false,
            });
            throw error;
          }
        },

        // Delete logo with confirmation
        deleteLogo: async () => {
          set({ loading: true, error: null });

          try {
            const response = await adminApi.delete("/admin/content/logo/");

            if (response.status === 200 || response.status === 204) {
              set({ 
                logo: DEFAULT_LOGO,
                logoCache: null, // Clear cache
                loading: false,
                lastFetched: Date.now()
              });
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

        // Force refresh logo
        refreshLogo: async () => {
          const { fetchLogo } = get();
          return fetchLogo(true);
        },

        // Reset to default logo
        resetToDefault: () => {
          set({
            logo: DEFAULT_LOGO,
            logoCache: null,
            error: null,
            lastFetched: Date.now()
          });
        },

        // Clear error
        clearError: () => set({ error: null }),

        // Get current logo with fallback
        getCurrentLogo: () => {
          const state = get();
          return state.logo || state.logoCache || DEFAULT_LOGO;
        }
      }),
      {
        name: 'logo-store',
        partialize: (state) => ({ 
          logoCache: state.logoCache,
          lastFetched: state.lastFetched
        }),
        version: 2, // Increment version to clear old cache
        onRehydrateStorage: () => (state) => {
          // On rehydration, set logo from cache if available
          if (state?.logoCache) {
            state.logo = state.logoCache;
          }
        }
      }
    ),
    {
      name: 'logo-store'
    }
  )
);

export default useLogoStore;
