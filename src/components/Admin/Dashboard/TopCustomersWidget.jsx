import React, { useState } from 'react';
import { 
  FiUsers, 
  FiDollarSign, 
  FiShoppingBag,
  FiHeart,
  FiCalendar,
  FiMoreVertical,
  FiMail,
  FiPhone,
  FiMapPin,
  FiStar,
  FiTrendingUp
} from 'react-icons/fi';

const TopCustomersWidget = ({ customers }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('totalSpent');
  
  const sortOptions = [
    { value: 'totalSpent', label: 'Total Spent' },
    { value: 'totalOrders', label: 'Total Orders' },
    { value: 'averageOrderValue', label: 'Avg Order Value' },
    { value: 'lastOrderDate', label: 'Recent Activity' }
  ];

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortBy === 'lastOrderDate') {
      return new Date(b.lastOrderDate) - new Date(a.lastOrderDate);
    }
    return b[sortBy] - a[sortBy];
  });

  const displayCustomers = showAll ? sortedCustomers : sortedCustomers.slice(0, 5);

  const getLoyaltyBadge = (level) => {
    switch (level.toLowerCase()) {
      case 'platinum':
        return { bg: '#E5E7EB', text: '#374151', icon: '💎', color: '#6B7280' };
      case 'gold':
        return { bg: '#FEF3C7', text: '#92400E', icon: '🥇', color: '#D97706' };
      case 'silver':
        return { bg: '#F3F4F6', text: '#4B5563', icon: '🥈', color: '#6B7280' };
      default:
        return { bg: '#DBEAFE', text: '#1E40AF', icon: '👤', color: '#3B82F6' };
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const CustomerCard = ({ customer, index }) => {
    const loyaltyBadge = getLoyaltyBadge(customer.loyaltyLevel);
    const isVIP = customer.totalSpent > 5000;

    return (
      <div 
        className={`bg-white p-6 rounded-lg border hover:shadow-md transition-all duration-200 group ${
          isVIP ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-white' : 'border-gray-100'
        }`}
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--rounded-lg)',
          boxShadow: 'var(--shadow-small)'
        }}
      >
        {/* Header with Rank and Customer Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Rank */}
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
              style={{
                backgroundColor: index < 3 ? 'var(--brand-primary)' : 'var(--bg-secondary)',
                color: index < 3 ? 'white' : 'var(--text-secondary)'
              }}
            >
              {index + 1}
            </div>
            
            {/* Avatar */}
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {customer.avatar ? (
                <img 
                  src={customer.avatar} 
                  alt={customer.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUsers size={20} style={{ color: 'var(--text-secondary)' }} />
              )}
            </div>
            
            {/* Customer Basic Info */}
            <div>
              <div className="flex items-center space-x-2">
                <h4 
                  className="font-semibold text-sm"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {customer.name}
                </h4>
                {isVIP && <FiStar className="text-yellow-500" size={14} />}
              </div>
              <p 
                className="text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                {customer.email}
              </p>
            </div>
          </div>

          {/* Loyalty Badge */}
          <div 
            className="px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
            style={{ 
              backgroundColor: loyaltyBadge.bg,
              color: loyaltyBadge.text
            }}
          >
            <span>{loyaltyBadge.icon}</span>
            <span>{customer.loyaltyLevel}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div 
              className="text-xl font-bold text-green-600"
            >
              ${customer.totalSpent.toLocaleString()}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Total Spent
            </div>
          </div>
          
          <div className="text-center">
            <div 
              className="text-xl font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {customer.totalOrders}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Total Orders
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>Average Order Value</span>
            <span 
              className="font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              ${customer.averageOrderValue.toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>Last Order</span>
            <span 
              className="font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {formatTimeAgo(customer.lastOrderDate)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>Customer Since</span>
            <span 
              className="font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {formatTimeAgo(customer.signupDate)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: 'var(--text-secondary)' }}>Favorite Category</span>
            <span 
              className="font-medium"
              style={{ color: 'var(--brand-primary)' }}
            >
              {customer.favoriteCategory}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button 
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              title="Send Email"
            >
              <FiMail size={14} />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              title="View Profile"
            >
              <FiUsers size={14} />
            </button>
          </div>
          
          <button 
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
            style={{ color: 'var(--text-secondary)' }}
          >
            <FiMoreVertical size={14} />
          </button>
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
            Top Customers
          </h2>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Most valuable customers by spending and engagement
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

      {/* Customers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayCustomers.map((customer, index) => (
          <CustomerCard key={customer.id} customer={customer} index={index} />
        ))}
      </div>

      {/* Show More/Less Button */}
      {customers.length > 5 && (
        <div className="mt-6 text-center">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--brand-primary)' }}
          >
            {showAll ? 'Show Less' : `Show All ${customers.length} Customers`}
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
              className="text-lg font-bold text-green-600"
            >
              ${customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Combined Spending
            </div>
          </div>
          <div>
            <div 
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Total Orders
            </div>
          </div>
          <div>
            <div 
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              ${(customers.reduce((sum, c) => sum + c.averageOrderValue, 0) / customers.length).toFixed(2)}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Avg Order Value
            </div>
          </div>
          <div>
            <div 
              className="text-lg font-bold text-purple-600"
            >
              {customers.filter(c => c.loyaltyLevel === 'Platinum').length}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              VIP Customers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopCustomersWidget;
