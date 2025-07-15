import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiShoppingCart, 
  FiPackage, 
  FiStar, 
  FiBell,
  FiClock,
  FiAlertTriangle,
  FiDollarSign,
  FiUser,
  FiExternalLink
} from 'react-icons/fi';
import useNotificationStore from '../../store/Admin/useNotificationStore';

const NotificationBar = () => {
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    error,
    lastUpdated,
    isOrdersDropdownOpen,
    isStockDropdownOpen,
    isReviewsDropdownOpen,
    toggleOrdersDropdown,
    toggleStockDropdown,
    toggleReviewsDropdown,
    closeAllDropdowns,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    fetchNotifications,
    refreshNotifications,
    simulateNewNotification
  } = useNotificationStore();

  const dropdownRef = useRef(null);
  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshNotifications();
    }, 30000);

    // Set up demo notification simulation every 45 seconds if in demo mode
    const demoInterval = setInterval(() => {
      if (error) {
        useNotificationStore.getState().simulateNewNotification();
      }
    }, 45000); // Simulate new notifications every 45 seconds in demo mode

    return () => {
      clearInterval(interval);
      clearInterval(demoInterval);
    };
  }, [fetchNotifications, refreshNotifications, error]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeAllDropdowns();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeAllDropdowns]);

  // Format time ago
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#dc2626'; // red-600
      case 'high': return '#ea580c'; // orange-600
      case 'medium': return '#ca8a04'; // yellow-600
      case 'low': return '#16a34a'; // green-600
      default: return '#6b7280'; // gray-500
    }
  };

  // Navigation functions for "View All" buttons
  const handleViewAllOrders = () => {
    closeAllDropdowns();
    navigate('/admin/orders');
  };

  const handleViewAllInventory = () => {
    closeAllDropdowns();
    navigate('/admin/inventory');
  };

  const handleViewAllReviews = () => {
    closeAllDropdowns();
    navigate('/admin/reviews');
  };

  // Handle notification click to navigate to specific items
  const handleNotificationClick = (notification, category) => {
    closeAllDropdowns();
    markAsRead(category, notification.id);
    
    // Navigate based on notification type
    switch (category) {
      case 'orders':
        navigate(`/admin/orders?search=${notification.order_id || ''}`);
        break;
      case 'stock':
        navigate(`/admin/inventory?search=${notification.product || ''}`);
        break;
      case 'reviews':
        navigate(`/admin/reviews?search=${notification.product || ''}`);
        break;
      default:
        break;
    }
  };

  // Notification button component
  const NotificationButton = ({ icon, count, isOpen, onClick, label }) => (
    <button
      onClick={onClick}
      className={`notification-button relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-opacity-10 ${
        isOpen ? 'active' : ''
      }`}
      style={{
        backgroundColor: isOpen ? 'var(--brand-primary)' : 'transparent',
        color: isOpen ? 'white' : 'var(--text-primary)',
        borderRadius: 'var(--rounded-lg)'
      }}
      title={label}
    >
      <span className="flex items-center justify-center">
        {icon}
      </span>
      <span className="text-sm font-medium hidden sm:block">{label}</span>
      {count > 0 && (
        <span className="notification-badge">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );

  // Dropdown component
  const NotificationDropdown = ({ notifications, category, isOpen, onMarkAsRead, onMarkAllAsRead, onViewAll }) => {
    if (!isOpen) return null;

    return (
      <div 
        className="notification-dropdown absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-light)',
          boxShadow: 'var(--shadow-large)',
          borderRadius: 'var(--rounded-lg)'
        }}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: 'var(--border-light)' }}
        >
          <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {category.charAt(0).toUpperCase() + category.slice(1)} Notifications
          </h3>
          {notifications.some(n => !n.read) && (
            <button
              onClick={() => onMarkAllAsRead(category)}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div className="notification-dropdown-content max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center" style={{ color: 'var(--text-secondary)' }}>
              <FiBell className="mx-auto mb-2" size={24} />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item p-4 border-b hover:bg-opacity-5 cursor-pointer transition-colors ${
                  !notification.read ? 'unread bg-blue-50' : ''
                }`}
                style={{ 
                  borderColor: 'var(--border-light)',
                  backgroundColor: !notification.read ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
                }}
                onClick={() => handleNotificationClick(notification, category)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div
                        className="notification-priority-dot"
                        style={{ backgroundColor: getPriorityColor(notification.priority) }}
                      />
                      <span 
                        className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {notification.message}
                      </span>
                    </div>
                    
                    {/* Category-specific content */}
                    {category === 'orders' && (
                      <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <FiUser size={12} />
                            <span>{notification.customer}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <FiDollarSign size={12} />
                            <span>{notification.amount}</span>
                          </span>
                        </div>
                        <span className="text-xs font-mono">#{notification.id}</span>
                      </div>
                    )}
                    
                    {category === 'stock' && (
                      <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        <div className="font-medium">{notification.product}</div>
                        <div className="flex items-center space-x-4 text-xs">
                          <span>Stock: {notification.currentStock}</span>
                          <span>Min: {notification.minThreshold}</span>
                          <span className="font-mono">{notification.sku}</span>
                        </div>
                      </div>
                    )}
                    
                    {category === 'reviews' && (
                      <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{notification.product}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                size={12}
                                className={i < notification.rating ? 'text-yellow-400' : 'text-gray-300'}
                                fill={i < notification.rating ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">{notification.customer}:</span>
                          <span className="ml-1">{notification.comment}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end space-y-1 ml-4">
                    <span 
                      className="text-xs flex items-center space-x-1"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <FiClock size={10} />
                      <span>{formatTimeAgo(notification.timestamp)}</span>
                    </span>
                    <FiExternalLink size={12} style={{ color: 'var(--text-secondary)' }} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div 
            className="p-3 border-t bg-gray-50"
            style={{ 
              borderColor: 'var(--border-light)',
              backgroundColor: 'var(--bg-secondary)'
            }}
          >
            <button
              onClick={onViewAll}
              className="w-full text-sm text-center py-1 rounded transition-colors hover:underline"
              style={{ color: 'var(--brand-primary)' }}
            >
              View all {category}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      ref={dropdownRef}
      className="relative sticky top-0 z-40 border-b"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-light)',
        boxShadow: 'var(--shadow-small)'
      }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center space-x-1">
          <NotificationButton
            icon={<FiShoppingCart size={18} />}
            count={getUnreadCount('orders')}
            isOpen={isOrdersDropdownOpen}
            onClick={toggleOrdersDropdown}
            label="Orders"
          />
          
          <NotificationButton
            icon={<FiPackage size={18} />}
            count={getUnreadCount('stock')}
            isOpen={isStockDropdownOpen}
            onClick={toggleStockDropdown}
            label="Stock"
          />
          
          <NotificationButton
            icon={<FiStar size={18} />}
            count={getUnreadCount('reviews')}
            isOpen={isReviewsDropdownOpen}
            onClick={toggleReviewsDropdown}
            label="Reviews"
          />
        </div>

        <div className="flex items-center space-x-3">
          <span 
            className="text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
          </span>
          
          {error && (
            <span 
              className="text-xs px-2 py-1 rounded flex items-center space-x-1"
              style={{ 
                backgroundColor: 'var(--warning-color)',
                color: 'white'
              }}
              title={error}
            >
              <span>Demo Mode</span>
            </span>
          )}
          
          <div className="flex items-center space-x-2">
            <div
              className={`live-indicator w-2 h-2 rounded-full ${loading ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: error ? 'var(--warning-color)' : loading ? 'var(--info-color)' : 'var(--success-color)' }}
            />
            <span 
              className="text-sm font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {loading ? 'Updating...' : error ? 'Demo' : 'Live'}
            </span>
            
            {/* Demo mode: Add manual simulation button */}
            {error && (
              <button
                onClick={simulateNewNotification}
                className="text-xs px-2 py-1 rounded hover:opacity-80 transition-opacity ml-2"
                style={{ 
                  backgroundColor: 'var(--brand-primary)',
                  color: 'white'
                }}
                title="Simulate new notification (Demo only)"
              >
                + New
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dropdowns */}
      <NotificationDropdown 
        notifications={notifications.orders}
        category="orders"
        isOpen={isOrdersDropdownOpen}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onViewAll={handleViewAllOrders}
      />
      
      <NotificationDropdown 
        notifications={notifications.stock}
        category="stock"
        isOpen={isStockDropdownOpen}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onViewAll={handleViewAllInventory}
      />
      
      <NotificationDropdown 
        notifications={notifications.reviews}
        category="reviews"
        isOpen={isReviewsDropdownOpen}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        onViewAll={handleViewAllReviews}
      />
    </div>
  );
};

export default NotificationBar;
