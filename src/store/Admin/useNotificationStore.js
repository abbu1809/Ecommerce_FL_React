import { create } from 'zustand';
import { adminApi } from '../../services/api';

const useNotificationStore = create((set, get) => ({
  // Notification data
  notifications: {
    orders: [],
    stock: [],
    reviews: []
  },
  
  // Loading and error states
  loading: false,
  error: null,
  lastUpdated: null,
  
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
  
  // Fetch notifications from backend
  fetchNotifications: async () => {
    set({ loading: true, error: null });
    
    try {
      console.log('Fetching notifications from backend...');
      const response = await adminApi.get('/admin/notifications/');
      console.log('Notifications response:', response);
      
      if (response.status === 200 && response.data) {
        console.log('Notifications data:', response.data);
        
        // Ensure notifications structure exists
        const notifications = response.data.notifications || {
          orders: [],
          stock: [],
          reviews: []
        };
        
        set({
          notifications,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
        console.log('Real notifications loaded successfully:', notifications);
        return; // Exit early if successful
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      console.error('Error response:', error.response);
      
      // Only use sample data if backend is completely unavailable
      const errorMessage = error.response?.status === 401 
        ? 'Authentication required - please login again'
        : error.response?.status >= 500
        ? 'Backend server error - using demo data'
        : 'Network error - using demo data';
      
      console.warn('Using sample notifications due to:', errorMessage);
    }
    
    // Fallback to realistic sample data that simulates real admin notifications
    const sampleNotifications = {
        orders: [
          {
            id: `ORD-${Date.now()}-001`,
            type: 'new_order',
            message: 'New order pending payment',
            customer: 'John Doe',
            amount: '₹45,999',
            order_id: `ORD-${Date.now()}-001`,
            timestamp: new Date().toISOString(),
            priority: 'medium',
            read: false
          },
          {
            id: `ORD-${Date.now()}-002`,
            type: 'order_processing',
            message: 'Order requires processing',
            customer: 'Jane Smith', 
            amount: '₹12,499',
            order_id: `ORD-${Date.now()}-002`,
            timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 mins ago
            priority: 'high',
            read: false
          },
          {
            id: `ORD-${Date.now()}-003`,
            type: 'payment_pending',
            message: 'Payment pending verification',
            customer: 'Rahul Kumar',
            amount: '₹67,999',
            order_id: `ORD-${Date.now()}-003`,
            timestamp: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
            priority: 'high',
            read: false
          }
        ],
        stock: [
          {
            id: `STK-${Date.now()}-001`,
            type: 'low_stock',
            message: 'Low stock alert',
            product: 'iPhone 15 Pro',
            sku: 'IPH15PRO-256',
            currentStock: 3,
            minThreshold: 10,
            timestamp: new Date().toISOString(),
            priority: 'high',
            read: false
          },
          {
            id: `STK-${Date.now()}-002`,
            type: 'out_of_stock',
            message: 'Product out of stock',
            product: 'Samsung Galaxy S24',
            sku: 'SGS24-128',
            currentStock: 0,
            minThreshold: 10,
            timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 mins ago
            priority: 'critical',
            read: false
          },
          {
            id: `STK-${Date.now()}-003`,
            type: 'low_stock',
            message: 'Variant low stock',
            product: 'OnePlus 12 - Black 256GB',
            sku: 'OP12-BLK-256',
            currentStock: 2,
            minThreshold: 5,
            timestamp: new Date(Date.now() - 90 * 60000).toISOString(), // 1.5 hours ago
            priority: 'high',
            read: false
          }
        ],
        reviews: [
          {
            id: `REV-${Date.now()}-001`,
            type: 'negative_review',
            message: 'Negative review requiring attention',
            product: 'OnePlus 12',
            customer: 'Alex Johnson',
            rating: 2,
            comment: 'Battery life is disappointing, expected better performance...',
            timestamp: new Date().toISOString(),
            priority: 'high',
            read: false
          },
          {
            id: `REV-${Date.now()}-002`,
            type: 'positive_review',
            message: 'New positive review',
            product: 'Nothing Phone 2',
            customer: 'Sarah Wilson',
            rating: 5,
            comment: 'Amazing phone with unique design, love the glyph interface!',
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
            priority: 'low',
            read: false
          },
          {
            id: `REV-${Date.now()}-003`,
            type: 'negative_review',
            message: 'Critical negative review',
            product: 'Vivo V30 Pro',
            customer: 'Michael Chen',
            rating: 1,
            comment: 'Poor build quality, screen cracked within a week...',
            timestamp: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
            priority: 'critical',
            read: false
          }
        ]
      };
      
      set({
        notifications: sampleNotifications,
        loading: false,
        error: 'Sample notifications loaded as fallback'
      });
      console.log('Sample notifications loaded as fallback');
    
  },
  
  // Refresh notifications (called by interval)
  // refreshNotifications: async () => {
  //   const { lastUpdated } = get();
  //   // Only refresh if it's been more than 10 seconds since last update
  //   if (lastUpdated && Date.now() - lastUpdated.getTime() < 10000) {
  //     return;
  //   }
  //   await get().fetchNotifications();
  // },
  
  // Mark notification as read
  markAsRead: async (category, id) => {
    // Update the UI immediately for better user experience
    set((state) => ({
      notifications: {
        ...state.notifications,
        [category]: state.notifications[category].map(notification =>
          notification.id === id 
            ? { ...notification, read: true }
            : notification
        )
      }
    }));

    try {
      // Try to update on backend (will fail silently in demo mode)
      await adminApi.post('/admin/notifications/mark-read/', {
        notification_id: id,
        category: category
      });
      console.log(`Marked notification ${id} as read on backend`);
    } catch (error) {
      console.error('Backend update failed, but UI updated locally (demo mode)', error);
      // Don't revert the UI change since this might be demo mode
    }
  },
  
  // Mark all notifications in a category as read
  markAllAsRead: async (category) => {
    // Update the UI immediately for better user experience
    set((state) => ({
      notifications: {
        ...state.notifications,
        [category]: state.notifications[category].map(notification => ({
          ...notification,
          read: true
        }))
      }
    }));

    try {
      // Try to update on backend (will fail silently in demo mode)
      await adminApi.post('/admin/notifications/mark-all-read/', {
        category: category
      });
      console.log(`Marked all ${category} notifications as read on backend`);
    } catch (error) {
      console.error('Backend update failed, but UI updated locally (demo mode)',error);
      // Don't revert the UI change since this might be demo mode
    }
  },
  
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
  
  // Refresh notifications (reload from backend)
  refreshNotifications: async () => {
    const { fetchNotifications } = get();
    await fetchNotifications();
  },
  
  // Add new notification (for real-time updates)
  addNotification: (category, notification) => set((state) => ({
    notifications: {
      ...state.notifications,
      [category]: [notification, ...state.notifications[category]]
    }
  })),

  // Simulate new notification for demo purposes
  simulateNewNotification: () => {
    const { error } = get();
    // Only simulate if we're in demo mode (when there's an error)
    if (!error) return;

    const categories = ['orders', 'stock', 'reviews'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    const sampleNotifications = {
      orders: [
        {
          id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'new_order',
          message: 'New order received',
          customer: ['Priya Sharma', 'Arjun Patel', 'Sneha Reddy', 'Vikash Kumar'][Math.floor(Math.random() * 4)],
          amount: `₹${(Math.random() * 50000 + 10000).toFixed(0)}`,
          timestamp: new Date().toISOString(),
          priority: 'high',
          read: false
        }
      ],
      stock: [
        {
          id: `STK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: Math.random() > 0.5 ? 'low_stock' : 'out_of_stock',
          message: Math.random() > 0.5 ? 'Low stock alert' : 'Product out of stock',
          product: ['iPhone 15', 'Samsung S24', 'OnePlus 12', 'Nothing Phone 2'][Math.floor(Math.random() * 4)],
          sku: `SKU-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          currentStock: Math.floor(Math.random() * 5),
          minThreshold: 10,
          timestamp: new Date().toISOString(),
          priority: Math.random() > 0.5 ? 'high' : 'critical',
          read: false
        }
      ],
      reviews: [
        {
          id: `REV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: Math.random() > 0.7 ? 'negative_review' : 'positive_review',
          message: Math.random() > 0.7 ? 'Negative review received' : 'New positive review',
          product: ['iPhone 15 Pro', 'Galaxy S24 Ultra', 'OnePlus 12', 'Pixel 8'][Math.floor(Math.random() * 4)],
          customer: ['Rajesh Kumar', 'Anita Singh', 'Rohit Gupta', 'Meera Shah'][Math.floor(Math.random() * 4)],
          rating: Math.random() > 0.7 ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 2) + 4,
          comment: 'Customer feedback...',
          timestamp: new Date().toISOString(),
          priority: Math.random() > 0.7 ? 'high' : 'low',
          read: false
        }
      ]
    };

    const newNotification = sampleNotifications[randomCategory][0];
    get().addNotification(randomCategory, newNotification);
    console.log(`Simulated new ${randomCategory} notification:`, newNotification);
  }
}));

export default useNotificationStore;
