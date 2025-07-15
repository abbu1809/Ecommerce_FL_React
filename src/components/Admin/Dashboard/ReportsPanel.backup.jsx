import React, { useState } from 'react';
import { 
  FiFileText, 
  FiDownload, 
  FiCalendar,
  FiFilter,
  FiBarChart2,
  FiPieChart,
  FiTrendingUp,
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiGift,
  FiDollarSign,
  FiEye
} from 'react-icons/fi';

const ReportsPanel = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportCategories = [
    {
      title: 'Financial Reports',
      reports: [
        {
          id: 'revenue',
          title: 'Revenue Report',
          description: 'Provides a broad overview of the financial status of a store.',
          details: 'Reports gross revenue, refunds, the value of coupons used, taxes collected, shipping costs, and net revenue for a selected date range',
          icon: <FiDollarSign size={20} />,
          color: '#10b981',
          estimatedTime: '2-3 minutes'
        },
        {
          id: 'tax',
          title: 'Tax Report',
          description: 'Compares tax report data by different tax codes',
          details: 'Compares multiple tax codes, and displays data on how much tax was collected for orders and shipping',
          icon: <FiFileText size={20} />,
          color: '#6b7280',
          estimatedTime: '1-2 minutes'
        }
      ]
    },
    {
      title: 'Sales & Orders',
      reports: [
        {
          id: 'orders',
          title: 'Orders Report',
          description: 'Reports the total number of orders, net revenue, the average order value.',
          details: 'Reports the total number of orders, net revenue, the average order value, and the average number of items per order for a selected date range',
          icon: <FiShoppingBag size={20} />,
          color: '#3b82f6',
          estimatedTime: '2-3 minutes'
        },
        {
          id: 'order-detailed',
          title: 'Detailed Order Report',
          description: 'Filters order data for a given time period by order status.',
          details: 'Filters order data for a given time period by order status (i.e., pending and complete), product (orders with or without certain products), coupon codes (coupon codes were/were not used on orders), and new and returning customers.',
          icon: <FiBarChart2 size={20} />,
          color: '#8b5cf6',
          estimatedTime: '3-4 minutes'
        }
      ]
    },
    {
      title: 'Product Analytics',
      reports: [
        {
          id: 'product',
          title: 'Product Report',
          description: 'Displays and compares sales information for a given time period by product',
          details: 'Comprehensive product performance analysis including sales, revenue, and trends',
          icon: <FiPackage size={20} />,
          color: '#f59e0b',
          estimatedTime: '3-5 minutes'
        },
        {
          id: 'stock',
          title: 'Stock Report',
          description: 'Displays the store\'s entire product catalog by stock status.',
          details: 'Displays the store\'s entire product catalog by products that are in stock, low stock, and out of stock.',
          icon: <FiBarChart2 size={20} />,
          color: '#ef4444',
          estimatedTime: '2-3 minutes'
        },
        {
          id: 'product-comparison',
          title: 'Product Comparison Report',
          description: 'Performs highly customized analysis of sales data.',
          details: 'Performs highly customized analysis of sales data by comparing the performance of different product/s and variation/s over a specified date range.',
          icon: <FiTrendingUp size={20} />,
          color: '#06b6d4',
          estimatedTime: '4-6 minutes'
        },
        {
          id: 'category',
          title: 'Category Report',
          description: 'Filters by all categories, single category, category comparison.',
          details: 'Filters by all categories, a single category, category comparison, viewing top categories by items sold, and top categories by net revenue.',
          icon: <FiPieChart size={20} />,
          color: '#8b5cf6',
          estimatedTime: '3-4 minutes'
        }
      ]
    },
    {
      title: 'Customer Analytics',
      reports: [
        {
          id: 'customers',
          title: 'Customers Report',
          description: 'Displays Customer Data: Name, Sign Up date, Email, number of Orders.',
          details: 'Displays Customer Data: Name, Sign Up date, Email, number of Orders, Lifetime Spend, Average Order Value, Last Purchase Date, and Country. Provides a look into all customer data for a store, listing all registered and unregistered customers along with pertinent data about each customer such as email address, number of orders, lifetime spend, and average order value.',
          icon: <FiUsers size={20} />,
          color: '#10b981',
          estimatedTime: '3-5 minutes'
        }
      ]
    },
    {
      title: 'Marketing & Promotions',
      reports: [
        {
          id: 'coupons',
          title: 'Coupons Report',
          description: 'Compares multiple coupon codes to display usage and discounts.',
          details: 'Compares multiple coupon codes to display how many orders used coupons and the total amount discounted. Uses advanced filters to compare coupons, and a few preset filters to displays Top Coupons by Discounted Orders or Amount Discounted using preset filters',
          icon: <FiGift size={20} />,
          color: '#f59e0b',
          estimatedTime: '2-3 minutes'
        }
      ]
    },
    {
      title: 'System Reports',
      reports: [
        {
          id: 'downloads',
          title: 'Downloads Report',
          description: 'Allows filtering of Downloads by product, username, order number.',
          details: 'Allows filtering of Downloads by product, username, order number, and IP address',
          icon: <FiDownload size={20} />,
          color: '#6b7280',
          estimatedTime: '1-2 minutes'
        }
      ]
    }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last90days', label: 'Last 90 Days' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'thisYear', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleGenerateReport = async (reportId) => {
    setIsGenerating(true);
    setSelectedReport(reportId);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    
    // In a real app, this would trigger the actual report generation and download
    alert(`${reportCategories.flatMap(cat => cat.reports).find(r => r.id === reportId)?.title} has been generated and is ready for download!`);
  };

  const ReportCard = ({ report }) => (
    <div 
      className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--rounded-lg)',
        boxShadow: 'var(--shadow-small)'
      }}
      onClick={() => handleGenerateReport(report.id)}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="p-3 rounded-lg group-hover:scale-110 transition-transform duration-200"
          style={{
            backgroundColor: `${report.color}15`,
            color: report.color
          }}
        >
          {report.icon}
        </div>
        <div 
          className="text-xs px-2 py-1 rounded-full bg-gray-100"
          style={{ color: 'var(--text-secondary)' }}
        >
          {report.estimatedTime}
        </div>
      </div>

      <h3 
        className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors"
        style={{ color: 'var(--text-primary)' }}
      >
        {report.title}
      </h3>
      
      <p 
        className="text-sm mb-3 line-clamp-2"
        style={{ color: 'var(--text-secondary)' }}
      >
        {report.description}
      </p>
      
      <p 
        className="text-xs mb-4 line-clamp-3"
        style={{ color: 'var(--text-secondary)' }}
      >
        {report.details}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <FiEye size={12} />
          <span>View Details</span>
        </div>
        
        <button
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            isGenerating && selectedReport === report.id
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          }`}
          disabled={isGenerating && selectedReport === report.id}
        >
          {isGenerating && selectedReport === report.id ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <FiDownload size={14} />
              <span>Generate</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--rounded-lg)',
        boxShadow: 'var(--shadow-medium)'
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 
            className="text-xl font-bold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Reports Dashboard
          </h2>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Generate comprehensive business reports and analytics
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <FiCalendar size={16} style={{ color: 'var(--text-secondary)' }} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                borderColor: 'var(--border-primary)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="space-y-8">
        {reportCategories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h3 
              className="text-lg font-semibold mb-4 flex items-center"
              style={{ color: 'var(--text-primary)' }}
            >
              <div 
                className="w-1 h-6 rounded-full mr-3"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              ></div>
              {category.title}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div 
        className="mt-8 p-4 bg-gray-50 rounded-lg"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <h4 
          className="font-semibold mb-3"
          style={{ color: 'var(--text-primary)' }}
        >
          Quick Actions
        </h4>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
            <FiBarChart2 size={14} />
            <span>Schedule Reports</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
            <FiDownload size={14} />
            <span>Export All Data</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
            <FiFilter size={14} />
            <span>Custom Report Builder</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPanel;
