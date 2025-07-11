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
      const response = await adminApi.get('/admin/notifications/');
      
      if (response.status === 200) {
        set({
          notifications: response.data.notifications,
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({
        loading: false,
        error: error.response?.data?.error || 'Failed to fetch notifications'
      });
    }
  },
  
  // Mark notification as read
  markAsRead: async (category, id) => {
    try {
      await adminApi.post('/admin/notifications/mark-read/', {
        notification_id: id,
        category: category
      });
      
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
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },
  
  // Mark all notifications in a category as read
  markAllAsRead: async (category) => {
    try {
      await adminApi.post('/admin/notifications/mark-all-read/', {
        category: category
      });
      
      set((state) => ({
        notifications: {
          ...state.notifications,
          [category]: state.notifications[category].map(notification => ({
            ...notification,
            read: true
          }))
        }
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
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
  }))
}));

export default useNotificationStore;
