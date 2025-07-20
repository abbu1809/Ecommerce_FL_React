import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { adminApi } from "../../services/api";

// OPTIMIZATION: Smart cache with TTL
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const ITEMS_PER_PAGE = 25; // Limit query results

// Helper function for cache management
const createCacheEntry = (data) => ({
  data,
  timestamp: Date.now(),
  isValid: function() {
    return (Date.now() - this.timestamp) < CACHE_TTL;
  }
});

// Helper function to calculate status counts efficiently  
const getStatusCounts = (items, statusKey = "status") => {
  return items.reduce((counts, item) => {
    const status = item[statusKey] || "unknown";
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
};

export const useOptimizedAdminStore = create(
  devtools((set, get) => ({
    // OPTIMIZATION: Cache system
    cache: {
      dashboard: null,
      orders: null,
      users: null,
      products: null,
      lastFetch: {},
    },
    
    // Pagination state
    pagination: {
      orders: { page: 1, hasMore: true, total: 0 },
      users: { page: 1, hasMore: true, total: 0 },
      products: { page: 1, hasMore: true, total: 0 },
    },

    // Dashboard data - OPTIMIZED
    dashboard: {
      stats: [],
      salesData: [],
      topProducts: [],
      recentOrders: [],
      loading: false,
    },

    orders: {
      list: [],
      loading: false,
      statusCounts: {},
      error: null,
    },

    users: {
      list: [],
      loading: false,
      statusCounts: {},
      error: null,
    },

    products: {
      list: [],
      loading: false,
      error: null,
    },

    // OPTIMIZATION: Cached user/product lookup
    userCache: new Map(),
    productCache: new Map(),

    // OPTIMIZATION: Smart Dashboard Data Fetching
    fetchDashboardData: async (forceRefresh = false) => {
      const state = get();
      
      // Check cache first
      if (!forceRefresh && state.cache.dashboard?.isValid()) {
        set({ dashboard: { ...state.cache.dashboard.data, loading: false } });
        return;
      }

      set((state) => ({ dashboard: { ...state.dashboard, loading: true } }));

      try {
        // OPTIMIZATION: Fetch only summary data, not full collections
        const response = await adminApi.get("/admin/analytics/dashboard/");
        
        const dashboardData = {
          stats: response.data.stats || [],
          salesData: response.data.sales_data || [],
          topProducts: response.data.top_products || [],
          recentOrders: response.data.recent_orders || [], // Only last 10
          loading: false,
        };

        // Cache the result
        set((state) => ({
          dashboard: dashboardData,
          cache: {
            ...state.cache,
            dashboard: createCacheEntry(dashboardData)
          }
        }));

      } catch (error) {
        console.error("Dashboard data fetch error:", error);
        set((state) => ({
          dashboard: {
            ...state.dashboard,
            loading: false,
            error: error.response?.data?.error || "Failed to fetch dashboard data",
          },
        }));
      }
    },

    // OPTIMIZATION: Paginated Orders Fetching
    fetchOrders: async (page = 1, forceRefresh = false) => {
      const state = get();
      
      // Check cache for first page
      if (page === 1 && !forceRefresh && state.cache.orders?.isValid()) {
        set({ 
          orders: { ...state.cache.orders.data, loading: false },
          pagination: { ...state.pagination, orders: { page, hasMore: state.cache.orders.data.hasMore, total: state.cache.orders.data.total } }
        });
        return;
      }

      set((state) => ({
        orders: { ...state.orders, loading: true, error: null },
      }));

      try {
        // OPTIMIZATION: Paginated query with limit
        const response = await adminApi.get("/admin/get_all_orders", {
          params: {
            page,
            limit: ITEMS_PER_PAGE,
            summary: page === 1 ? 'true' : 'false' // Get counts only for first page
          }
        });

        const orders = response.data.orders || [];
        const hasMore = orders.length === ITEMS_PER_PAGE;
        const total = response.data.total || orders.length;

        // For pagination, append or replace
        const updatedOrders = page === 1 ? orders : [...state.orders.list, ...orders];
        const statusCounts = page === 1 ? getStatusCounts(orders) : state.orders.statusCounts;

        const ordersData = {
          list: updatedOrders,
          statusCounts,
          loading: false,
          error: null,
          hasMore,
          total
        };

        // Cache first page only
        const cacheUpdate = page === 1 ? {
          ...state.cache,
          orders: createCacheEntry(ordersData)
        } : state.cache;

        set({
          orders: ordersData,
          pagination: {
            ...state.pagination,
            orders: { page, hasMore, total }
          },
          cache: cacheUpdate
        });

      } catch (error) {
        set((state) => ({
          orders: {
            ...state.orders,
            loading: false,
            error: error.response?.data?.error || "Failed to fetch orders",
          },
        }));
      }
    },

    // OPTIMIZATION: Paginated Users Fetching  
    fetchUsers: async (page = 1, forceRefresh = false) => {
      const state = get();
      
      // Check cache for first page
      if (page === 1 && !forceRefresh && state.cache.users?.isValid()) {
        set({ 
          users: { ...state.cache.users.data, loading: false },
          pagination: { ...state.pagination, users: { page, hasMore: state.cache.users.data.hasMore, total: state.cache.users.data.total } }
        });
        return;
      }

      set((state) => ({
        users: { ...state.users, loading: true, error: null },
      }));

      try {
        // OPTIMIZATION: Paginated query
        const response = await adminApi.get("/admin/get_all_users", {
          params: {
            page,
            limit: ITEMS_PER_PAGE
          }
        });

        const users = response.data.users || [];
        const hasMore = users.length === ITEMS_PER_PAGE;
        const total = response.data.total || users.length;

        const updatedUsers = page === 1 ? users : [...state.users.list, ...users];
        const statusCounts = page === 1 ? getStatusCounts(users, "status") : state.users.statusCounts;

        const usersData = {
          list: updatedUsers,
          statusCounts,
          loading: false,
          error: null,
          hasMore,
          total
        };

        // Cache first page only
        const cacheUpdate = page === 1 ? {
          ...state.cache,
          users: createCacheEntry(usersData)
        } : state.cache;

        set({
          users: usersData,
          pagination: {
            ...state.pagination,
            users: { page, hasMore, total }
          },
          cache: cacheUpdate
        });

      } catch (error) {
        set((state) => ({
          users: {
            ...state.users,
            loading: false,
            error: error.response?.data?.error || "Failed to fetch users",
          },
        }));
      }
    },

    // OPTIMIZATION: Paginated Products Fetching
    fetchProducts: async (page = 1, forceRefresh = false) => {
      const state = get();
      
      // Check cache for first page
      if (page === 1 && !forceRefresh && state.cache.products?.isValid()) {
        set({ 
          products: { ...state.cache.products.data, loading: false },
          pagination: { ...state.pagination, products: { page, hasMore: state.cache.products.data.hasMore, total: state.cache.products.data.total } }
        });
        return;
      }

      set((state) => ({
        products: { ...state.products, loading: true, error: null },
      }));

      try {
        // OPTIMIZATION: Paginated query
        const response = await adminApi.get("/admin/get_all_products", {
          params: {
            page,
            limit: ITEMS_PER_PAGE
          }
        });

        const products = response.data.products || [];
        const hasMore = products.length === ITEMS_PER_PAGE;
        const total = response.data.total || products.length;

        const updatedProducts = page === 1 ? products : [...state.products.list, ...products];

        const productsData = {
          list: updatedProducts,
          loading: false,
          error: null,
          hasMore,
          total
        };

        // Cache first page only  
        const cacheUpdate = page === 1 ? {
          ...state.cache,
          products: createCacheEntry(productsData)
        } : state.cache;

        set({
          products: productsData,
          pagination: {
            ...state.pagination,
            products: { page, hasMore, total }
          },
          cache: cacheUpdate
        });

      } catch (error) {
        set((state) => ({
          products: {
            ...state.products,
            loading: false,
            error: error.response?.data?.error || "Failed to fetch products",
          },
        }));
      }
    },

    // OPTIMIZATION: Enhanced User Lookup with Caching
    getCachedUser: async (userId) => {
      const cached = get().userCache.get(userId);
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.data;
      }

      try {
        const response = await adminApi.get(`/admin/users/${userId}/`);
        const user = response.data.user;
        
        if (user) {
          set((state) => {
            const newCache = new Map(state.userCache);
            newCache.set(userId, { data: user, timestamp: Date.now() });
            return { userCache: newCache };
          });
        }
        return user;
      } catch (error) {
        console.error(`Failed to fetch user ${userId}:`, error);
        return null;
      }
    },

    // OPTIMIZATION: Enhanced Product Lookup with Caching  
    getCachedProduct: async (productId) => {
      const cached = get().productCache.get(productId);
      if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.data;
      }

      try {
        const response = await adminApi.get(`/admin/products/${productId}/`);
        const product = response.data.product;
        
        if (product) {
          set((state) => {
            const newCache = new Map(state.productCache);
            newCache.set(productId, { data: product, timestamp: Date.now() });
            return { productCache: newCache };
          });
        }
        return product;
      } catch (error) {
        console.error(`Failed to fetch product ${productId}:`, error);
        return null;
      }
    },

    // OPTIMIZATION: Load more functionality
    loadMoreOrders: async () => {
      const state = get();
      const nextPage = state.pagination.orders.page + 1;
      await get().fetchOrders(nextPage);
    },

    loadMoreUsers: async () => {
      const state = get();
      const nextPage = state.pagination.users.page + 1;
      await get().fetchUsers(nextPage);
    },

    loadMoreProducts: async () => {
      const state = get();
      const nextPage = state.pagination.products.page + 1;
      await get().fetchProducts(nextPage);
    },

    // OPTIMIZATION: Cache invalidation
    invalidateCache: (cacheKey) => {
      set((state) => ({
        cache: {
          ...state.cache,
          [cacheKey]: null
        }
      }));
    },

    clearAllCaches: () => {
      set({
        cache: {
          dashboard: null,
          orders: null,
          users: null,
          products: null,
        },
        userCache: new Map(),
        productCache: new Map(),
      });
    },

    // Keep existing methods with optimization...
    updateOrderStatus: async (orderId, status) => {
      const response = await adminApi.put(`/admin/order/edit/${orderId}/`, {
        status: status,
      });

      if (response.data.message || response.status === 200) {
        set((state) => {
          const updatedList = state.orders.list.map((order) =>
            order.order_id === orderId ? { ...order, status } : order
          );

          return {
            orders: {
              ...state.orders,
              list: updatedList,
              statusCounts: getStatusCounts(updatedList),
            },
          };
        });
        
        // Invalidate cache
        get().invalidateCache('orders');
      }
    },

    // ... other existing methods remain the same but with cache invalidation where needed
  }))
);
