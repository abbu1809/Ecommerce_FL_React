import React from 'react';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiPercent,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi';

const BusinessAnalyticsWidget = ({ analytics }) => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      change: analytics.totalRevenueChange,
      icon: <FiDollarSign size={24} />,
      color: '#f59e0b'
    },
    {
      title: 'Net Revenue',
      value: `$${analytics.netRevenue.toLocaleString()}`,
      change: analytics.netRevenueChange,
      icon: <FiBarChart2 size={24} />,
      color: '#10b981'
    },
    {
      title: 'Gross Profit',
      value: `$${analytics.grossProfit.toLocaleString()}`,
      change: analytics.grossProfitChange,
      icon: <FiTrendingUp size={24} />,
      color: '#3b82f6'
    },
    {
      title: 'Operating Costs',
      value: `$${analytics.operatingCosts.toLocaleString()}`,
      change: analytics.operatingCostsChange,
      icon: <FiPieChart size={24} />,
      color: '#ef4444'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      change: analytics.conversionRateChange,
      icon: <FiPercent size={24} />,
      color: '#8b5cf6'
    },
    {
      title: 'Avg Order Value',
      value: `$${analytics.averageOrderValue}`,
      change: analytics.averageOrderValueChange,
      icon: <FiDollarSign size={24} />,
      color: '#f59e0b'
    },
    {
      title: 'Return Rate',
      value: `${analytics.returnRate}%`,
      change: analytics.returnRateChange,
      icon: <FiTrendingDown size={24} />,
      color: '#ef4444'
    },
    {
      title: 'Customer Acq. Cost',
      value: `$${analytics.customerAcquisitionCost}`,
      change: analytics.customerAcquisitionCostChange,
      icon: <FiDollarSign size={24} />,
      color: '#06b6d4'
    }
  ];

  const MetricCard = ({ title, value, change, icon, color }) => {
    const isPositive = change.startsWith('+');
    const isNegative = change.startsWith('-');
    const isGoodChange = (title.includes('Cost') || title.includes('Return')) ? isNegative : isPositive;

    return (
      <div 
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--rounded-lg)',
          boxShadow: 'var(--shadow-small)'
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div 
            className="p-2 rounded-lg"
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
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {value}
          </p>
        </div>
      </div>
    );
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
        <h2 
          className="text-lg font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Business Analytics
        </h2>
        <div 
          className="text-sm"
          style={{ color: 'var(--text-secondary)' }}
        >
          Last 30 days
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default BusinessAnalyticsWidget;
