import React from 'react';
import { 
  FiShoppingBag, 
  FiClock, 
  FiTruck, 
  FiCheckCircle,
  FiXCircle,
  FiRotateCcw,
  FiRefreshCw,
  FiPackage
} from 'react-icons/fi';

const OrderStatisticsWidget = ({ statistics }) => {
  // Add null safety with comprehensive default values
  const safeStatistics = statistics || {
    totalOrders: 0,
    totalOrdersChange: '+0.0%',
    pendingOrders: 0,
    pendingOrdersChange: '+0.0%',
    processingOrders: 0,
    processingOrdersChange: '+0.0%',
    shippedOrders: 0,
    shippedOrdersChange: '+0.0%',
    deliveredOrders: 0,
    deliveredOrdersChange: '+0.0%',
    cancelledOrders: 0,
    cancelledOrdersChange: '+0.0%',
    returnedOrders: 0,
    returnedOrdersChange: '+0.0%',
    refundedOrders: 0,
    refundedOrdersChange: '+0.0%'
  };

  const orderMetrics = [
    {
      title: 'Total Orders',
      value: (safeStatistics.totalOrders || 0).toLocaleString(),
      change: safeStatistics.totalOrdersChange || '+0.0%',
      icon: <FiShoppingBag size={20} />,
      color: 'var(--brand-primary)',
      description: 'All orders placed'
    },
    {
      title: 'Pending',
      value: (safeStatistics.pendingOrders || 0).toString(),
      change: safeStatistics.pendingOrdersChange || '+0.0%',
      icon: <FiClock size={20} />,
      color: 'var(--warning-color)',
      description: 'Awaiting processing'
    },
    {
      title: 'Processing',
      value: (safeStatistics.processingOrders || 0).toString(),
      change: safeStatistics.processingOrdersChange || '+0.0%',
      icon: <FiRefreshCw size={20} />,
      color: 'var(--brand-secondary)',
      description: 'Being prepared'
    },
    {
      title: 'Shipped',
      value: (safeStatistics.shippedOrders || 0).toString(),
      change: safeStatistics.shippedOrdersChange || '+0.0%',
      icon: <FiTruck size={20} />,
      color: 'var(--accent-color)',
      description: 'On the way'
    },
    {
      title: 'Delivered',
      value: (safeStatistics.deliveredOrders || 0).toString(),
      change: safeStatistics.deliveredOrdersChange || '+0.0%',
      icon: <FiCheckCircle size={20} />,
      color: 'var(--success-color)',
      description: 'Successfully delivered'
    },
    {
      title: 'Cancelled',
      value: (safeStatistics.cancelledOrders || 0).toString(),
      change: safeStatistics.cancelledOrdersChange || '+0.0%',
      icon: <FiXCircle size={20} />,
      color: 'var(--error-color)',
      description: 'Cancelled by customer'
    },
    {
      title: 'Returned',
      value: (safeStatistics.returnedOrders || 0).toString(),
      change: safeStatistics.returnedOrdersChange || '+0.0%',
      icon: <FiRotateCcw size={20} />,
      color: 'var(--warning-color)',
      description: 'Returned items'
    },
    {
      title: 'Refunded',
      value: (safeStatistics.refundedOrders || 0).toString(),
      change: safeStatistics.refundedOrdersChange || '+0.0%',
      icon: <FiPackage size={20} />,
      color: 'var(--text-secondary)',
      description: 'Refund processed'
    }
  ];

  const StatusCard = ({ title, value, change, icon, color, description }) => {
    const isPositive = change.startsWith('+');
    const isNegative = change.startsWith('-');
    // For negative metrics (cancelled, returned, refunded), negative change is good
    const isGoodChange = (title === 'Cancelled' || title === 'Returned' || title === 'Refunded') 
      ? isNegative 
      : isPositive;

    return (
      <div 
        className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--rounded-lg)',
          boxShadow: 'var(--shadow-small)'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div 
            className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-200"
            style={{
              backgroundColor: `${color}15`,
              color: color
            }}
          >
            {icon}
          </div>
          <div 
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isGoodChange ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {change}
          </div>
        </div>
        
        <div>
          <h3 
            className="text-sm font-medium mb-1"
            style={{ color: 'var(--text-secondary)' }}
          >
            {title}
          </h3>
          <p 
            className="text-2xl font-bold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {value}
          </p>
          <p 
            className="text-xs opacity-75"
            style={{ color: 'var(--text-secondary)' }}
          >
            {description}
          </p>
        </div>
      </div>
    );
  };

  // Calculate percentages for the summary
  const totalOrders = safeStatistics.totalOrders || 1; // Avoid division by zero
  const getPercentage = (value) => {
    const safeValue = value || 0;
    return ((safeValue / totalOrders) * 100).toFixed(1);
  };

  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: 'var(--rounded-lg)',
        boxShadow: 'var(--shadow-medium)'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 
            className="text-lg font-semibold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Order Statistics
          </h2>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Overview of all order statuses and trends
          </p>
        </div>
        <div 
          className="text-right"
          style={{ color: 'var(--text-secondary)' }}
        >
          <div className="text-xs">Success Rate</div>
          <div className="text-lg font-bold" style={{ color: 'var(--success-color)' }}>
            {getPercentage(safeStatistics.deliveredOrders)}%
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {orderMetrics.map((metric, index) => (
          <StatusCard key={index} {...metric} />
        ))}
      </div>

      {/* Quick Summary Bar */}
      <div 
        className="bg-gray-50 p-4 rounded-lg"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span style={{ color: 'var(--text-secondary)' }}>
                Completed: {getPercentage(safeStatistics.deliveredOrders)}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span style={{ color: 'var(--text-secondary)' }}>
                In Progress: {getPercentage((safeStatistics.processingOrders || 0) + (safeStatistics.shippedOrders || 0))}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span style={{ color: 'var(--text-secondary)' }}>
                Issues: {getPercentage((safeStatistics.cancelledOrders || 0) + (safeStatistics.returnedOrders || 0))}%
              </span>
            </div>
          </div>
          <div 
            className="text-xs font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Last 30 days
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatisticsWidget;
