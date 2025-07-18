import React, { useState } from 'react';
import { 
  FiPackage, 
  FiDollarSign, 
  FiTrendingUp,
  FiStar,
  FiMoreVertical,
  FiExternalLink,
  FiBarChart2,
  FiPercent
} from 'react-icons/fi';

const TopSellingProductsWidget = ({ products }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('revenue'); // revenue, units, profit
  
  const sortOptions = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'unitsSold', label: 'Units Sold' },
    { value: 'profit', label: 'Profit' },
    { value: 'profitMargin', label: 'Profit Margin' }
  ];

  const sortedProducts = [...(products || [])].sort((a, b) => {
    if (sortBy === 'revenue' || sortBy === 'profit') {
      return (b?.[sortBy] || 0) - (a?.[sortBy] || 0);
    } else if (sortBy === 'unitsSold') {
      return (b?.unitsSold || b?.units_sold || 0) - (a?.unitsSold || a?.units_sold || 0);
    } else if (sortBy === 'profitMargin') {
      return (b?.profitMargin || b?.profit_margin || 0) - (a?.profitMargin || a?.profit_margin || 0);
    }
    return 0;
  });

  const displayProducts = showAll ? sortedProducts : sortedProducts.slice(0, 5);

  const formatCurrency = (amount) => {
    const value = parseFloat(amount) || 0;
    return `$${value.toLocaleString()}`;
  };
  const formatNumber = (num) => {
    const value = num || 0;
    return typeof value === 'number' ? value.toLocaleString() : (parseInt(value) || 0).toLocaleString();
  };

  const ProductCard = ({ product, index }) => {
    const getRankColor = (index) => {
      if (index === 0) return '#FFD700'; // Gold
      if (index === 1) return '#C0C0C0'; // Silver
      if (index === 2) return '#CD7F32'; // Bronze
      return 'var(--bg-secondary)';
    };

    return (
      <div 
        className="flex items-center p-4 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-all duration-200 group"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--rounded-lg)',
          boxShadow: 'var(--shadow-small)'
        }}
      >
        {/* Rank Badge */}
        <div 
          className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold mr-4"
          style={{
            backgroundColor: getRankColor(index),
            color: index < 3 ? 'white' : 'var(--text-secondary)'
          }}
        >
          {index + 1}
        </div>

        {/* Product Image */}
        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center overflow-hidden">
          {product?.image ? (
            <img 
              src={product.image} 
              alt={product?.name || 'Product Image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center text-xs" style="color: var(--text-secondary)">IMG</div>';
              }}
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              IMG
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 
              className="font-medium text-sm truncate pr-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {product?.name || 'Unknown Product'}
            </h4>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={12}
                  className={i < Math.floor(product?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                  fill={i < Math.floor(product?.rating || 0) ? 'currentColor' : 'none'}
                />
              ))}
              <span 
                className="text-xs ml-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                {product?.rating || 0}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div>
              <div 
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {formatNumber(product?.unitsSold || product?.units_sold)}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Units</div>
            </div>
            <div>
              <div 
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {formatCurrency(product?.revenue)}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Revenue</div>
            </div>
            <div>
              <div 
                className="font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {formatCurrency(product?.profit)}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Profit</div>
            </div>
            <div>
              <div 
                className="font-medium text-green-600"
              >
                {(product?.profitMargin || product?.profit_margin || 0)}%
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>Margin</div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span 
              className="text-xs px-2 py-1 rounded-full bg-gray-100"
              style={{ color: 'var(--text-secondary)' }}
            >
              {product?.category || 'Uncategorized'}
            </span>
            <div className="flex items-center space-x-2">
              <span 
                className={`text-xs px-2 py-1 rounded-full ${
                  (product?.stock || 0) > 50 ? 'bg-green-100 text-green-800' :
                  (product?.stock || 0) > 20 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}
              >
                Stock: {product?.stock || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg ml-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          <FiExternalLink size={14} />
        </button>
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
            Top Selling Products
          </h2>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Best performing products by sales metrics
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

      {/* Products List */}
      <div className="space-y-3">
        {displayProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* Show More/Less Button */}
      {(products || []).length > 5 && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--brand-primary)' }}
          >
            {showAll ? 'Show Less' : `Show All ${(products || []).length} Products`}
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
              {formatNumber((products || []).reduce((sum, p) => sum + (p?.unitsSold || p?.units_sold || 0), 0))}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Total Units Sold
            </div>
          </div>
          <div>
            <div 
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {formatCurrency((products || []).reduce((sum, p) => sum + (p?.revenue || 0), 0))}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Total Revenue
            </div>
          </div>
          <div>
            <div 
              className="text-lg font-bold text-green-600"
            >
              {formatCurrency((products || []).reduce((sum, p) => sum + (p?.profit || 0), 0))}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Total Profit
            </div>
          </div>
          <div>
            <div 
              className="text-lg font-bold text-blue-600"
            >
              {(() => {
                const totalRevenue = (products || []).reduce((sum, p) => sum + (p?.revenue || 0), 0);
                const totalProfit = (products || []).reduce((sum, p) => sum + (p?.profit || 0), 0);
                return totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0.0';
              })()}%
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Avg Profit Margin
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSellingProductsWidget;
