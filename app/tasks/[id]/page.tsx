"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Loading } from "@/components/common/Loading";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { TaskActivityTimeline } from "@/components/tasks/TaskActivityTimeline";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { taskService } from "@/services/taskService";
import { Task } from "@/types/task";
import { formatDate, getErrorMessage } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { ArrowLeft, CalendarDays, User, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    taskService
      .getTaskById(id)
      .then(setTask)
      .catch(() => toast.error("Task not found"))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleStatusUpdate = async (status: string) => {
    if (!task) return;
    setUpdatingStatus(true);
    try {
      const updated = await taskService.updateTaskStatus(id, status);
      setTask(updated);
      toast.success("Status updated");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      await taskService.deleteTask(id);
      toast.success("Task deleted");
      router.push("/tasks");
    } catch (err) {
      toast.error(getErrorMessage(err));
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <Link href="/tasks" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} />
          Back to tasks
        </Link>
        {isLoading ? (
          <Loading text="Loading task..." />
        ) : task ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-xl font-bold text-white">{task.title}</h1>
                <PriorityBadge priority={task.priority} />
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <StatusBadge status={task.status} />
                <Select options={statusOptions} value={task.status} onChange={(e) => handleStatusUpdate(e.target.value)} className="text-xs py-1.5" />
                {updatingStatus && <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{task.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"><p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1">Due Date</p><div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200"><CalendarDays size={15} className="text-violet-500" />{formatDate(task.dueDate)}</div></div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"><p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1">Assigned To</p><div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200"><User size={15} className="text-violet-500" />{task.assignedTo?.name ?? "Unassigned"}</div></div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"><p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1">Created By</p><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{task.createdBy?.name ?? "Admin"}</p></div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"><p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1">Created Date</p><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{formatDate(task.createdAt)}</p></div>
              </div>
              <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6">
                <TaskActivityTimeline taskId={id as string} />
              </div>
              {/* Edit and Delete buttons removed as per user request */}
            </div>
          </div>
        ) : <div className="text-center py-20 text-gray-400 dark:text-gray-500">Task not found.</div>}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        onConfirm={executeDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={isDeleting}
        isDestructive={true}
      />
    </DashboardLayout>
  );
}
