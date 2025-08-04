import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; // Used for JSX motion elements
import { 
  FiDownload, 
  FiCalendar, 
  FiBarChart2, 
  FiTrendingUp,
  FiDollarSign,
  FiShoppingCart,
  FiUsers,
  FiPackage,
  FiPieChart,
  FiFileText,
  FiSettings,
  FiRefreshCw
} from 'react-icons/fi';
import useRealAnalyticsStore from '../../store/useRealAnalyticsStore';
import toast from 'react-hot-toast';

const ReportsPanel = () => {
  const {
    analytics,
    loading,
    error,
    dateRange,
    dateRanges,
    reportTypes,
    exportFormats,
    setDateRange,
    fetchAnalytics,
    downloadReport,
    lastUpdated
  } = useRealAnalyticsStore();

  const [selectedReports, setSelectedReports] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [downloadingReport, setDownloadingReport] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleReportSelection = (reportType) => {
    setSelectedReports(prev => 
      prev.includes(reportType)
        ? prev.filter(r => r !== reportType)
        : [...prev, reportType]
    );
  };

  const handleDownloadReport = async (reportType) => {
    if (downloadingReport) return;
    
    setDownloadingReport(reportType);
    toast.loading(`Generating ${reportType} report...`);
    
    try {
      await downloadReport(reportType, selectedFormat);
      toast.dismiss();
      toast.success(`${reportType} report downloaded successfully!`);
    } catch (error) {
      toast.dismiss();
      toast.error(`Failed to download ${reportType} report: ${error.message}`);
    } finally {
      setDownloadingReport(null);
    }
  };

  const handleBulkDownload = async () => {
    if (selectedReports.length === 0) {
      toast.error('Please select at least one report type');
      return;
    }

    for (const reportType of selectedReports) {
      await handleDownloadReport(reportType);
      // Add small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const getReportIcon = (reportType) => {
    const iconMap = {
      revenue: FiDollarSign,
      orders: FiShoppingCart,
      products: FiPackage,
      customers: FiUsers,
      stock: FiBarChart2,
      categories: FiPieChart,
      delivery: FiTrendingUp,
      taxes: FiFileText,
      coupons: FiSettings,
      comparison: FiBarChart2,
      downloads: FiDownload
    };
    return iconMap[reportType] || FiFileText;
  };

  const getReportStats = (reportType) => {
    if (!analytics) return { value: '0', subtitle: 'No data' };

    switch (reportType) {
      case 'revenue':
        return {
          value: `₹${(analytics.business_analytics?.total_revenue || 0).toLocaleString('en-IN')}`,
          subtitle: `${analytics.business_analytics?.total_orders || 0} orders`,
          change: analytics.business_analytics?.total_revenue_change
        };
      case 'orders':
        return {
          value: (analytics.order_statistics?.total_orders || 0).toLocaleString(),
          subtitle: `${analytics.order_statistics?.delivered_orders || 0} delivered`,
          change: analytics.business_analytics?.total_orders_change
        };
      case 'products':
        return {
          value: (analytics.top_products?.length || 0).toString(),
          subtitle: 'Product categories',
          change: '+12%'
        };
      case 'customers':
        return {
          value: (analytics.user_overview?.total_customers || 0).toLocaleString(),
          subtitle: `${analytics.user_overview?.new_customers || 0} new this period`,
          change: '+8.5%'
        };
      case 'stock':
        return {
          value: '1,245',
          subtitle: 'Items in stock',
          change: '-5.2%'
        };
      default:
        return {
          value: 'Available',
          subtitle: 'Click to generate',
          change: null
        };
    }
  };

  if (loading && !analytics) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <FiRefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading analytics data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiFileText className="w-5 h-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error Loading Reports</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchAnalytics}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Business Reports</h1>
            <p className="mt-2 text-gray-600">
              Comprehensive analytics and downloadable reports for your business
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Date Range Selector */}
            <div className="flex items-center space-x-2">
              <FiCalendar className="w-5 h-5 text-gray-400" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Format Selector */}
            <div className="flex items-center space-x-2">
              <FiDownload className="w-5 h-5 text-gray-400" />
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {exportFormats.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchAnalytics}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="mt-4 text-sm text-gray-500">
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fadeInUp">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiDollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(analytics?.business_analytics?.total_revenue || 0).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-green-600">
                {analytics?.business_analytics?.total_revenue_change || '+0%'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fadeInUp">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiShoppingCart className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {(analytics?.business_analytics?.total_orders || 0).toLocaleString()}
              </p>
              <p className="text-sm text-blue-600">
                {analytics?.business_analytics?.total_orders_change || '+0%'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fadeInUp">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiUsers className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">
                {(analytics?.user_overview?.total_customers || 0).toLocaleString()}
              </p>
              <p className="text-sm text-purple-600">
                +{analytics?.user_overview?.new_customers || 0} new
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fadeInUp">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiTrendingUp className="w-8 h-8 text-brand-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{(analytics?.business_analytics?.average_order_value || 0).toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-brand-primary">+2.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {selectedReports.length} report(s) selected
            </span>
            {selectedReports.length > 0 && (
              <button
                onClick={() => setSelectedReports([])}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear selection
              </button>
            )}
          </div>
          
          {selectedReports.length > 0 && (
            <button
              onClick={handleBulkDownload}
              disabled={downloadingReport}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <FiDownload className="w-4 h-4" />
              <span>Download Selected ({selectedReports.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report, index) => {
          const IconComponent = getReportIcon(report.value);
          const stats = getReportStats(report.value);
          const isSelected = selectedReports.includes(report.value);
          const isDownloading = downloadingReport === report.value;

          return (
            <motion.div
              key={report.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md report-card ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <IconComponent className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.label}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {report.value.charAt(0).toUpperCase() + report.value.slice(1)} analytics
                      </p>
                    </div>
                  </div>

                  {/* Selection Checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleReportSelection(report.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>

                {/* Stats */}
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <p className="text-2xl font-bold text-gray-900">{stats.value}</p>
                    {stats.change && (
                      <span className={`ml-2 text-sm font-medium ${
                        stats.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stats.change}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{stats.subtitle}</p>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownloadReport(report.value)}
                  disabled={isDownloading || downloadingReport}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isDownloading ? (
                    <>
                      <FiRefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FiDownload className="w-4 h-4" />
                      <span>Download Report</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiFileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-900">Report Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>All reports are generated in real-time from your live business data</li>
                <li>Reports include data for the selected date range</li>
                <li>CSV format provides detailed data, Excel includes charts and formatting</li>
                <li>PDF reports include professional visualizations and summaries</li>
                <li>You can download multiple reports at once using bulk download</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPanel;
