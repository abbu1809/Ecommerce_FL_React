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
  const customerMetrics = [
    {
      title: 'Total Customers',
      value: overview.totalCustomers.toLocaleString(),
      change: overview.totalCustomersChange,
      icon: <FiUsers size={24} />,
      color: '#3b82f6',
      subtitle: 'Registered users'
    },
    {
      title: 'Active Customers',
      value: overview.activeCustomers.toLocaleString(),
      change: overview.activeCustomersChange,
      icon: <FiActivity size={24} />,
      color: '#10b981',
      subtitle: 'Active this month'
    },
    {
      title: 'Total Delivery Men',
      value: overview.totalDeliveryMen.toString(),
      change: overview.totalDeliveryMenChange,
      icon: <FiTruck size={24} />,
      color: '#f59e0b',
      subtitle: 'In our network'
    },
    {
      title: 'Active Delivery Men',
      value: overview.activeDeliveryMen.toString(),
      change: overview.activeDeliveryMenChange,
      icon: <FiActivity size={24} />,
      color: '#8b5cf6',
      subtitle: 'Currently active'
    }
  ];

  const growthMetrics = [
    {
      label: 'New Today',
      value: overview.newCustomersToday,
      icon: <FiUserPlus size={16} />,
      color: '#10b981'
    },
    {
      label: 'This Week',
      value: overview.newCustomersThisWeek,
      icon: <FiCalendar size={16} />,
      color: '#3b82f6'
    },
    {
      label: 'This Month',
      value: overview.newCustomersThisMonth,
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
                ${overview.averageCustomerLifetimeValue}
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
                {overview.customerRetentionRate}%
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
                {Math.round((overview.activeDeliveryMen / overview.totalDeliveryMen) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOverviewWidget;
