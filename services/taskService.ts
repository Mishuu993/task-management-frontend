import { Task, TaskFormData, TaskFilters, TasksResponse, DashboardStats, AdminDashboardStats } from "@/types/task";
import api from "./api";

// Helper to construct query strings
const buildQuery = (filters: TaskFilters) => {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.assignedTo) params.append("assignedTo", filters.assignedTo);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("order", filters.sortOrder);
  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.onlyDeleted) params.append("onlyDeleted", "true");
  return params.toString();
};

export const taskService = {
  getTasks: async (filters: TaskFilters = {}): Promise<TasksResponse> => {
    const query = buildQuery(filters);
    const response = await api.get(`/v1/tasks?${query}`);
    return {
      tasks: response.data.data.tasks,
      total: response.data.data.pagination.totalTasks,
      page: response.data.data.pagination.currentPage,
      totalPages: response.data.data.pagination.totalPages,
      limit: response.data.data.pagination.limit,
    };
  },

  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get(`/v1/tasks/${id}`);
    return response.data.data;
  },

  createTask: async (data: TaskFormData): Promise<Task> => {
    const response = await api.post("/v1/tasks", data);
    return response.data.data;
  },

  updateTask: async (id: string, data: Partial<TaskFormData>): Promise<Task> => {
    const response = await api.patch(`/v1/tasks/${id}`, data);
    return response.data.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/v1/tasks/${id}`);
  },

  restoreTask: async (id: string): Promise<Task> => {
    const response = await api.post(`/v1/admin/tasks/${id}/restore`);
    return response.data.data;
  },

  updateTaskStatus: async (id: string, status: string): Promise<Task> => {
    const response = await api.patch(`/v1/tasks/${id}`, { status });
    return response.data.data;
  },

  getTaskActivity: async (taskId: string) => {
    const response = await api.get(`/v1/activity-logs/entity/Task/${taskId}`);
    return response.data.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    // Call the new API for stats, and fetch 5 recent tasks separately
    const [statsResponse, tasksResponse] = await Promise.all([
      api.get("/v1/users/my-stats"),
      api.get("/v1/tasks?limit=5")
    ]);

    const stats = statsResponse.data.data;
    const recentTasks = tasksResponse.data.data.tasks;
    
    return {
      totalTasks: stats.totalTasks,
      pendingTasks: stats.pendingTasks,
      inProgressTasks: stats.inProgressTasks,
      completedTasks: stats.completedTasks,
      highPriorityTasks: stats.highPriorityTasks,
      recentTasks: recentTasks,
    };
  },

  getAdminStats: async (): Promise<AdminDashboardStats> => {
    const response = await api.get("/v1/admin/stats");
    return response.data.data;
  },

  getAllTasks: async (filters: TaskFilters = {}): Promise<TasksResponse> => {
    // Admin uses the same /v1/tasks endpoint to get all tasks (backend handles role-based logic)
    const query = buildQuery(filters);
    const response = await api.get(`/v1/tasks?${query}`);
    return {
      tasks: response.data.data.tasks,
      total: response.data.data.pagination.totalTasks,
      page: response.data.data.pagination.currentPage,
      totalPages: response.data.data.pagination.totalPages,
      limit: response.data.data.pagination.limit,
    };
  },
};