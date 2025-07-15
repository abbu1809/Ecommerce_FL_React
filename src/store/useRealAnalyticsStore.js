import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/admin';

// Create axios instance with auth token
const createAxiosInstance = () => {
  const token = localStorage.getItem('admin_auth_token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
};

const useRealAnalyticsStore = create()(
  devtools(
    (set, get) => ({
      // State
      analytics: {
        businessAnalytics: null,
        orderStatistics: null,
        userOverview: null,
        mostPopularProducts: [],
        topSellingProducts: [],
        topCustomers: [],
        topDeliveryMen: []
      },
      loading: false,
      error: null,
      lastUpdated: null,
      dateRange: 'last30days',
      
      // Available date ranges
      dateRanges: [
        { value: 'today', label: 'Today' },
        { value: 'last7days', label: 'Last 7 Days' },
        { value: 'last30days', label: 'Last 30 Days' },
        { value: 'last90days', label: 'Last 90 Days' },
        { value: 'thisyear', label: 'This Year' }
      ],
      
      // Available report types
      reportTypes: [
        { value: 'revenue', label: 'Revenue Analysis', icon: '📊' },
        { value: 'orders', label: 'Order Management', icon: '📦' },
        { value: 'products', label: 'Product Performance', icon: '🛍️' },
        { value: 'customers', label: 'Customer Analytics', icon: '👥' },
        { value: 'stock', label: 'Stock Management', icon: '📋' },
        { value: 'categories', label: 'Category Analysis', icon: '📂' },
        { value: 'delivery', label: 'Delivery Analytics', icon: '🚚' },
        { value: 'taxes', label: 'Tax Reports', icon: '🧾' },
        { value: 'coupons', label: 'Coupon Performance', icon: '🎫' },
        { value: 'comparison', label: 'Comparison Analysis', icon: '📈' },
        { value: 'downloads', label: 'Download Reports', icon: '⬇️' }
      ],
      
      // Export formats
      exportFormats: [
        { value: 'csv', label: 'CSV Format' },
        { value: 'excel', label: 'Excel Format' },
        { value: 'pdf', label: 'PDF Report' }
      ],
      
      // Actions
      setDateRange: (range) => {
        set({ dateRange: range });
        get().fetchAnalytics();
      },
      
      fetchAnalytics: async () => {
        set({ loading: true, error: null });
        
        try {
          const api = createAxiosInstance();
          const response = await api.get(`/analytics/dashboard/?range=${get().dateRange}`);
          
          if (response.data.success) {
            const analyticsData = response.data.analytics || {};
            set({ 
              analytics: {
                businessAnalytics: analyticsData.businessAnalytics || null,
                orderStatistics: analyticsData.orderStatistics || null,
                userOverview: analyticsData.userOverview || null,
                mostPopularProducts: analyticsData.mostPopularProducts || [],
                topSellingProducts: analyticsData.topSellingProducts || [],
                topCustomers: analyticsData.topCustomers || [],
                topDeliveryMen: analyticsData.topDeliveryMen || []
              },
              loading: false,
              lastUpdated: new Date().toISOString(),
              error: null
            });
          } else {
            throw new Error(response.data.error || 'Failed to fetch analytics');
          }
        } catch (error) {
          console.error('Error fetching analytics:', error);
          set({ 
            error: error.response?.data?.error || error.message || 'Failed to fetch analytics',
            loading: false 
          });
        }
      },
      
      downloadReport: async (reportType, format = 'csv') => {
        try {
          const api = createAxiosInstance();
          const response = await api.get(`/analytics/download-report/`, {
            params: {
              type: reportType,
              range: get().dateRange,
              format: format
            },
            responseType: 'blob'
          });
          
          // Create download link
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          
          // Generate filename based on report type and date
          const today = new Date().toISOString().split('T')[0];
          link.setAttribute('download', `${reportType}_report_${today}.${format}`);
          
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
          
          return { success: true };
        } catch (error) {
          console.error('Error downloading report:', error);
          throw new Error(error.response?.data?.error || 'Failed to download report');
        }
      },
      
      generateCustomReport: async (config) => {
        try {
          const api = createAxiosInstance();
          const response = await api.post('/analytics/custom-report/', {
            ...config,
            range: get().dateRange
          });
          
          return response.data;
        } catch (error) {
          console.error('Error generating custom report:', error);
          throw new Error(error.response?.data?.error || 'Failed to generate custom report');
        }
      },
      
      // Utility functions
      getMetricValue: (metric) => {
        const analytics = get().analytics;
        if (!analytics) return 0;
        
        switch (metric) {
          case 'totalRevenue':
            return analytics.business_analytics?.total_revenue || 0;
          case 'totalOrders':
            return analytics.business_analytics?.total_orders || 0;
          case 'totalCustomers':
            return analytics.user_overview?.total_customers || 0;
          case 'averageOrderValue':
            return analytics.business_analytics?.average_order_value || 0;
          case 'revenueChange':
            return analytics.business_analytics?.total_revenue_change || '+0%';
          case 'ordersChange':
            return analytics.business_analytics?.total_orders_change || '+0%';
          case 'conversionRate':
            return analytics.business_analytics?.conversion_rate || 0;
          case 'returnRate':
            return analytics.business_analytics?.return_rate || 0;
          default:
            return 0;
        }
      },
      
      getTopProducts: () => {
        const analytics = get().analytics;
        return analytics?.top_products || [];
      },
      
      getTopCustomers: () => {
        const analytics = get().analytics;
        return analytics?.top_customers || [];
      },
      
      getOrderStatistics: () => {
        const analytics = get().analytics;
        return analytics?.order_statistics || {};
      },
      
      getRevenueChartData: () => {
        const analytics = get().analytics;
        return analytics?.revenue_chart_data || [];
      },
      
      getCategoryPerformance: () => {
        const analytics = get().analytics;
        return analytics?.category_performance || [];
      },
      
      // Dashboard widget data formatters
      getRevenueWidget: () => {
        const analytics = get().analytics;
        if (!analytics) return null;
        
        return {
          title: 'Total Revenue',
          value: `₹${(analytics.business_analytics?.total_revenue || 0).toLocaleString('en-IN')}`,
          change: analytics.business_analytics?.total_revenue_change || '+0%',
          trend: analytics.business_analytics?.total_revenue_change?.startsWith('+') ? 'up' : 'down',
          icon: '💰',
          color: 'text-green-600'
        };
      },
      
      getOrdersWidget: () => {
        const analytics = get().analytics;
        if (!analytics) return null;
        
        return {
          title: 'Total Orders',
          value: (analytics.business_analytics?.total_orders || 0).toLocaleString(),
          change: analytics.business_analytics?.total_orders_change || '+0%',
          trend: analytics.business_analytics?.total_orders_change?.startsWith('+') ? 'up' : 'down',
          icon: '📦',
          color: 'text-blue-600'
        };
      },
      
      getCustomersWidget: () => {
        const analytics = get().analytics;
        if (!analytics) return null;
        
        return {
          title: 'Total Customers',
          value: (analytics.user_overview?.total_customers || 0).toLocaleString(),
          change: `+${analytics.user_overview?.new_customers || 0} new`,
          trend: 'up',
          icon: '👥',
          color: 'text-purple-600'
        };
      },
      
      getAOVWidget: () => {
        const analytics = get().analytics;
        if (!analytics) return null;
        
        return {
          title: 'Average Order Value',
          value: `₹${(analytics.business_analytics?.average_order_value || 0).toLocaleString('en-IN')}`,
          change: '+2.5%', // This would need calculation
          trend: 'up',
          icon: '💳',
          color: 'text-orange-600'
        };
      },
      
      // Reset state
      reset: () => {
        set({
          analytics: null,
          loading: false,
          error: null,
          lastUpdated: null,
          dateRange: 'last30days'
        });
      },
      
      // Initialize store
      initialize: () => {
        get().fetchAnalytics();
      }
    }),
    {
      name: 'real-analytics-store',
      version: 1
    }
  )
);

export default useRealAnalyticsStore;
