import { adminApi } from './api';

export const reportsService = {
  // Generate Revenue Report
  generateRevenueReport: async (dateRange = 'last30days', format = 'json') => {
    try {
      const response = await adminApi.get(`/reports/revenue/?range=${dateRange}&format=${format}`);
      return response.data;
    } catch (error) {
      console.error('Error generating revenue report:', error);
      throw error;
    }
  },

  // Download Revenue Report as CSV
  downloadRevenueReport: async (dateRange = 'last30days') => {
    try {
      const response = await adminApi.get(`/reports/revenue/?range=${dateRange}&format=csv`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `revenue_report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error downloading revenue report:', error);
      throw error;
    }
  },

  // Generate Orders Report
  generateOrdersReport: async (dateRange = 'last30days', status = 'all', format = 'json') => {
    try {
      const response = await adminApi.get(`/reports/orders/?range=${dateRange}&status=${status}&format=${format}`);
      return response.data;
    } catch (error) {
      console.error('Error generating orders report:', error);
      throw error;
    }
  },

  // Download Orders Report as CSV
  downloadOrdersReport: async (dateRange = 'last30days', status = 'all') => {
    try {
      const response = await adminApi.get(`/reports/orders/?range=${dateRange}&status=${status}&format=csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders_report_${dateRange}_${status}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error downloading orders report:', error);
      throw error;
    }
  },

  // Generate Products Report
  generateProductsReport: async (dateRange = 'last30days', format = 'json') => {
    try {
      const response = await adminApi.get(`/reports/products/?range=${dateRange}&format=${format}`);
      return response.data;
    } catch (error) {
      console.error('Error generating products report:', error);
      throw error;
    }
  },

  // Download Products Report as CSV
  downloadProductsReport: async (dateRange = 'last30days') => {
    try {
      const response = await adminApi.get(`/reports/products/?range=${dateRange}&format=csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products_report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error downloading products report:', error);
      throw error;
    }
  },

  // Generate Customers Report
  generateCustomersReport: async (dateRange = 'last30days', format = 'json') => {
    try {
      const response = await adminApi.get(`/reports/customers/?range=${dateRange}&format=${format}`);
      return response.data;
    } catch (error) {
      console.error('Error generating customers report:', error);
      throw error;
    }
  },

  // Download Customers Report as CSV
  downloadCustomersReport: async (dateRange = 'last30days') => {
    try {
      const response = await adminApi.get(`/reports/customers/?range=${dateRange}&format=csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `customers_report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error downloading customers report:', error);
      throw error;
    }
  },

  // Generate Stock Report
  generateStockReport: async (format = 'json') => {
    try {
      const response = await adminApi.get(`/reports/stock/?format=${format}`);
      return response.data;
    } catch (error) {
      console.error('Error generating stock report:', error);
      throw error;
    }
  },

  // Download Stock Report as CSV
  downloadStockReport: async () => {
    try {
      const response = await adminApi.get(`/reports/stock/?format=csv`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stock_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error downloading stock report:', error);
      throw error;
    }
  },

  // Get available date ranges
  getDateRanges: () => [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'thismonth', label: 'This Month' },
    { value: 'lastmonth', label: 'Last Month' }
  ],

  // Get available order statuses for filtering
  getOrderStatuses: () => [
    { value: 'all', label: 'All Orders' },
    { value: 'pending_payment', label: 'Pending Payment' },
    { value: 'payment_successful', label: 'Payment Successful' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ],

  // Generate comprehensive dashboard export
  downloadDashboardReport: async (dateRange = 'last30days') => {
    try {
      // Generate all reports and combine them
      const [revenue, orders, products, customers] = await Promise.all([
        reportsService.generateRevenueReport(dateRange),
        reportsService.generateOrdersReport(dateRange),
        reportsService.generateProductsReport(dateRange),
        reportsService.generateCustomersReport(dateRange)
      ]);

      // Create comprehensive CSV
      const csvContent = [
        'COMPREHENSIVE BUSINESS REPORT',
        `Generated: ${new Date().toLocaleString()}`,
        `Period: ${revenue.period}`,
        '',
        'REVENUE SUMMARY',
        `Gross Revenue,₹${revenue.gross_revenue.toLocaleString()}`,
        `Net Revenue,₹${revenue.net_revenue.toLocaleString()}`,
        `Total Orders,${revenue.total_orders}`,
        `Average Order Value,₹${revenue.average_order_value.toLocaleString()}`,
        '',
        'ORDERS SUMMARY',
        `Total Orders,${orders.total_orders}`,
        `Order Revenue,₹${orders.net_revenue.toLocaleString()}`,
        `Average Items per Order,${orders.average_items_per_order}`,
        '',
        'PRODUCTS SUMMARY',
        `Total Products,${products.total_products}`,
        `Products with Sales,${products.products_with_sales}`,
        `Total Units Sold,${products.total_units_sold}`,
        `Products Revenue,₹${products.total_revenue.toLocaleString()}`,
        '',
        'CUSTOMERS SUMMARY',
        `Total Customers,${customers.total_customers}`,
        `Customers with Orders,${customers.customers_with_orders}`,
        `Active in Period,${customers.active_in_period}`,
        `Total Customer Value,₹${customers.total_lifetime_value.toLocaleString()}`
      ].join('\n');

      // Download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `business_report_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return true;
    } catch (error) {
      console.error('Error downloading dashboard report:', error);
      throw error;
    }
  }
};

export default reportsService;
