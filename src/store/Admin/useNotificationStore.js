import { create } from 'zustand';

// Mock data for notifications - in a real app, this would come from your backend
const generateMockNotifications = () => ({
  orders: [
    {
      id: 'ORD-2024-001',
      type: 'new_order',
      message: 'New order received',
      customer: 'John Doe',
      amount: '$234.50',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      priority: 'high',
      read: false
    },
    {
      id: 'ORD-2024-002',
      type: 'payment_pending',
      message: 'Payment pending verification',
      customer: 'Sarah Wilson',
      amount: '$89.99',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      priority: 'medium',
      read: false
    },
    {
      id: 'ORD-2024-003',
      type: 'order_cancelled',
      message: 'Order cancelled by customer',
      customer: 'Mike Johnson',
      amount: '$156.75',
      timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
      priority: 'low',
      read: true
    }
  ],
  stock: [
    {
      id: 'STK-2024-001',
      type: 'low_stock',
      message: 'Low stock alert',
      product: 'iPhone 15 Pro Max',
      sku: 'IPH15PM-256-BLU',
      currentStock: 3,
      minThreshold: 10,
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      priority: 'high',
      read: false
    },
    {
      id: 'STK-2024-002',
      type: 'out_of_stock',
      message: 'Product out of stock',
      product: 'Samsung Galaxy S24',
      sku: 'SGS24-128-WHT',
      currentStock: 0,
      minThreshold: 5,
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      priority: 'critical',
      read: false
    },
    {
      id: 'STK-2024-003',
      type: 'restock_needed',
      message: 'Restock recommendation',
      product: 'MacBook Pro 14"',
      sku: 'MBP14-512-SLV',
      currentStock: 2,
      minThreshold: 8,
      timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
      priority: 'medium',
      read: true
    }
  ],
  reviews: [
    {
      id: 'REV-2024-001',
      type: 'new_review',
      message: 'New 5-star review',
      product: 'AirPods Pro',
      customer: 'Emma Davis',
      rating: 5,
      comment: 'Amazing sound quality and noise cancellation!',
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      priority: 'low',
      read: false
    },
    {
      id: 'REV-2024-002',
      type: 'negative_review',
      message: 'Negative review requiring attention',
      product: 'Dell XPS 13',
      customer: 'Robert Chen',
      rating: 2,
      comment: 'Battery life is not as advertised. Very disappointed.',
      timestamp: new Date(Date.now() - 1000 * 60 * 75), // 1.25 hours ago
      priority: 'high',
      read: false
    },
    {
      id: 'REV-2024-003',
      type: 'review_response_needed',
      message: 'Customer asking for help in review',
      product: 'Gaming Mouse RGB',
      customer: 'Lisa Park',
      rating: 3,
      comment: 'Good mouse but having issues with the software setup. Any help?',
      timestamp: new Date(Date.now() - 1000 * 60 * 150), // 2.5 hours ago
      priority: 'medium',
      read: true
    }
  ]
});

const useNotificationStore = create((set, get) => ({
  // Notification data
  notifications: generateMockNotifications(),
  
  // UI state
  isOrdersDropdownOpen: false,
  isStockDropdownOpen: false,
  isReviewsDropdownOpen: false,
  
  // Actions
  toggleOrdersDropdown: () => set((state) => ({
    isOrdersDropdownOpen: !state.isOrdersDropdownOpen,
    isStockDropdownOpen: false,
    isReviewsDropdownOpen: false
  })),
  
  toggleStockDropdown: () => set((state) => ({
    isStockDropdownOpen: !state.isStockDropdownOpen,
    isOrdersDropdownOpen: false,
    isReviewsDropdownOpen: false
  })),
  
  toggleReviewsDropdown: () => set((state) => ({
    isReviewsDropdownOpen: !state.isReviewsDropdownOpen,
    isOrdersDropdownOpen: false,
    isStockDropdownOpen: false
  })),
  
  closeAllDropdowns: () => set({
    isOrdersDropdownOpen: false,
    isStockDropdownOpen: false,
    isReviewsDropdownOpen: false
  }),
  
  // Mark notification as read
  markAsRead: (category, id) => set((state) => ({
    notifications: {
      ...state.notifications,
      [category]: state.notifications[category].map(notification =>
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    }
  })),
  
  // Mark all notifications in a category as read
  markAllAsRead: (category) => set((state) => ({
    notifications: {
      ...state.notifications,
      [category]: state.notifications[category].map(notification => ({
        ...notification,
        read: true
      }))
    }
  })),
  
  // Get unread count for a category
  getUnreadCount: (category) => {
    const { notifications } = get();
    return notifications[category].filter(n => !n.read).length;
  },
  
  // Get total unread count
  getTotalUnreadCount: () => {
    const { notifications } = get();
    return Object.values(notifications).flat().filter(n => !n.read).length;
  },
  
  // Refresh notifications (in real app, this would fetch from API)
  refreshNotifications: () => set({
    notifications: generateMockNotifications()
  }),
  
  // Add new notification (for real-time updates)
  addNotification: (category, notification) => set((state) => ({
    notifications: {
      ...state.notifications,
      [category]: [notification, ...state.notifications[category]]
    }
  }))
}));

export default useNotificationStore;
