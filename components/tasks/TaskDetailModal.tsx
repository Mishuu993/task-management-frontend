"use client";
import React, { useEffect, useState } from "react";
import { Task } from "@/types/task";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { TaskActivityTimeline } from "./TaskActivityTimeline";
import { formatDate, getErrorMessage } from "@/utils/helpers";
import { taskService } from "@/services/taskService";
import { CalendarDays, User, X, Pencil, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange?: (id: string, status: string) => void;
  canEdit?: boolean;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function TaskDetailModal({
  task: initialTask,
  isOpen,
  onClose,
  onStatusChange,
  canEdit = true,
}: TaskDetailModalProps) {
  const [task, setTask] = useState<Task | null>(initialTask);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    setTask(initialTask);
    if (initialTask?._id && isOpen) {
      // Fetch fresh details from existing taskService without breaking current flow
      taskService
        .getTaskById(initialTask._id)
        .then((fresh) => {
          if (fresh) setTask(fresh);
        })
        .catch(() => {
          // Fall back gracefully to initialTask if fetch fails
        });
    }
  }, [initialTask, isOpen]);

  // Handle ESC key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === task.status) return;
    setIsUpdatingStatus(true);
    try {
      if (onStatusChange) {
        await onStatusChange(task._id, newStatus);
      } else {
        await taskService.updateTaskStatus(task._id, newStatus);
        toast.success("Status updated!");
      }
      setTask((prev) => (prev ? { ...prev, status: newStatus as any } : null));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
    >
      {/* Blurred & Darkened Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 px-6 py-5 text-white flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <PriorityBadge priority={task.priority} />
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                  Task Details
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold leading-snug break-words">
                {task.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all flex-shrink-0"
              title="Close (Esc)"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-800 dark:text-gray-200">
          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status:
              </span>
              <StatusBadge status={task.status} />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={task.status}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-1.5 transition-colors cursor-pointer outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Change: {opt.label}
                  </option>
                ))}
              </select>
              {isUpdatingStatus && (
                <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Description
            </h3>
            <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
              {task.description || (
                <span className="text-gray-400 italic">No description provided.</span>
              )}
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Due Date */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1.5">
                Due Date
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                <CalendarDays size={16} className="text-violet-500" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            </div>

            {/* Assigned To */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1.5">
                Assigned To
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                <User size={16} className="text-violet-500" />
                <span>{task.assignedTo?.name || "Unassigned"}</span>
              </div>
            </div>

            {/* Created By */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1.5">
                Created By
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                <User size={16} className="text-indigo-500" />
                <span>{task.createdBy?.name || "Admin"}</span>
              </div>
            </div>

            {/* Created Date */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-1.5">
                Created On
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
                <Clock size={16} className="text-indigo-500" />
                <span>{formatDate(task.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Activity History
            </h3>
            <TaskActivityTimeline taskId={task._id} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50/80 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 flex-shrink-0">
          <div>
            {canEdit && (
              <Link
                href={`/tasks/${task._id}/edit`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 hover:underline px-3 py-2 rounded-xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
              >
                <Pencil size={14} />
                Edit Task
              </Link>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 active:scale-95 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
