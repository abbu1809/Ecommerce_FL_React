import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Simulated API call
const simulateApiCall = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

// Initial mock data
const mockOrders = [
  {
    id: "ORD-12345",
    date: "2023-05-15",
    customer: "John Smith",
    total: 129.99,
    status: "delivered",
    items: 3,
  },
  {
    id: "ORD-12346",
    date: "2023-05-16",
    customer: "Jane Doe",
    total: 89.99,
    status: "processing",
    items: 1,
  },
  {
    id: "ORD-12347",
    date: "2023-05-17",
    customer: "Mike Johnson",
    total: 199.98,
    status: "pending",
    items: 2,
  },
  {
    id: "ORD-12348",
    date: "2023-05-18",
    customer: "Sarah Williams",
    total: 149.95,
    status: "shipped",
    items: 3,
  },
  {
    id: "ORD-12349",
    date: "2023-05-19",
    customer: "Robert Brown",
    total: 299.99,
    status: "cancelled",
    items: 1,
  },
];

const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "customer",
    status: "active",
    orders: 12,
    totalSpent: 759.87,
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
    role: "customer",
    status: "active",
    orders: 8,
    totalSpent: 453.22,
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    orders: 0,
    totalSpent: 0,
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah@example.com",
    role: "customer",
    status: "banned",
    orders: 3,
    totalSpent: 127.99,
  },
  {
    id: 5,
    name: "Michael Johnson",
    email: "michael@example.com",
    role: "customer",
    status: "active",
    orders: 6,
    totalSpent: 372.5,
  },
];

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
    },

    // Users data
    users: {
      list: [],
      loading: false,
      statusCounts: {},
    },

    // Returns data
    returns: {
      list: [],
      loading: false,
      statusCounts: {},
    },

    // Dashboard actions
    fetchDashboardData: async () => {
      set((state) => ({ dashboard: { ...state.dashboard, loading: true } }));

      // Simulate API calls
      const stats = await simulateApiCall([
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
      ]);

      const topProducts = await simulateApiCall([
        { id: 1, name: "Smartphone X", sales: 145, revenue: 14500 },
        { id: 2, name: "Laptop Pro", sales: 98, revenue: 78400 },
        { id: 3, name: "Wireless Headphones", sales: 82, revenue: 4100 },
        { id: 4, name: "Smart Watch", sales: 65, revenue: 9750 },
        { id: 5, name: "HD Camera", sales: 49, revenue: 7350 },
      ]);

      const recentOrders = await simulateApiCall(mockOrders.slice(0, 5));

      const salesData = await simulateApiCall([
        { month: "Jan", sales: 4000 },
        { month: "Feb", sales: 6000 },
        { month: "Mar", sales: 8000 },
        { month: "Apr", sales: 7500 },
        { month: "May", sales: 12000 },
        { month: "Jun", sales: 9800 },
      ]);

      set({
        dashboard: {
          stats,
          salesData,
          topProducts,
          recentOrders,
          loading: false,
        },
      });
    },

    // Orders actions
    fetchOrders: async () => {
      set((state) => ({ orders: { ...state.orders, loading: true } }));

      const orders = await simulateApiCall(mockOrders);
      const statusCounts = getStatusCounts(orders);

      set({
        orders: {
          list: orders,
          statusCounts,
          loading: false,
        },
      });
    },

    updateOrderStatus: async (orderId, status) => {
      set((state) => ({ orders: { ...state.orders, loading: true } }));

      // Simulate API call
      await simulateApiCall({ success: true }, 500);

      set((state) => {
        const updatedList = state.orders.list.map((order) =>
          order.id === orderId ? { ...order, status } : order
        );

        const statusCounts = getStatusCounts(updatedList);

        return {
          orders: {
            list: updatedList,
            statusCounts,
            loading: false,
          },
        };
      });
    },

    // Users actions
    fetchUsers: async () => {
      set((state) => ({ users: { ...state.users, loading: true } }));

      const users = await simulateApiCall(mockUsers);
      const statusCounts = getStatusCounts(users);

      set({
        users: {
          list: users,
          statusCounts,
          loading: false,
        },
      });
    },

    updateUserStatus: async (userId, status) => {
      set((state) => ({ users: { ...state.users, loading: true } }));

      // Simulate API call
      await simulateApiCall({ success: true }, 500);

      set((state) => {
        const updatedList = state.users.list.map((user) =>
          user.id === userId ? { ...user, status } : user
        );

        const statusCounts = getStatusCounts(updatedList);

        return {
          users: {
            list: updatedList,
            statusCounts,
            loading: false,
          },
        };
      });
    },

    updateUserRole: async (userId, role) => {
      set((state) => ({ users: { ...state.users, loading: true } }));

      // Simulate API call
      await simulateApiCall({ success: true }, 500);

      set((state) => {
        const updatedList = state.users.list.map((user) =>
          user.id === userId ? { ...user, role } : user
        );

        return {
          users: {
            ...state.users,
            list: updatedList,
            loading: false,
          },
        };
      });
    },

    // Returns actions
    fetchReturns: async () => {
      set((state) => ({ returns: { ...state.returns, loading: true } }));

      const returns = await simulateApiCall(mockReturns);
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

      // Simulate API call
      await simulateApiCall({ success: true }, 500);

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
  }))
);

export default useAdminStore;
