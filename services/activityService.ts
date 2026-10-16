import api from "./api";

export interface ActivityLog {
  _id: string;
  actor: { _id: string; name: string; email: string };
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  metadata: any;
  createdAt: string;
}

export interface ActivityLogsResponse {
  logs: ActivityLog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalLogs: number;
    limit: number;
  };
}

export const activityService = {
  getGlobalLogs: async (page = 1, limit = 20): Promise<ActivityLogsResponse> => {
    const response = await api.get(`/v1/activity-logs?page=${page}&limit=${limit}`);
    return response.data.data;
  },
  
  getMyLogs: async (page = 1, limit = 20): Promise<ActivityLogsResponse> => {
    const response = await api.get(`/v1/activity-logs/me?page=${page}&limit=${limit}`);
    return response.data.data;
  }
};
