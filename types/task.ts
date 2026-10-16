export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy?: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedTo?: string;
}

export interface TaskFilters {
  status?: TaskStatus | '';
  priority?: TaskPriority | '';
  assignedTo?: string;
  search?: string;
  sortBy?: 'dueDate' | 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  onlyDeleted?: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
  recentTasks: Task[];
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
}
