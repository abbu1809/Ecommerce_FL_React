import React from 'react';
import { 
  FiUsers, 
  FiTruck, 
  FiUserPlus, 
  FiActivity,
  FiTrendingUp,
  FiCalendar,
  FiClock,
  FiStar
} from 'react-icons/fi';

const UserOverviewWidget = ({ overview }) => {
  // Handle null/undefined overview data with comprehensive fallbacks
  const safeOverview = overview || {};
  
  // Extract data with fallbacks for all possible null/undefined values
  const totalCustomers = safeOverview.totalCustomers || safeOverview.total_customers || 0;
  const totalCustomersChange = safeOverview.totalCustomersChange || safeOverview.total_customers_change || '+0%';
  const activeCustomers = safeOverview.activeCustomers || safeOverview.active_customers || 0;
  const activeCustomersChange = safeOverview.activeCustomersChange || safeOverview.active_customers_change || '+0%';
  const totalDeliveryMen = safeOverview.totalDeliveryMen || safeOverview.total_delivery_men || 0;
  const totalDeliveryMenChange = safeOverview.totalDeliveryMenChange || safeOverview.total_delivery_men_change || '+0%';
  const activeDeliveryMen = safeOverview.activeDeliveryMen || safeOverview.active_delivery_men || 0;
  const activeDeliveryMenChange = safeOverview.activeDeliveryMenChange || safeOverview.active_delivery_men_change || '+0%';
  const newCustomersToday = safeOverview.newCustomersToday || safeOverview.new_customers_today || 0;
  const newCustomersThisWeek = safeOverview.newCustomersThisWeek || safeOverview.new_customers_this_week || 0;
  const newCustomersThisMonth = safeOverview.newCustomersThisMonth || safeOverview.new_customers_this_month || 0;
  const averageCustomerLifetimeValue = safeOverview.averageCustomerLifetimeValue || safeOverview.average_customer_lifetime_value || '0';
  const customerRetentionRate = safeOverview.customerRetentionRate || safeOverview.customer_retention_rate || '0';

  const customerMetrics = [
    {
      title: 'Total Customers',
      value: totalCustomers.toLocaleString(),
      change: totalCustomersChange,
      icon: <FiUsers size={24} />,
      color: '#3b82f6',
      subtitle: 'Registered users'
    },
    {
      title: 'Active Customers',
      value: activeCustomers.toLocaleString(),
      change: activeCustomersChange,
      icon: <FiActivity size={24} />,
      color: '#10b981',
      subtitle: 'Active this month'
    },
    {
      title: 'Total Delivery Men',
      value: totalDeliveryMen.toString(),
      change: totalDeliveryMenChange,
      icon: <FiTruck size={24} />,
      color: '#f59e0b',
      subtitle: 'In our network'
    },
    {
      title: 'Active Delivery Men',
      value: activeDeliveryMen.toString(),
      change: activeDeliveryMenChange,
      icon: <FiActivity size={24} />,
      color: '#8b5cf6',
      subtitle: 'Currently active'
    }
  ];

  const growthMetrics = [
    {
      label: 'New Today',
      value: newCustomersToday,
      icon: <FiUserPlus size={16} />,
      color: '#10b981'
    },
    {
      label: 'This Week',
      value: newCustomersThisWeek,
      icon: <FiCalendar size={16} />,
      color: '#3b82f6'
    },
    {
      label: 'This Month',
      value: newCustomersThisMonth,
      icon: <FiTrendingUp size={16} />,
      color: '#f59e0b'
    }
  ];

  const UserCard = ({ title, value, change, icon, color, subtitle }) => {
    const isPositive = change.startsWith('+');

    return (
      <div 
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--rounded-lg)',
          boxShadow: 'var(--shadow-small)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div 
            className="p-3 rounded-lg group-hover:scale-110 transition-transform duration-200"
            style={{
              backgroundColor: `${color}15`,
              color: color
            }}
          >
            {icon}
          </div>
          <div 
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
            className="text-3xl font-bold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {value}
          </p>
          <p 
            className="text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    );
  };

  const GrowthIndicator = ({ label, value, icon, color }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <div style={{ color }}>
          {icon}
        </div>
        <span 
          className="text-sm font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </span>
      </div>
      <span 
        className="text-lg font-bold"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </span>
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 
            className="text-lg font-semibold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            User Overview
          </h2>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Customer and delivery personnel statistics
          </p>
        </div>
      </div>
      
      {/* Main User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {customerMetrics.map((metric, index) => (
          <UserCard key={index} {...metric} />
        ))}
      </div>

      {/* Growth Metrics & Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Customer Growth */}
        <div 
          className="bg-gray-50 p-4 rounded-lg"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <h3 
            className="text-sm font-semibold mb-3 flex items-center"
            style={{ color: 'var(--text-primary)' }}
          >
            <FiUserPlus className="mr-2" size={16} />
            New Customer Growth
          </h3>
          <div className="space-y-2">
            {growthMetrics.map((metric, index) => (
              <GrowthIndicator key={index} {...metric} />
            ))}
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div 
          className="bg-gray-50 p-4 rounded-lg"
          style={{ backgroundColor: 'var(--bg-secondary)' }}
        >
          <h3 
            className="text-sm font-semibold mb-3 flex items-center"
            style={{ color: 'var(--text-primary)' }}
          >
            <FiStar className="mr-2" size={16} />
            Key Metrics
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span 
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Customer Lifetime Value
              </span>
              <span 
                className="font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                ${averageCustomerLifetimeValue}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span 
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Retention Rate
              </span>
              <span 
                className="font-bold text-green-600"
              >
                {customerRetentionRate}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span 
                className="text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                Delivery Coverage
              </span>
              <span 
                className="font-bold text-blue-600"
              >
                {Math.round((activeDeliveryMen / Math.max(totalDeliveryMen, 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverviewWidget;
