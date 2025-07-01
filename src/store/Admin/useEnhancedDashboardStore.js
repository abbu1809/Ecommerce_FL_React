import { create } from 'zustand';

// Mock data generator for comprehensive dashboard analytics
const generateMockAnalytics = () => ({
  // Business Analytics
  businessAnalytics: {
    totalRevenue: 125430.00,
    totalRevenueChange: '+12.5%',
    netRevenue: 98750.20,
    netRevenueChange: '+8.3%',
    grossProfit: 45230.50,
    grossProfitChange: '+15.2%',
    operatingCosts: 32140.80,
    operatingCostsChange: '-2.1%',
    conversionRate: 3.2,
    conversionRateChange: '+0.4%',
    averageOrderValue: 89.50,
    averageOrderValueChange: '+7.2%',
    returnRate: 2.8,
    returnRateChange: '-0.5%',
    customerAcquisitionCost: 23.40,
    customerAcquisitionCostChange: '-12.3%'
  },

  // Order Statistics
  orderStatistics: {
    totalOrders: 1456,
    totalOrdersChange: '+18.2%',
    pendingOrders: 34,
    pendingOrdersChange: '+12.0%',
    processingOrders: 67,
    processingOrdersChange: '+8.5%',
    shippedOrders: 892,
    shippedOrdersChange: '+22.1%',
    deliveredOrders: 1278,
    deliveredOrdersChange: '+16.8%',
    cancelledOrders: 87,
    cancelledOrdersChange: '-5.2%',
    returnedOrders: 45,
    returnedOrdersChange: '-8.1%',
    refundedOrders: 23,
    refundedOrdersChange: '-15.6%'
  },

  // User Overview
  userOverview: {
    totalCustomers: 8945,
    totalCustomersChange: '+23.4%',
    newCustomersToday: 12,
    newCustomersThisWeek: 89,
    newCustomersThisMonth: 342,
    activeCustomers: 3456,
    activeCustomersChange: '+12.8%',
    totalDeliveryMen: 45,
    totalDeliveryMenChange: '+15.0%',
    activeDeliveryMen: 38,
    activeDeliveryMenChange: '+8.9%',
    averageCustomerLifetimeValue: 234.56,
    customerRetentionRate: 67.8
  },

  // Most Popular Products
  mostPopularProducts: [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      image: '/products/iphone15.jpg',
      views: 2456,
      viewsChange: '+12.3%',
      wishlistCount: 567,
      shareCount: 89,
      category: 'Smartphones',
      price: 1199.99
    },
    {
      id: 2,
      name: 'MacBook Pro 16"',
      image: '/products/macbook.jpg',
      views: 1889,
      viewsChange: '+8.7%',
      wishlistCount: 234,
      shareCount: 45,
      category: 'Laptops',
      price: 2499.99
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      image: '/products/samsung.jpg',
      views: 1456,
      viewsChange: '+15.2%',
      wishlistCount: 345,
      shareCount: 67,
      category: 'Smartphones',
      price: 1299.99
    },
    {
      id: 4,
      name: 'AirPods Pro 2',
      image: '/products/airpods.jpg',
      views: 1234,
      viewsChange: '+22.1%',
      wishlistCount: 456,
      shareCount: 78,
      category: 'Audio',
      price: 249.99
    },
    {
      id: 5,
      name: 'iPad Pro 12.9"',
      image: '/products/ipad.jpg',
      views: 1098,
      viewsChange: '+6.4%',
      wishlistCount: 189,
      shareCount: 34,
      category: 'Tablets',
      price: 1099.99
    }
  ],

  // Top Selling Products
  topSellingProducts: [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      image: '/products/iphone15.jpg',
      unitsSold: 234,
      revenue: 280566.00,
      profit: 45678.90,
      profitMargin: 16.3,
      category: 'Smartphones',
      stock: 45,
      rating: 4.8
    },
    {
      id: 2,
      name: 'AirPods Pro 2',
      image: '/products/airpods.jpg',
      unitsSold: 456,
      revenue: 113994.44,
      profit: 34567.89,
      profitMargin: 30.3,
      category: 'Audio',
      stock: 123,
      rating: 4.7
    },
    {
      id: 3,
      name: 'MacBook Pro 16"',
      image: '/products/macbook.jpg',
      unitsSold: 89,
      revenue: 222499.11,
      profit: 56789.12,
      profitMargin: 25.5,
      category: 'Laptops',
      stock: 23,
      rating: 4.9
    },
    {
      id: 4,
      name: 'Samsung Galaxy S24',
      image: '/products/samsung.jpg',
      unitsSold: 178,
      revenue: 159958.22,
      profit: 23456.78,
      profitMargin: 14.7,
      category: 'Smartphones',
      stock: 67,
      rating: 4.6
    },
    {
      id: 5,
      name: 'Gaming Headset Pro',
      image: '/products/headset.jpg',
      unitsSold: 345,
      revenue: 51750.00,
      profit: 18567.34,
      profitMargin: 35.9,
      category: 'Gaming',
      stock: 89,
      rating: 4.5
    }
  ],

  // Top Delivery Men
  topDeliveryMen: [
    {
      id: 1,
      name: 'John Smith',
      avatar: '/avatars/john.jpg',
      totalDeliveries: 234,
      successRate: 98.5,
      averageRating: 4.8,
      totalEarnings: 3456.78,
      thisMonthDeliveries: 67,
      onTimeDeliveryRate: 95.2,
      customerFeedback: 4.7,
      activeHours: 8.5
    },
    {
      id: 2,
      name: 'Mike Johnson',
      avatar: '/avatars/mike.jpg',
      totalDeliveries: 189,
      successRate: 97.2,
      averageRating: 4.6,
      totalEarnings: 2789.45,
      thisMonthDeliveries: 54,
      onTimeDeliveryRate: 92.8,
      customerFeedback: 4.5,
      activeHours: 7.8
    },
    {
      id: 3,
      name: 'David Wilson',
      avatar: '/avatars/david.jpg',
      totalDeliveries: 167,
      successRate: 96.8,
      averageRating: 4.7,
      totalEarnings: 2456.89,
      thisMonthDeliveries: 48,
      onTimeDeliveryRate: 94.1,
      customerFeedback: 4.6,
      activeHours: 8.2
    },
    {
      id: 4,
      name: 'Alex Brown',
      avatar: '/avatars/alex.jpg',
      totalDeliveries: 145,
      successRate: 95.5,
      averageRating: 4.4,
      totalEarnings: 2134.56,
      thisMonthDeliveries: 41,
      onTimeDeliveryRate: 91.7,
      customerFeedback: 4.3,
      activeHours: 7.5
    },
    {
      id: 5,
      name: 'Chris Davis',
      avatar: '/avatars/chris.jpg',
      totalDeliveries: 123,
      successRate: 94.8,
      averageRating: 4.5,
      totalEarnings: 1876.34,
      thisMonthDeliveries: 35,
      onTimeDeliveryRate: 90.3,
      customerFeedback: 4.4,
      activeHours: 6.8
    }
  ],

  // Top Customers
  topCustomers: [
    {
      id: 1,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      avatar: '/avatars/sarah.jpg',
      totalOrders: 45,
      totalSpent: 8976.54,
      averageOrderValue: 199.48,
      lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      loyaltyLevel: 'Platinum',
      signupDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365),
      favoriteCategory: 'Electronics'
    },
    {
      id: 2,
      name: 'Robert Chen',
      email: 'robert.chen@email.com',
      avatar: '/avatars/robert.jpg',
      totalOrders: 38,
      totalSpent: 7234.89,
      averageOrderValue: 190.39,
      lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
      loyaltyLevel: 'Gold',
      signupDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 298),
      favoriteCategory: 'Smartphones'
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      avatar: '/avatars/emma.jpg',
      totalOrders: 42,
      totalSpent: 6789.23,
      averageOrderValue: 161.65,
      lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      loyaltyLevel: 'Gold',
      signupDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 234),
      favoriteCategory: 'Fashion'
    },
    {
      id: 4,
      name: 'Michael Park',
      email: 'michael.park@email.com',
      avatar: '/avatars/michael.jpg',
      totalOrders: 29,
      totalSpent: 5432.17,
      averageOrderValue: 187.32,
      lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      loyaltyLevel: 'Silver',
      signupDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 156),
      favoriteCategory: 'Gaming'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa.anderson@email.com',
      avatar: '/avatars/lisa.jpg',
      totalOrders: 33,
      totalSpent: 4876.45,
      averageOrderValue: 147.77,
      lastOrderDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4),
      loyaltyLevel: 'Silver',
      signupDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 189),
      favoriteCategory: 'Home & Garden'
    }
  ],

  // Chart Data
  revenueChartData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4
      },
      {
        label: 'Profit',
        data: [8000, 12000, 9000, 16000, 14000, 19000, 18000, 22000, 20000, 25000, 24000, 28000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }
    ]
  },

  // Date range for filtering
  dateRange: {
    start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    end: new Date(),
    preset: 'last30days'
  }
});

