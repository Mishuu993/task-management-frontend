"use client";
import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TaskTable } from "@/components/tasks/TaskTable";
import { TaskKanbanBoard } from "@/components/tasks/TaskKanbanBoard";
import { TaskCalendarView } from "@/components/tasks/TaskCalendarView";
import { Loading } from "@/components/common/Loading";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TaskDetailModal } from "@/components/tasks/TaskDetailModal";
import { TableSkeleton } from "@/components/common/Skeleton";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { taskService } from "@/services/taskService";
import { Task, TaskFilters } from "@/types/task";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/hooks/useAuth";
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

export default function AdminTasksPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<"list" | "board" | "calendar">("board");
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
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

  const fetchTasks = useCallback(async (f: TaskFilters, tab: "active" | "deleted") => {
    setIsLoading(true);
    try {
      const queryFilters = { ...f, onlyDeleted: tab === "deleted" };
      const data = await taskService.getAllTasks(queryFilters);
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(filters, activeTab); }, [filters, activeTab, fetchTasks]);

  const confirmDelete = (id: string) => {
    setDeletingTaskId(id);
  };

  const handleStatusChange = async (id: string, status: string) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: status as any } : t))
    );
    try {
      await taskService.updateTaskStatus(id, status);
      toast.success("Status updated!");
    } catch {
      toast.error("Failed to update status");
      fetchTasks(filters, activeTab);
    }
  };

  const executeDelete = async () => {
    if (!deletingTaskId) return;
    setIsDeleting(true);
    try {
      await taskService.deleteTask(deletingTaskId);
      toast.success("Task deleted");
      fetchTasks(filters, activeTab);
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
      setDeletingTaskId(null);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await taskService.restoreTask(id);
      toast.success("Task restored successfully");
      fetchTasks(filters, activeTab);
    } catch {
      toast.error("Failed to restore task");
    }
  };

  const updateFilter = (key: keyof TaskFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <DashboardLayout requireAdmin>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Tasks</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage every task in the system</p>
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
            <Button variant="primary" onClick={() => router.push("/tasks/create")}>
              <Plus size={16} />
              New Task
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mt-6">
          <button
            onClick={() => { setActiveTab("active"); setFilters((prev) => ({ ...prev, page: 1 })); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "active"
                ? "border-violet-500 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Active Tasks
          </button>
          <button
            onClick={() => { setActiveTab("deleted"); setFilters((prev) => ({ ...prev, page: 1 })); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "deleted"
                ? "border-rose-500 text-rose-600 dark:border-rose-400 dark:text-rose-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Deleted Tasks 🗑️
          </button>
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
            <Select options={statusOptions} onChange={(e) => updateFilter("status", e.target.value)} />
            <Select options={priorityOptions} onChange={(e) => updateFilter("priority", e.target.value)} />
            <Select options={sortOptions} onChange={(e) => updateFilter("sortBy", e.target.value)} />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : tasks.length === 0 ? (
          <EmptyState title="No tasks found" description="Create the first task." actionLabel="Create Task" onAction={() => router.push("/tasks/create")} />
        ) : (
          <>
            {viewMode === "list" || activeTab === "deleted" ? (
              <TaskTable 
                tasks={tasks} 
                isAdmin={true} 
                canCreateTask={true}
                currentUserId={user?._id}
                onDelete={activeTab === "active" ? confirmDelete : undefined}
                onStatusChange={handleStatusChange}
                onTaskClick={setSelectedModalTask}
                isDeletedTab={activeTab === "deleted"}
                onRestore={handleRestore}
              />
            ) : viewMode === "calendar" ? (
              <TaskCalendarView tasks={tasks} onTaskClick={setSelectedModalTask} />
            ) : (
              <TaskKanbanBoard
                tasks={tasks}
                isAdmin={true}
                canCreateTask={true}
                currentUserId={user?._id}
                onDelete={confirmDelete}
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