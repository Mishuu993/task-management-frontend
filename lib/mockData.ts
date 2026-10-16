import { Task, DashboardStats, AdminDashboardStats } from "@/types/task";
import { User } from "@/types/user";

export const MOCK_USERS: User[] = [
  { _id: "u1", name: "Admin User", email: "admin@taskflow.com", role: "admin", createdAt: "2026-01-15T08:00:00.000Z", taskCount: 12 },
  { _id: "u2", name: "Rahul Sharma", email: "user@taskflow.com", role: "user", createdAt: "2026-02-20T09:00:00.000Z", taskCount: 4 },
  { _id: "u3", name: "Priya Singh", email: "priya@taskflow.com", role: "user", createdAt: "2026-03-10T10:00:00.000Z", taskCount: 3 },
  { _id: "u4", name: "Amit Kumar", email: "amit@taskflow.com", role: "user", createdAt: "2026-04-05T11:00:00.000Z", taskCount: 3 },
  { _id: "u5", name: "Sneha Patel", email: "sneha@taskflow.com", role: "user", createdAt: "2026-05-12T12:00:00.000Z", taskCount: 2 },
];

export const MOCK_TASKS: Task[] = [
  { _id: "t1", title: "Design Login Page UI", description: "Create a modern and responsive login page with form validation, loading states, and error handling.", priority: "high", status: "completed", dueDate: "2026-09-10T00:00:00.000Z", assignedTo: { _id: "u2", name: "Rahul Sharma", email: "user@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-01T08:00:00.000Z", updatedAt: "2026-09-10T10:00:00.000Z" },
  { _id: "t2", title: "Develop REST API for Authentication", description: "Build JWT-based authentication endpoints including login, register, and token refresh.", priority: "high", status: "in-progress", dueDate: "2026-09-25T00:00:00.000Z", assignedTo: { _id: "u3", name: "Priya Singh", email: "priya@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-05T09:00:00.000Z", updatedAt: "2026-09-18T12:00:00.000Z" },
  { _id: "t3", title: "Setup MongoDB Database", description: "Configure MongoDB Atlas, create collections for users and tasks, set up indexes for performance.", priority: "medium", status: "completed", dueDate: "2026-09-08T00:00:00.000Z", assignedTo: { _id: "u4", name: "Amit Kumar", email: "amit@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-02T10:00:00.000Z", updatedAt: "2026-09-08T15:00:00.000Z" },
  { _id: "t4", title: "Write Unit Tests for API", description: "Write comprehensive unit and integration tests for all API endpoints using Jest and Supertest.", priority: "medium", status: "pending", dueDate: "2026-09-30T00:00:00.000Z", assignedTo: { _id: "u2", name: "Rahul Sharma", email: "user@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-12T08:00:00.000Z", updatedAt: "2026-09-12T08:00:00.000Z" },
  { _id: "t5", title: "Implement Task Search & Filtering", description: "Add search by title, filter by status/priority, and sorting options to the task list page.", priority: "medium", status: "in-progress", dueDate: "2026-09-27T00:00:00.000Z", assignedTo: { _id: "u5", name: "Sneha Patel", email: "sneha@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-10T09:00:00.000Z", updatedAt: "2026-09-19T11:00:00.000Z" },
  { _id: "t6", title: "Deploy Application to Production", description: "Set up CI/CD pipeline, configure environment variables, and deploy to cloud server.", priority: "high", status: "pending", dueDate: "2026-10-05T00:00:00.000Z", assignedTo: { _id: "u3", name: "Priya Singh", email: "priya@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-15T10:00:00.000Z", updatedAt: "2026-09-15T10:00:00.000Z" },
  { _id: "t7", title: "Create Admin Dashboard Charts", description: "Implement visual charts to display task statistics for admin users.", priority: "low", status: "pending", dueDate: "2026-10-10T00:00:00.000Z", assignedTo: { _id: "u4", name: "Amit Kumar", email: "amit@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-16T11:00:00.000Z", updatedAt: "2026-09-16T11:00:00.000Z" },
  { _id: "t8", title: "Fix Mobile Responsive Issues", description: "Fix layout issues on mobile screens for task cards, sidebar navigation, and forms.", priority: "medium", status: "completed", dueDate: "2026-09-18T00:00:00.000Z", assignedTo: { _id: "u2", name: "Rahul Sharma", email: "user@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-13T08:00:00.000Z", updatedAt: "2026-09-18T17:00:00.000Z" },
  { _id: "t9", title: "Email Notification Integration", description: "Integrate Nodemailer to send email notifications when tasks are assigned to users.", priority: "low", status: "pending", dueDate: "2026-10-08T00:00:00.000Z", assignedTo: { _id: "u5", name: "Sneha Patel", email: "sneha@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-17T09:00:00.000Z", updatedAt: "2026-09-17T09:00:00.000Z" },
  { _id: "t10", title: "Code Review & Refactoring", description: "Review all existing code, refactor for better readability and remove duplicate code.", priority: "low", status: "in-progress", dueDate: "2026-09-28T00:00:00.000Z", assignedTo: { _id: "u2", name: "Rahul Sharma", email: "user@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-14T10:00:00.000Z", updatedAt: "2026-09-20T14:00:00.000Z" },
  { _id: "t11", title: "Implement Pagination API", description: "Add server-side pagination with page and limit query parameters to task endpoints.", priority: "medium", status: "completed", dueDate: "2026-09-12T00:00:00.000Z", assignedTo: { _id: "u3", name: "Priya Singh", email: "priya@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-06T11:00:00.000Z", updatedAt: "2026-09-12T16:00:00.000Z" },
  { _id: "t12", title: "Security Audit & Penetration Testing", description: "Perform security audit on all API endpoints, test for vulnerabilities.", priority: "high", status: "pending", dueDate: "2026-10-15T00:00:00.000Z", assignedTo: { _id: "u4", name: "Amit Kumar", email: "amit@taskflow.com" }, createdBy: { _id: "u1", name: "Admin User" }, createdAt: "2026-09-18T08:00:00.000Z", updatedAt: "2026-09-18T08:00:00.000Z" },
];

export const MOCK_CREDENTIALS = [
  { email: "admin@taskflow.com", password: "admin123", userId: "u1" },
  { email: "user@taskflow.com", password: "user123", userId: "u2" },
  { email: "priya@taskflow.com", password: "user123", userId: "u3" },
  { email: "amit@taskflow.com", password: "user123", userId: "u4" },
  { email: "sneha@taskflow.com", password: "user123", userId: "u5" },
];

const TASKS_KEY = "taskflow_tasks_store";

export function getTaskStore(): Task[] {
  if (typeof window === "undefined") return MOCK_TASKS;
  const stored = localStorage.getItem(TASKS_KEY);
  if (!stored) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(MOCK_TASKS));
    return MOCK_TASKS;
  }
  return JSON.parse(stored);
}

export function setTaskStore(tasks: Task[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
}

export function getMockDashboardStats(userId: string): DashboardStats {
  const tasks = getTaskStore();
  const userTasks = tasks.filter((t) => t.assignedTo?._id === userId);
  const pMap = { high: 0, medium: 1, low: 2 };
  
  // Sort by newest created/updated first, and higher priority
  const sorted = [...userTasks].sort((a, b) => {
    const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (timeDiff !== 0) return timeDiff;
    return pMap[a.priority] - pMap[b.priority];
  });

  return {
    totalTasks: userTasks.length,
    pendingTasks: userTasks.filter((t) => t.status === "pending").length,
    inProgressTasks: userTasks.filter((t) => t.status === "in-progress").length,
    completedTasks: userTasks.filter((t) => t.status === "completed").length,
    highPriorityTasks: userTasks.filter((t) => t.priority === "high").length,
    recentTasks: sorted.slice(0, 5),
  };
}

export function getMockAdminStats(): AdminDashboardStats {
  const tasks = getTaskStore();
  return {
    totalUsers: MOCK_USERS.length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter((t) => t.status === "pending").length,
    inProgressTasks: tasks.filter((t) => t.status === "in-progress").length,
    completedTasks: tasks.filter((t) => t.status === "completed").length,
    highPriorityTasks: tasks.filter((t) => t.priority === "high").length,
  };
}