import React, { useState } from 'react';
import { 
  FiTruck, 
  FiStar, 
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiTrendingUp,
  FiMoreVertical,
  FiPhone,
  FiMail,
  FiMapPin
} from 'react-icons/fi';

const TopDeliveryMenWidget = ({ deliveryMen }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('totalDeliveries');
  
  const sortOptions = [
    { value: 'totalDeliveries', label: 'Total Deliveries' },
    { value: 'successRate', label: 'Success Rate' },
    { value: 'averageRating', label: 'Customer Rating' },
    { value: 'totalEarnings', label: 'Total Earnings' },
    { value: 'onTimeDeliveryRate', label: 'On-Time Rate' }
  ];

  const sortedDeliveryMen = [...deliveryMen].sort((a, b) => {
    if (sortBy === 'totalEarnings') {
      return b.totalEarnings - a.totalEarnings;
    }
    return b[sortBy] - a[sortBy];
  });

  const displayDeliveryMen = showAll ? sortedDeliveryMen : sortedDeliveryMen.slice(0, 5);

  const getRankBadge = (index) => {
    if (index === 0) return { bg: '#FFD700', text: '#B8860B', label: '🥇' };
    if (index === 1) return { bg: '#C0C0C0', text: '#708090', label: '🥈' };
    if (index === 2) return { bg: '#CD7F32', text: '#8B4513', label: '🥉' };
    return { bg: 'var(--bg-secondary)', text: 'var(--text-secondary)', label: index + 1 };
  };

  const getPerformanceColor = (rate) => {
    if (rate >= 95) return '#10b981'; // green
    if (rate >= 90) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const DeliveryManCard = ({ deliveryMan, index }) => {
    const rankBadge = getRankBadge(index);

    return (
      <div 
        className="bg-white p-6 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200 group"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--rounded-lg)',
          boxShadow: 'var(--shadow-small)'
        }}
      >
        {/* Header with Rank and Avatar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm"
              style={{ 
                backgroundColor: rankBadge.bg,
                color: rankBadge.text
              }}
            >
              {rankBadge.label}
            </div>
            
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {deliveryMan.avatar ? (
                <img 
                  src={deliveryMan.avatar} 
                  alt={deliveryMan.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiTruck size={20} style={{ color: 'var(--text-secondary)' }} />
              )}
            </div>
            
            <div>
              <h4 
                className="font-semibold text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                {deliveryMan.name}
              </h4>
              <div className="flex items-center space-x-1">
                <FiStar size={12} className="text-yellow-400" fill="currentColor" />
                <span 
                  className="text-xs font-medium"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {deliveryMan.averageRating}
                </span>
                <span 
                  className="text-xs"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  ({deliveryMan.totalDeliveries})
                </span>
              </div>
            </div>
          </div>

          <button 
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
            style={{ color: 'var(--text-secondary)' }}
          >
            <FiMoreVertical size={16} />
          </button>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div 
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {deliveryMan.thisMonthDeliveries}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              This Month
            </div>
          </div>
          
          <div className="text-center">
            <div 
              className="text-lg font-bold"
              style={{ color: getPerformanceColor(deliveryMan.successRate) }}
            >
              {deliveryMan.successRate}%
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Success Rate
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>On-Time Delivery</span>
            <span 
              className="font-medium"
              style={{ color: getPerformanceColor(deliveryMan.onTimeDeliveryRate) }}
            >
              {deliveryMan.onTimeDeliveryRate}%
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>Customer Feedback</span>
            <div className="flex items-center space-x-1">
              <FiStar size={10} className="text-yellow-400" fill="currentColor" />
              <span 
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {deliveryMan.customerFeedback}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>Total Earnings</span>
            <span 
              className="font-medium text-green-600"
            >
              ${deliveryMan.totalEarnings.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>Active Hours/Day</span>
            <span 
              className="font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {deliveryMan.activeHours}h
            </span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full bg-green-500"
            ></div>
            <span 
              className="text-xs font-medium text-green-600"
            >
              Active
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <FiClock size={10} />
            <span>Online</span>
          </div>
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
        <div>
          <h2 
            className="text-lg font-semibold mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Top Delivery Personnel
          </h2>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Best performing delivery team members
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs border rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              borderColor: 'var(--border-primary)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)'
            }}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Delivery Men List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayDeliveryMen.map((deliveryMan, index) => (
          <DeliveryManCard key={deliveryMan.id} deliveryMan={deliveryMan} index={index} />
        ))}
      </div>

      {/* Show More/Less Button */}
      {deliveryMen.length > 5 && (
        <div className="mt-6 text-center">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--brand-primary)' }}
          >
            {showAll ? 'Show Less' : `Show All ${deliveryMen.length} Delivery Personnel`}
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div 
        className="mt-6 p-4 bg-gray-50 rounded-lg"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div 
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {deliveryMen.reduce((sum, dm) => sum + dm.totalDeliveries, 0).toLocaleString()}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Total Deliveries
            </div>
          </div>
          <div>
            <div 
              className="text-lg font-bold text-green-600"
            >
              {(deliveryMen.reduce((sum, dm) => sum + dm.successRate, 0) / deliveryMen.length).toFixed(1)}%
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Avg Success Rate
            </div>
          </div>
          <div>
            <div 
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {(deliveryMen.reduce((sum, dm) => sum + dm.averageRating, 0) / deliveryMen.length).toFixed(1)}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Avg Rating
            </div>
          </div>
          <div>
            <div 
              className="text-lg font-bold text-green-600"
            >
              ${(deliveryMen.reduce((sum, dm) => sum + dm.totalEarnings, 0)).toLocaleString()}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Total Earnings
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopDeliveryMenWidget;
