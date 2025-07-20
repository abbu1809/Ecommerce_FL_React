import { useOptimizedAdminStore } from './useOptimizedAdminStore';

/**
 * COMPATIBILITY LAYER: Provides backward compatibility for useAdminStore API
 * This allows components to use optimized store without changing their code
 * 
 * KEY API DIFFERENCES RESOLVED:
 * - Original: fetchDashboardData() takes no parameters
 * - Optimized: fetchDashboardData(forceRefresh = false) takes optional parameter
 * - Original: fetchOrders() takes no parameters  
 * - Optimized: fetchOrders(page = 1, forceRefresh = false) takes optional parameters
 * - Original: fetchUsers() takes no parameters
 * - Optimized: fetchUsers(page = 1, forceRefresh = false) takes optional parameters
 * - Original: fetchProducts() takes no parameters
 * - Optimized: fetchProducts(page = 1, forceRefresh = false) takes optional parameters
 */

export const useAdminStore = () => {
  const store = useOptimizedAdminStore();
  
  return {
    // Pass through all existing state and methods
    ...store,
    
    // COMPATIBILITY WRAPPERS: Convert old API calls to new optimized API
    fetchDashboardData: () => store.fetchDashboardData(false),
    fetchOrders: () => store.fetchOrders(1, false), 
    fetchUsers: () => store.fetchUsers(1, false),
    fetchProducts: () => store.fetchProducts(1, false),
    
    // Keep optimized methods available with their full API
    fetchDashboardDataOptimized: store.fetchDashboardData,
    fetchOrdersOptimized: store.fetchOrders,
    fetchUsersOptimized: store.fetchUsers, 
    fetchProductsOptimized: store.fetchProducts,
  };
};

// Also export as default for default imports
export default useAdminStore;
