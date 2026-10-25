import { User, UsersResponse, UserFilters } from "@/types/user";
import api from "./api";

const buildQuery = (filters: UserFilters) => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.role) params.append("role", filters.role);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.onlyDeleted) params.append("onlyDeleted", "true");
  return params.toString();
};

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get("/v1/users/profile");
    return response.data.data;
  },

  updateProfile: async (data: { name?: string; currentPassword?: string; newPassword?: string }): Promise<User> => {
    const response = await api.patch("/v1/users/profile", data);
    return response.data.data;
  },

  getUsers: async (filters: UserFilters = {}): Promise<UsersResponse> => {
    const query = buildQuery(filters);
    const response = await api.get(`/v1/users?${query}`);
    
    if (response.data.data.pagination) {
      return {
        users: response.data.data.users,
        total: response.data.data.pagination.totalUsers,
        page: response.data.data.pagination.currentPage,
        totalPages: response.data.data.pagination.totalPages,
        limit: response.data.data.pagination.limit,
      };
    }

    // Fallback if backend reverts
    let users = response.data.data as User[];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    const limit = filters.limit ?? 10;
    const page = filters.page ?? 1;
    const total = users.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    
    return {
      users: users.slice(start, start + limit),
      total,
      page,
      totalPages,
      limit,
    };
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/v1/users/${id}`);
    return response.data.data;
  },

  updateUserByAdmin: async (id: string, data: { name?: string; role?: "admin" | "user"; canCreateTask?: boolean }): Promise<User> => {
    const response = await api.patch(`/v1/users/${id}`, data);
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/v1/users/${id}`);
  },

  restoreUser: async (id: string): Promise<User> => {
    const response = await api.post(`/v1/admin/users/${id}/restore`);
    return response.data.data;
  },

  getUsersList: async (): Promise<User[]> => {
    const response = await api.get("/v1/users?limit=100");
    return response.data.data.users || response.data.data;
  },

  getPendingUsers: async (page = 1, limit = 10, search = ""): Promise<{ users: User[]; total: number; totalPages: number }> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append("search", search);
    const response = await api.get(`/v1/admin/users/pending?${params.toString()}`);
    const data = response.data.data;
    return {
      users: data.users || [],
      total: data.pagination?.totalPendingUsers ?? data.users?.length ?? 0,
      totalPages: data.pagination?.totalPages ?? 1,
    };
  },

  getRejectedUsers: async (page = 1, limit = 10, search = ""): Promise<{ users: User[]; total: number; totalPages: number }> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append("search", search);
    const response = await api.get(`/v1/admin/users/rejected?${params.toString()}`);
    const data = response.data.data;
    return {
      users: data.users || [],
      total: data.pagination?.totalRejectedUsers ?? data.users?.length ?? 0,
      totalPages: data.pagination?.totalPages ?? 1,
    };
  },

  approveUser: async (id: string): Promise<User> => {
    const response = await api.patch(`/v1/admin/users/${id}/approve`);
    return response.data.data;
  },

  rejectUser: async (id: string, reason?: string): Promise<User> => {
    const response = await api.patch(`/v1/admin/users/${id}/reject`, { reason });
    return response.data.data;
  },
};