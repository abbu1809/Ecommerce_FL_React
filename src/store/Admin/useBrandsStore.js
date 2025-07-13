import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance for API calls
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const useBrandsStore = create(
  devtools(
    (set, get) => ({
      // State
      brands: [],
      loading: false,
      error: null,
      selectedBrand: null,
      brandSections: [],
      
      // Mock data for fallback when API fails
      getMockBrands: () => [
        {
          brand_id: 'mock-apple',
          name: 'Apple',
          slug: 'apple',
          description: 'Premium smartphones, tablets, and accessories',
          logo_url: '/brands/apple-logo.png',
          website_url: 'https://www.apple.com',
          featured: true,
          active: true,
          display_order: 1,
          product_count: 25,
          meta_data: { color: '#000000', category: 'Premium' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          brand_id: 'mock-samsung',
          name: 'Samsung',
          slug: 'samsung',
          description: 'Innovative Android devices and accessories',
          logo_url: '/brands/samsung-logo.png',
          website_url: 'https://www.samsung.com',
          featured: true,
          active: true,
          display_order: 2,
          product_count: 32,
          meta_data: { color: '#1f2937', category: 'Android' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          brand_id: 'mock-oneplus',
          name: 'OnePlus',
          slug: 'oneplus',
          description: 'Fast and smooth Android smartphones',
          logo_url: '/brands/oneplus-logo.png',
          website_url: 'https://www.oneplus.com',
          featured: true,
          active: true,
          display_order: 3,
          product_count: 18,
          meta_data: { color: '#dc2626', category: 'Android' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          brand_id: 'mock-xiaomi',
          name: 'Xiaomi',
          slug: 'xiaomi',
          description: 'Value-for-money smartphones and accessories',
          logo_url: '/brands/xiaomi-logo.png',
          website_url: 'https://www.mi.com',
          featured: true,
          active: true,
          display_order: 4,
          product_count: 28,
          meta_data: { color: '#f59e0b', category: 'Android' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          brand_id: 'mock-realme',
          name: 'Realme',
          slug: 'realme',
          description: 'Youth-focused smartphones with latest features',
          logo_url: '/brands/realme-logo.png',
          website_url: 'https://www.realme.com',
          featured: true,
          active: true,
          display_order: 5,
          product_count: 22,
          meta_data: { color: '#eab308', category: 'Android' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          brand_id: 'mock-oppo',
          name: 'Oppo',
          slug: 'oppo',
          description: 'Camera-focused smartphones and accessories',
          logo_url: '/brands/oppo-logo.png',
          website_url: 'https://www.oppo.com',
          featured: false,
          active: true,
          display_order: 6,
          product_count: 15,
          meta_data: { color: '#22c55e', category: 'Android' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          brand_id: 'mock-vivo',
          name: 'Vivo',
          slug: 'vivo',
          description: 'Selfie-focused smartphones with style',
          logo_url: '/brands/vivo-logo.png',
          website_url: 'https://www.vivo.com',
          featured: false,
          active: true,
          display_order: 7,
          product_count: 19,
          meta_data: { color: '#3b82f6', category: 'Android' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          brand_id: 'mock-google',
          name: 'Google',
          slug: 'google',
          description: 'Pure Android experience with Pixel devices',
          logo_url: '/brands/google-logo.png',
          website_url: 'https://store.google.com',
          featured: false,
          active: true,
          display_order: 8,
          product_count: 8,
          meta_data: { color: '#6366f1', category: 'Android' },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],

      // Actions
      fetchBrands: async (activeOnly = false, featuredOnly = false) => {
        set({ loading: true, error: null });
        try {
          const params = new URLSearchParams();
          if (activeOnly) params.append('active_only', 'true');
          if (featuredOnly) params.append('featured_only', 'true');
          
          const response = await api.get(`/brands/?${params.toString()}`);
          
          console.log('Brands response:', response.data);
          
          if (response.status === 200) {
            set({ 
              brands: response.data.brands,
              loading: false,
              error: null
            });
            return response.data.brands;
          }
        } catch (error) {
          console.error('Error fetching brands:', error);
          console.error('Error response:', error.response?.data);
          
          // Use mock data as fallback
          console.log('API failed, using mock data as fallback');
          const mockBrands = get().getMockBrands();
          set({ 
            brands: mockBrands,
            loading: false,
            error: 'API unavailable - using mock data'
          });
          
          toast.error('Using offline data - API connection failed');
          return mockBrands;
        }
      },

      // Add new brand
      addBrand: async (brandData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/brands/add/', brandData);
          
          if (response.status === 201) {
            const newBrand = response.data.brand;
            set(state => ({
              brands: [...state.brands, newBrand],
              loading: false,
              error: null
            }));
            toast.success('Brand created successfully');
            return newBrand;
          }
        } catch (error) {
          console.error('Error creating brand:', error);
          const errorMessage = error.response?.data?.error || 'Failed to create brand';
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Edit brand
      editBrand: async (brandId, brandData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.put(`/brands/edit/${brandId}/`, brandData);
          
          if (response.status === 200) {
            const updatedBrand = response.data.brand;
            set(state => ({
              brands: state.brands.map(brand => 
                brand.brand_id === brandId ? updatedBrand : brand
              ),
              loading: false,
              error: null
            }));
            toast.success('Brand updated successfully');
            return updatedBrand;
          }
        } catch (error) {
          console.error('Error updating brand:', error);
          const errorMessage = error.response?.data?.error || 'Failed to update brand';
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Delete brand
      deleteBrand: async (brandId) => {
        set({ loading: true, error: null });
        try {
          const response = await api.delete(`/brands/delete/${brandId}/`);
          
          if (response.status === 200) {
            set(state => ({
              brands: state.brands.filter(brand => brand.brand_id !== brandId),
              loading: false,
              error: null
            }));
            toast.success('Brand deleted successfully');
            return true;
          }
        } catch (error) {
          console.error('Error deleting brand:', error);
          const errorMessage = error.response?.data?.error || 'Failed to delete brand';
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Toggle brand featured status
      toggleBrandFeatured: async (brandId) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post(`/brands/toggle-featured/${brandId}/`);
          
          if (response.status === 200) {
            const updatedBrand = response.data.brand;
            set(state => ({
              brands: state.brands.map(brand => 
                brand.brand_id === brandId ? updatedBrand : brand
              ),
              loading: false,
              error: null
            }));
            toast.success(`Brand ${response.data.featured ? 'featured' : 'unfeatured'} successfully`);
            return updatedBrand;
          }
        } catch (error) {
          console.error('Error toggling brand featured:', error);
          const errorMessage = error.response?.data?.error || 'Failed to toggle featured status';
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Toggle brand active status
      toggleBrandActive: async (brandId) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post(`/brands/toggle-active/${brandId}/`);
          
          if (response.status === 200) {
            const updatedBrand = response.data.brand;
            set(state => ({
              brands: state.brands.map(brand => 
                brand.brand_id === brandId ? updatedBrand : brand
              ),
              loading: false,
              error: null
            }));
            toast.success(`Brand ${response.data.active ? 'activated' : 'deactivated'} successfully`);
            return updatedBrand;
          }
        } catch (error) {
          console.error('Error toggling brand active:', error);
          const errorMessage = error.response?.data?.error || 'Failed to toggle active status';
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Reorder brands
      reorderBrands: async (brandOrders) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/brands/reorder/', {
            brand_orders: brandOrders
          });
          
          if (response.status === 200) {
            // Update local state with new order
            const { brands } = get();
            const reorderedBrands = brands.map(brand => {
              const orderData = brandOrders.find(item => item.brand_id === brand.brand_id);
              return orderData ? { ...brand, display_order: orderData.display_order } : brand;
            }).sort((a, b) => a.display_order - b.display_order);
            
            set({ 
              brands: reorderedBrands,
              loading: false,
              error: null
            });
            toast.success('Brands reordered successfully');
            return true;
          }
        } catch (error) {
          console.error('Error reordering brands:', error);
          const errorMessage = error.response?.data?.error || 'Failed to reorder brands';
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      // Search brands
      searchBrands: async (query) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/brands/search/?q=${encodeURIComponent(query)}`);
          
          if (response.status === 200) {
            set({ 
              brands: response.data.brands,
              loading: false,
              error: null
            });
            return response.data.brands;
          }
        } catch (error) {
          console.error('Error searching brands:', error);
          const errorMessage = error.response?.data?.error || 'Failed to search brands';
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Initialize default brands
      initializeDefaultBrands: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/brands/initialize-defaults/');
          
          if (response.status === 201) {
            set({ 
              brands: response.data.brands,
              loading: false,
              error: null
            });
            toast.success(`${response.data.created_count} default brands created successfully`);
            return response.data.brands;
          } else if (response.status === 200) {
            // Brands already exist
            toast.info('Default brands already exist');
            return get().brands;
          }
        } catch (error) {
          console.error('Error initializing default brands:', error);
          const errorMessage = error.response?.data?.error || 'Failed to initialize default brands';
          set({ loading: false, error: errorMessage });
          toast.error(errorMessage);
          throw error;
        }
      },

      // Set selected brand
      setSelectedBrand: (brand) => {
        set({ selectedBrand: brand });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },

      // Get brands sorted by display order
      getSortedBrands: () => {
        const { brands } = get();
        return [...brands].sort((a, b) => a.display_order - b.display_order);
      },

      // Get featured brands only
      getFeaturedBrands: () => {
        const { brands } = get();
        return brands.filter(brand => brand.featured && brand.active);
      },

      // Get active brands only
      getActiveBrands: () => {
        const { brands } = get();
        return brands.filter(brand => brand.active);
      },

      // Update brand order locally (for drag and drop)
      updateBrandOrderLocally: (brandId, newOrder) => {
        const { brands } = get();
        const updatedBrands = brands.map(brand => 
          brand.brand_id === brandId 
            ? { ...brand, display_order: newOrder }
            : brand
        );
        set({ brands: updatedBrands });
      },

      // Get brand statistics
      getBrandStats: () => {
        const { brands } = get();
        return {
          total: brands.length,
          active: brands.filter(b => b.active).length,
          featured: brands.filter(b => b.featured).length,
          totalProducts: brands.reduce((sum, b) => sum + (b.product_count || 0), 0)
        };
      }
    }),
    {
      name: 'brands-store'
    }
  )
);

export default useBrandsStore;
