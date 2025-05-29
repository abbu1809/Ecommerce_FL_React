import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { adminApi } from "../../services/api";

// Count items by status
const getStatusCounts = (items, statusField = "status") => {
  return items.reduce((acc, item) => {
    const status = item[statusField];
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
};

// Admin store
export const useAdminStore = create(
  devtools((set, get) => ({
    // Dashboard data
    dashboard: {
      stats: [],
      salesData: [],
      topProducts: [],
      recentOrders: [],
      loading: false,
    },

    // Orders data
    orders: {
      list: [],
      loading: false,
      statusCounts: {},
      error: null,
    },

    // Users data
    users: {
      list: [],
      loading: false,
      statusCounts: {},
      error: null,
    },

    // Products data
    products: {
      list: [],
      loading: false,
      error: null,
    },

    // Returns data
    returns: {
      list: [],
      loading: false,
      statusCounts: {},
    },

    // Delivery Partners data
    deliveryPartners: {
      list: [],
      loading: false,
      error: null,
    },

    // Single user and product lookup methods
    getUserById: async (userId) => {
      try {
        const response = await adminApi.get(`/admin/users/${userId}/`);
        return response.data.user;
      } catch (error) {
        console.error(`Failed to fetch user ${userId}:`, error);
        return null;
      }
    },

    getProductById: async (productId) => {
      try {
        const response = await adminApi.get(`/admin/products/${productId}/`);
        return response.data.product;
      } catch (error) {
        console.error(`Failed to fetch product ${productId}:`, error);
        return null;
      }
    },

    // Cache for users and products to avoid repeated API calls
    userCache: new Map(),
    productCache: new Map(),

    // Get user with caching
    getCachedUser: async (userId) => {
      const cached = get().userCache.get(userId);
      if (cached) return cached;

      const user = await get().getUserById(userId);
      if (user) {
        set((state) => {
          const newCache = new Map(state.userCache);
          newCache.set(userId, user);
          return { userCache: newCache };
        });
      }
      return user;
    },

    // Get product with caching
    getCachedProduct: async (productId) => {
      const cached = get().productCache.get(productId);
      if (cached) return cached;

      const product = await get().getProductById(productId);
      if (product) {
        set((state) => {
          const newCache = new Map(state.productCache);
          newCache.set(productId, product);
          return { productCache: newCache };
        });
      }
      return product;
    },

    // Dashboard actions
    fetchDashboardData: async () => {
      set((state) => ({ dashboard: { ...state.dashboard, loading: true } }));

      try {
        // For now, use the previous simulated data until dashboard API endpoints are available
        const stats = [
          {
            title: "Total Sales",
            value: "₹125,430",
            change: "+12.5%",
            isPositive: true,
          },
          {
            title: "New Orders",
            value: "42",
            change: "+8.2%",
            isPositive: true,
          },
          {
            title: "New Customers",
            value: "18",
            change: "+5.7%",
            isPositive: true,
          },
          {
            title: "Low Stock Items",
            value: "7",
            change: "-2.3%",
            isPositive: false,
          },
        ];

        const topProducts = [
          { id: 1, name: "Smartphone X", sales: 145, revenue: 14500 },
          { id: 2, name: "Laptop Pro", sales: 98, revenue: 78400 },
          { id: 3, name: "Wireless Headphones", sales: 82, revenue: 4100 },
          { id: 4, name: "Smart Watch", sales: 65, revenue: 9750 },
          { id: 5, name: "HD Camera", sales: 49, revenue: 7350 },
        ];

        // Get the first 5 orders for recent orders
        const ordersResponse = await adminApi.get("/admin/get_all_orders");
        const recentOrders = ordersResponse.data.orders.slice(0, 5);

        const salesData = [
          { month: "Jan", sales: 4000 },
          { month: "Feb", sales: 6000 },
          { month: "Mar", sales: 8000 },
          { month: "Apr", sales: 7500 },
          { month: "May", sales: 12000 },
          { month: "Jun", sales: 9800 },
        ];

        set({
          dashboard: {
            stats,
            salesData,
            topProducts,
            recentOrders,
            loading: false,
          },
        });
      } catch (error) {
        set((state) => ({
          dashboard: {
            ...state.dashboard,
            loading: false,
            error:
              error.response?.data?.error || "Failed to fetch dashboard data",
          },
        }));
      }
    }, // Orders actions
    fetchOrders: async () => {
      set((state) => ({
        orders: { ...state.orders, loading: true, error: null },
      }));

      try {
        const response = await adminApi.get("/admin/get_all_orders");
        const orders = response.data.orders;
        const statusCounts = getStatusCounts(orders);

        set({
          orders: {
            list: orders,
            statusCounts,
            loading: false,
            error: null,
          },
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
    updateOrderStatus: async (orderId, status) => {
      set((state) => ({
        orders: { ...state.orders, loading: true, error: null },
      }));

      try {
        // Use the edit_order endpoint for updating order status
        const response = await adminApi.put(`/admin/order/edit/${orderId}/`, {
          status: status,
        });

        if (response.data.message || response.status === 200) {
          set((state) => {
            const updatedList = state.orders.list.map((order) =>
              order.order_id === orderId ? { ...order, status } : order
            );

            const statusCounts = getStatusCounts(updatedList);

            return {
              orders: {
                list: updatedList,
                statusCounts,
                loading: false,
                error: null,
              },
            };
          });
        }
      } catch (error) {
        set((state) => ({
          orders: {
            ...state.orders,
            loading: false,
            error:
              error.response?.data?.error || "Failed to update order status",
          },
        }));
      }
    }, // Edit order details
    editOrder: async (userId, orderId, orderData) => {
      set((state) => ({
        orders: { ...state.orders, loading: true, error: null },
      }));

      try {
        const response = await adminApi.put(
          `/admin/users/${userId}/orders/${orderId}/edit/`,
          orderData
        );

        if (response.data.message || response.status === 200) {
          set((state) => {
            const updatedList = state.orders.list.map((order) =>
              order.order_id === orderId ? { ...order, ...orderData } : order
            );

            return {
              orders: {
                list: updatedList,
                statusCounts: getStatusCounts(updatedList),
                loading: false,
                error: null,
              },
            };
          });

          return response.data;
        }
      } catch (error) {
        set((state) => ({
          orders: {
            ...state.orders,
            loading: false,
            error: error.response?.data?.error || "Failed to edit order",
          },
        }));
        throw error;
      }
    },

    // Assign delivery partner to order
    assignOrderToDeliveryPartner: async (userId, orderId, partnerId) => {
      if (!partnerId) {
        const errorMsg =
          "Partner ID is required. Please select a delivery partner.";
        set((state) => ({
          orders: {
            ...state.orders,
            loading: false, // Ensure loading is false as the operation is aborted
            error: errorMsg,
          },
        }));
        // It's often better to throw an error or return a specific error object
        // so the calling component can handle it (e.g., display a toast).
        // For now, we'll log it and set the error state.
        console.error(errorMsg);
        // Optionally, re-throw the error if you want the promise to be rejected
        throw new Error(errorMsg);
        // Or return an object indicating failure:
        // return { success: false, error: errorMsg };
      }

      set((state) => ({
        orders: { ...state.orders, loading: true, error: null },
      }));

      try {
        const response = await adminApi.post(
          `/admin/users/${userId}/orders/${orderId}/assign-partner/`,
          {
            partner_id: partnerId,
          }
        );

        if (response.data.message || response.status === 200) {
          // Update the order in the list with the assigned partner info
          set((state) => {
            const updatedList = state.orders.list.map((order) =>
              order.order_id === orderId
                ? {
                    ...order,
                    assigned_partner_id: partnerId,
                    delivery_status: "assigned",
                    status: "assigned", // Update main status as well
                  }
                : order
            );

            const statusCounts = getStatusCounts(updatedList);

            return {
              orders: {
                list: updatedList,
                statusCounts,
                loading: false,
                error: null,
              },
            };
          });

          return response.data; // Or return { success: true, data: response.data }
        }
        // It might be good to handle cases where response.status is not 200 but also not an error
        // For example, if the API could return other success codes or specific non-error messages.
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Failed to assign delivery partner";
        set((state) => ({
          orders: {
            ...state.orders,
            loading: false,
            error: errorMessage,
          },
        }));
        console.error("Error in assignOrderToDeliveryPartner:", error);
        throw error; // Re-throw the error so the calling component can catch it
        // Or return { success: false, error: errorMessage };
      }
    },

    // Products actions
    fetchProducts: async () => {
      set((state) => ({
        products: {
          ...state.products,
          loading: true,
          error: null,
        },
      }));

      try {
        const response = await adminApi.get("/admin/get_all_products");
        const products = response.data.products;

        set({
          products: {
            list: products,
            loading: false,
            error: null,
          },
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

    updateProduct: async (productId, productData) => {
      set((state) => ({
        products: {
          ...state.products,
          loading: true,
          error: null,
        },
      }));

      try {
        // This is a placeholder - you'll need to add the actual API endpoint for updating products
        const response = await adminApi.post("/admin/update_product", {
          product_id: productId,
          ...productData,
        });

        if (response.data.success) {
          // Update the product in the list
          set((state) => {
            const updatedList = state.products.list.map((product) =>
              product.id === productId
                ? { ...product, ...productData }
                : product
            );

            return {
              products: {
                list: updatedList,
                loading: false,
                error: null,
              },
            };
          });
        }
      } catch (error) {
        set((state) => ({
          products: {
            ...state.products,
            loading: false,
            error: error.response?.data?.error || "Failed to update product",
          },
        }));
      }
    },

    addProduct: async (productData) => {
      set((state) => ({
        products: {
          ...state.products,
          loading: true,
          error: null,
        },
      }));

      try {
        // This is a placeholder - you'll need to add the actual API endpoint for adding products
        const response = await adminApi.post("/admin/add_product", productData);

        if (response.data.success) {
          // Add the new product to the list
          set((state) => ({
            products: {
              list: [...state.products.list, response.data.product],
              loading: false,
              error: null,
            },
          }));
        }
      } catch (error) {
        set((state) => ({
          products: {
            ...state.products,
            loading: false,
            error: error.response?.data?.error || "Failed to add product",
          },
        }));
      }
    },

    deleteProduct: async (productId) => {
      set((state) => ({
        products: {
          ...state.products,
          loading: true,
          error: null,
        },
      }));

      try {
        // This is a placeholder - you'll need to add the actual API endpoint for deleting products
        const response = await adminApi.delete(
          `/admin/delete_product/${productId}`
        );

        if (response.data.success) {
          // Remove the product from the list
          set((state) => ({
            products: {
              list: state.products.list.filter(
                (product) => product.id !== productId
              ),
              loading: false,
              error: null,
            },
          }));
        }
      } catch (error) {
        set((state) => ({
          products: {
            ...state.products,
            loading: false,
            error: error.response?.data?.error || "Failed to delete product",
          },
        }));
      }
    },

    // Users actions
    fetchUsers: async () => {
      set((state) => ({
        users: { ...state.users, loading: true, error: null },
      }));

      try {
        const response = await adminApi.get("/admin/get_all_users");
        const users = response.data.users;
        const statusCounts = getStatusCounts(users, "status");

        set({
          users: {
            list: users,
            statusCounts,
            loading: false,
            error: null,
          },
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
    updateUserStatus: async (userId) => {
      set((state) => ({
        users: { ...state.users, loading: true, error: null },
      }));

      try {
        // Use the ban_user API endpoint to toggle user ban status
        const response = await adminApi.patch(`/admin/users/ban/${userId}/`);

        if (response.data.message) {
          set((state) => {
            const updatedList = state.users.list.map((user) =>
              user.id === userId
                ? {
                    ...user,
                    is_banned: response.data.is_banned,
                    status: response.data.is_banned ? "banned" : "active",
                  }
                : user
            );

            const statusCounts = getStatusCounts(updatedList, "status");

            return {
              users: {
                list: updatedList,
                statusCounts,
                loading: false,
                error: null,
              },
            };
          });
        }
      } catch (error) {
        set((state) => ({
          users: {
            ...state.users,
            loading: false,
            error:
              error.response?.data?.error || "Failed to update user status",
          },
        }));
      }
    },

    updateUserRole: async (userId, role) => {
      set((state) => ({
        users: { ...state.users, loading: true, error: null },
      }));

      try {
        // This is a placeholder - you'll need to add the actual API endpoint for updating user role
        const response = await adminApi.post("/admin/update_user_role", {
          user_id: userId,
          role: role,
        });

        if (response.data.success) {
          set((state) => {
            const updatedList = state.users.list.map((user) =>
              user.id === userId ? { ...user, role } : user
            );

            return {
              users: {
                ...state.users,
                list: updatedList,
                loading: false,
                error: null,
              },
            };
          });
        }
      } catch (error) {
        set((state) => ({
          users: {
            ...state.users,
            loading: false,
            error: error.response?.data?.error || "Failed to update user role",
          },
        }));
      }
    },

    // Returns actions
    fetchReturns: async () => {
      set((state) => ({ returns: { ...state.returns, loading: true } }));

      // For now, keep the mock returns data until you have a real API endpoint
      const mockReturns = [
        {
          id: "RET-001",
          orderId: "ORD-12345",
          customer: "John Smith",
          requestDate: "2023-05-10",
          status: "pending",
          refundAmount: 49.99,
        },
        {
          id: "RET-002",
          orderId: "ORD-12346",
          customer: "Jane Doe",
          requestDate: "2023-05-12",
          status: "approved",
          refundAmount: 89.99,
        },
        {
          id: "RET-003",
          orderId: "ORD-12347",
          customer: "Mike Johnson",
          requestDate: "2023-05-15",
          status: "rejected",
          refundAmount: 159.97,
        },
      ];

      const returns = mockReturns;
      const statusCounts = getStatusCounts(returns);

      set({
        returns: {
          list: returns,
          statusCounts,
          loading: false,
        },
      });
    },

    updateReturnStatus: async (returnId, status) => {
      set((state) => ({ returns: { ...state.returns, loading: true } }));

      // For now, this is still using mocked data
      set((state) => {
        const updatedList = state.returns.list.map((returnItem) =>
          returnItem.id === returnId ? { ...returnItem, status } : returnItem
        );

        const statusCounts = getStatusCounts(updatedList);

        return {
          returns: {
            list: updatedList,
            statusCounts,
            loading: false,
          },
        };
      });
    },

    // Delivery Partners actions
    fetchDeliveryPartners: async () => {
      set((state) => ({
        deliveryPartners: {
          ...state.deliveryPartners,
          loading: true,
          error: null,
        },
      }));

      try {
        // API call to get all delivery partners
        const response = await adminApi.get("/partners/all/");

        set({
          deliveryPartners: {
            list: response.data.partners,
            loading: false,
            error: null,
          },
        });
        return response.data.partners;
      } catch (error) {
        set((state) => ({
          deliveryPartners: {
            ...state.deliveryPartners,
            loading: false,
            error:
              error.response?.data?.error ||
              "Failed to fetch delivery partners",
          },
        }));
        throw error;
      }
    },

    verifyDeliveryPartner: async (partnerId) => {
      set((state) => ({
        deliveryPartners: {
          ...state.deliveryPartners,
          loading: true,
          error: null,
        },
      }));

      try {
        // API call to verify a delivery partner
        const response = await adminApi.patch(
          `/partners/verify/${partnerId}/`,
          {}
        ); // Update the partner in the list
        set((state) => {
          const updatedList = state.deliveryPartners.list.map((partner) =>
            partner.partner_id === partnerId
              ? { ...partner, is_verified: true }
              : partner
          );

          return {
            deliveryPartners: {
              list: updatedList,
              loading: false,
              error: null,
            },
          };
        });

        return response.data;
      } catch (error) {
        set((state) => ({
          deliveryPartners: {
            ...state.deliveryPartners,
            loading: false,
            error:
              error.response?.data?.error ||
              "Failed to verify delivery partner",
          },
        }));
        throw error;
      }
    },

    assignDeliveryPartner: async (orderId, partnerId) => {
      set((state) => ({
        deliveryPartners: {
          ...state.deliveryPartners,
          loading: true,
          error: null,
        },
      }));

      try {
        // API call to assign a delivery partner to an order
        const response = await adminApi.post(
          "/admin/assign_delivery_partner/",
          {
            order_id: orderId,
            partner_id: partnerId,
          }
        );

        // Refresh the orders list to reflect changes
        await useAdminStore.getState().fetchOrders();

        set((state) => ({
          deliveryPartners: {
            ...state.deliveryPartners,
            loading: false,
          },
        }));

        return response.data;
      } catch (error) {
        set((state) => ({
          deliveryPartners: {
            ...state.deliveryPartners,
            loading: false,
            error:
              error.response?.data?.error ||
              "Failed to assign delivery partner",
          },
        }));
        throw error;
      }
    },
  }))
);

export default useAdminStore;
