export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  taskCount?: number;
  canCreateTask?: boolean;
  isDeleted?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  rejectedAt?: string;
  approvedAt?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface UserFilters {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
  onlyDeleted?: boolean;
}
