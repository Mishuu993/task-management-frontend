import { TaskStatus, TaskPriority } from "@/types/task";

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getStatusColor(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    pending: "bg-amber-100 text-amber-700 border border-amber-200",
    "in-progress": "bg-blue-100 text-blue-700 border border-blue-200",
    completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}

export function getPriorityColor(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    low: "bg-slate-100 text-slate-600 border border-slate-200",
    medium: "bg-orange-100 text-orange-700 border border-orange-200",
    high: "bg-rose-100 text-rose-700 border border-rose-200",
  };
  return map[priority] ?? "bg-gray-100 text-gray-600";
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosErr = error as { response?: { data?: { message?: string } } };
    return axiosErr.response?.data?.message ?? "Something went wrong";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
