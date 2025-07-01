import React, { useState } from 'react';
import { 
  FiEye, 
  FiHeart, 
  FiShare2, 
  FiTrendingUp,
  FiStar,
  FiMoreVertical,
  FiExternalLink
} from 'react-icons/fi';

const MostPopularProductsWidget = ({ products }) => {
  const [showAll, setShowAll] = useState(false);
  const displayProducts = showAll ? products : products.slice(0, 5);

  const ProductCard = ({ product, index }) => {
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
            backgroundColor: index < 3 ? 'var(--brand-primary)' : 'var(--bg-secondary)',
            color: index < 3 ? 'white' : 'var(--text-secondary)'
          }}
        >
          {index + 1}
        </div>

        {/* Product Image */}
        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover"
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
          <div className="flex items-center justify-between mb-1">
            <h4 
              className="font-medium text-sm truncate pr-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {product.name}
            </h4>
            <span 
              className="text-xs px-2 py-1 rounded-full bg-gray-100"
              style={{ color: 'var(--text-secondary)' }}
            >
              {product.category}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex items-center space-x-1">
                <FiEye size={12} />
                <span>{product.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiHeart size={12} />
                <span>{product.wishlistCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiShare2 size={12} />
                <span>{product.shareCount}</span>
              </div>
            </div>
            
            <div 
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                product.viewsChange.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {product.viewsChange}
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
            Most Popular Products
          </h2>
          <p 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Based on views, engagement, and interactions
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div 
            className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800"
          >
            Trending
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="space-y-3">
        {displayProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {/* Show More/Less Button */}
      {products.length > 5 && (
        <div className="mt-4 text-center">
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--brand-primary)' }}
          >
            {showAll ? 'Show Less' : `Show All ${products.length} Products`}
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div 
        className="mt-6 p-4 bg-gray-50 rounded-lg"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div 
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {products.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Total Views
            </div>
          </div>
          <div>
            <div 
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {products.reduce((sum, p) => sum + p.wishlistCount, 0).toLocaleString()}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Wishlisted
            </div>
          </div>
          <div>
            <div 
              className="text-lg font-bold"
              style={{ color: 'var(--text-primary)' }}
            >
              {products.reduce((sum, p) => sum + p.shareCount, 0)}
            </div>
            <div 
              className="text-xs"
              style={{ color: 'var(--text-secondary)' }}
            >
              Shared
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostPopularProductsWidget;
