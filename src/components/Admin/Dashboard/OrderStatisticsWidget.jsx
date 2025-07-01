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
  const orderMetrics = [
    {
      title: 'Total Orders',
      value: statistics.totalOrders.toLocaleString(),
      change: statistics.totalOrdersChange,
      icon: <FiShoppingBag size={20} />,
      color: '#f59e0b',
      description: 'All orders placed'
    },
    {
      title: 'Pending',
      value: statistics.pendingOrders.toString(),
      change: statistics.pendingOrdersChange,
      icon: <FiClock size={20} />,
      color: '#f59e0b',
      description: 'Awaiting processing'
    },
    {
      title: 'Processing',
      value: statistics.processingOrders.toString(),
      change: statistics.processingOrdersChange,
      icon: <FiRefreshCw size={20} />,
      color: '#3b82f6',
      description: 'Being prepared'
    },
    {
      title: 'Shipped',
      value: statistics.shippedOrders.toString(),
      change: statistics.shippedOrdersChange,
      icon: <FiTruck size={20} />,
      color: '#8b5cf6',
      description: 'On the way'
    },
    {
      title: 'Delivered',
      value: statistics.deliveredOrders.toString(),
      change: statistics.deliveredOrdersChange,
      icon: <FiCheckCircle size={20} />,
      color: '#10b981',
      description: 'Successfully delivered'
    },
    {
      title: 'Cancelled',
      value: statistics.cancelledOrders.toString(),
      change: statistics.cancelledOrdersChange,
      icon: <FiXCircle size={20} />,
      color: '#ef4444',
      description: 'Cancelled by customer'
    },
    {
      title: 'Returned',
      value: statistics.returnedOrders.toString(),
      change: statistics.returnedOrdersChange,
      icon: <FiRotateCcw size={20} />,
      color: '#f59e0b',
      description: 'Returned items'
    },
    {
      title: 'Refunded',
      value: statistics.refundedOrders.toString(),
      change: statistics.refundedOrdersChange,
      icon: <FiPackage size={20} />,
      color: '#6b7280',
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
  const totalOrders = statistics.totalOrders;
  const getPercentage = (value) => ((value / totalOrders) * 100).toFixed(1);

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
            {getPercentage(statistics.deliveredOrders)}%
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
                Completed: {getPercentage(statistics.deliveredOrders)}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span style={{ color: 'var(--text-secondary)' }}>
                In Progress: {getPercentage(statistics.processingOrders + statistics.shippedOrders)}%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span style={{ color: 'var(--text-secondary)' }}>
                Issues: {getPercentage(statistics.cancelledOrders + statistics.returnedOrders)}%
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
