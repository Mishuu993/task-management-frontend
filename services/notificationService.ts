import api from './api';
import { AppNotification } from '@/types/notification';

export interface NotificationsResponse {
  notifications: AppNotification[];
  unreadCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotifications: number;
    limit: number;
  };
}

export const notificationService = {
  // Fetch real notifications from backend
  getNotifications: async (status: 'all' | 'unread' | 'read' = 'all', page = 1, limit = 20): Promise<NotificationsResponse> => {
    try {
      const response = await api.get('/v1/notifications', {
        params: { status, page, limit },
      });
      return response.data?.data || {
        notifications: [],
        unreadCount: 0,
        pagination: { currentPage: 1, totalPages: 1, totalNotifications: 0, limit },
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return {
        notifications: [],
        unreadCount: 0,
        pagination: { currentPage: 1, totalPages: 1, totalNotifications: 0, limit },
      };
    }
  },

  // Get unread notification count for badge
  getUnreadCount: async (): Promise<number> => {
    try {
      const response = await api.get('/v1/notifications/unread-count');
      return response.data?.data?.unreadCount ?? 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  // Mark single notification as read
  markAsRead: async (id: string): Promise<AppNotification | null> => {
    try {
      const response = await api.patch(`/v1/notifications/${id}/read`);
      return response.data?.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return null;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<boolean> => {
    try {
      await api.patch('/v1/notifications/read-all');
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },

  // Delete single notification
  deleteNotification: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/v1/notifications/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  },

  // Clear all read notifications
  clearAllRead: async (): Promise<boolean> => {
    try {
      await api.delete('/v1/notifications/clear-read');
      return true;
    } catch (error) {
      console.error('Error clearing read notifications:', error);
      return false;
    }
  },
};
