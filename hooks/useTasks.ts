import { useState, useCallback } from "react";
import { Task, TaskFilters, TasksResponse } from "@/types/task";
import { taskService } from "@/services/taskService";
import toast from "react-hot-toast";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTasks = useCallback(async (filters: TaskFilters = {}) => {
    setIsLoading(true);
    try {
      const data: TasksResponse = await taskService.getTasks(filters);
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success("Task deleted successfully");
    } catch {
      toast.error("Failed to delete task");
    }
  }, []);

  return { tasks, isLoading, totalPages, total, fetchTasks, deleteTask };
}