const useEnhancedDashboardStore = create((set, get) => ({
  // Data
  analytics: generateMockAnalytics(),
  loading: false,
  error: null,
  selectedDateRange: 'last30days',
  
  // Actions
  fetchAnalytics: async () => {
    set({ loading: true, error: null });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ 
        analytics: generateMockAnalytics(),
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.message,
        loading: false 
      });
    }
  },

  updateDateRange: (range) => {
    set({ selectedDateRange: range });
    // Trigger data refresh based on new date range
    get().fetchAnalytics();
  },

  refreshData: () => {
    get().fetchAnalytics();
  },

  // Getters
  getTopPerformers: (category, limit = 5) => {
    const { analytics } = get();
    switch (category) {
      case 'products':
        return analytics.topSellingProducts.slice(0, limit);
      case 'delivery':
        return analytics.topDeliveryMen.slice(0, limit);
      case 'customers':
        return analytics.topCustomers.slice(0, limit);
      default:
        return [];
    }
  },

  getTotalRevenue: () => {
    const { analytics } = get();
    return analytics.businessAnalytics.totalRevenue;
  },

  getConversionMetrics: () => {
    const { analytics } = get();
    return {
      conversionRate: analytics.businessAnalytics.conversionRate,
      averageOrderValue: analytics.businessAnalytics.averageOrderValue,
      customerAcquisitionCost: analytics.businessAnalytics.customerAcquisitionCost
    };
  }
}));

export default useEnhancedDashboardStore;
