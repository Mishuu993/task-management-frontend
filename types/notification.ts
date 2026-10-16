export interface NotificationSender {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AppNotification {
  _id: string;
  id?: string;
  recipient: string;
  sender?: NotificationSender;
  type:
    | 'task_assigned'
    | 'task_updated'
    | 'task_reassigned'
    | 'task_deleted'
    | 'task_status_changed'
    | 'task_completed';
  title: string;
  message: string;
  relatedId?: any;
  metadata?: Record<string, any>;
  isRead: boolean;
  read?: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  link?: string;
}
