"use client";
import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskKanbanBoard } from "@/components/tasks/TaskKanbanBoard";
import { TaskCalendarView } from "@/components/tasks/TaskCalendarView";
import { Loading } from "@/components/common/Loading";
import { TableSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { taskService } from "@/services/taskService";
import { Task, TaskFilters } from "@/types/task";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import toast from "react-hot-toast";
import { Plus, Search, LayoutList, LayoutGrid, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];
const priorityOptions = [
  { value: "", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
const sortOptions = [
  { value: "createdAt", label: "Created Date" },
  { value: "dueDate", label: "Due Date" },
  { value: "priority", label: "Priority" },
];

export default function TasksPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "board" | "calendar">("board");
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 10 });
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedModalTask, setSelectedModalTask] = useState<Task | null>(null);

  useEffect(() => {
    setFilters((prev) => {
      if (prev.search === debouncedSearch) return prev;
      return { ...prev, search: debouncedSearch, page: 1 };
    });
  }, [debouncedSearch]);

  const fetchTasks = useCallback(async (f: TaskFilters) => {
    setIsLoading(true);
    try {
      const data = await taskService.getTasks(f);
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, fetchTasks]);

  const handleStatusChange = async (id: string, status: string) => {
    // Locally update the task status without re-fetching entire list
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: status as any } : t))
    );
    try {
      await taskService.updateTaskStatus(id, status);
      toast.success("Status updated!");
    } catch {
      toast.error("Failed to update status");
      // Revert on error
      fetchTasks(filters);
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingTaskId(id);
  };

  const executeDelete = async () => {
    if (!deletingTaskId) return;
    setIsDeleting(true);
    try {
      await taskService.deleteTask(deletingTaskId);
      toast.success("Task deleted");
      fetchTasks(filters);
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
      setDeletingTaskId(null);
    }
  };

  const updateFilter = (key: keyof TaskFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage and track all your tasks</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"}`} title="List View">
                <LayoutList size={16} />
              </button>
              <button onClick={() => setViewMode("board")} className={`p-1.5 rounded-md transition-all ${viewMode === "board" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"}`} title="Board View">
                <LayoutGrid size={16} />
              </button>
              <button onClick={() => setViewMode("calendar")} className={`p-1.5 rounded-md transition-all ${viewMode === "calendar" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700"}`} title="Calendar View">
                <Calendar size={16} />
              </button>
            </div>
            { (user?.role === "admin" || user?.canCreateTask) && (
              <Button variant="primary" onClick={() => router.push("/tasks/create")}>
                <Plus size={16} />
                New Task
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search tasks..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              options={statusOptions}
              onChange={(e) => updateFilter("status", e.target.value)}
            />
            <Select
              options={priorityOptions}
              onChange={(e) => updateFilter("priority", e.target.value)}
            />
            <Select
              options={sortOptions}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description="No tasks match your current filters."
            actionLabel={(user?.role === "admin" || user?.canCreateTask) ? "Create Task" : undefined}
            onAction={(user?.role === "admin" || user?.canCreateTask) ? () => router.push("/tasks/create") : undefined}
          />
        ) : (
          <>
            {viewMode === "list" ? (
              <TaskTable
                tasks={tasks}
                isAdmin={user?.role === "admin"}
                canCreateTask={user?.canCreateTask}
                currentUserId={user?._id}
                onDelete={(user?.role === "admin" || user?.canCreateTask) ? confirmDelete : undefined}
                onStatusChange={handleStatusChange}
                onTaskClick={setSelectedModalTask}
              />
            ) : viewMode === "calendar" ? (
              <TaskCalendarView tasks={tasks} onTaskClick={setSelectedModalTask} />
            ) : (
              <TaskKanbanBoard
                tasks={tasks}
                isAdmin={user?.role === "admin"}
                canCreateTask={user?.canCreateTask}
                currentUserId={user?._id}
                onDelete={(user?.role === "admin" || user?.canCreateTask) ? confirmDelete : undefined}
                onStatusChange={handleStatusChange}
                onTaskClick={setSelectedModalTask}
              />
            )}
            <div className="flex justify-center">
              <Pagination
                currentPage={filters.page ?? 1}
                totalPages={totalPages}
                onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
              />
            </div>
          </>
        )}
      </div>

      {/* Task Detail Modal with blurred backdrop */}
      <TaskDetailModal
        task={selectedModalTask}
        isOpen={!!selectedModalTask}
        onClose={() => setSelectedModalTask(null)}
        onStatusChange={handleStatusChange}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingTaskId}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        onConfirm={executeDelete}
        onCancel={() => setDeletingTaskId(null)}
        isLoading={isDeleting}
        isDestructive={true}
      />
    </DashboardLayout>
  );
}
