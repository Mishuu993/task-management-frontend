"use client";
import { useState } from "react";
import { Task } from "@/types/task";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { TaskDetailModal } from "./TaskDetailModal";
import { formatDate } from "@/utils/helpers";
import { CalendarDays, User } from "lucide-react";
import Link from "next/link";

interface TaskCardProps {
  task: Task;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  onClick?: (task: Task) => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function TaskCard({
  task,
  showActions,
  onDelete,
  onStatusChange,
  onClick,
}: TaskCardProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusSelect = async (newStatus: string) => {
    if (newStatus === task.status || !onStatusChange) return;
    setIsChanging(true);
    try {
      await onStatusChange(task._id, newStatus);
    } finally {
      setIsChanging(false);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(task);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer relative"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-violet-600 transition-colors line-clamp-1">
            {task.title}
          </h3>
          <PriorityBadge priority={task.priority} />
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
          {task.description || "No description provided."}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <StatusBadge status={task.status} />

          {onStatusChange && (
            <select
              value={task.status}
              disabled={isChanging}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleStatusSelect(e.target.value)}
              className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 rounded-lg px-2.5 py-1 transition-colors cursor-pointer outline-none focus:border-violet-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Change: {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 border-t border-gray-50 dark:border-gray-700 pt-3 mt-1">
          <div className="flex items-center gap-1">
            <CalendarDays size={12} />
            <span>{formatDate(task.dueDate)}</span>
          </div>
          {task.assignedTo && (
            <div className="flex items-center gap-1">
              <User size={12} />
              <span>{task.assignedTo.name}</span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50 dark:border-gray-700">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="flex-1 text-center text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View
            </button>
            <Link
              href={`/tasks/${task._id}/edit`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-center text-xs font-medium text-violet-600 hover:text-violet-800 py-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
            >
              Edit
            </Link>
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task._id);
                }}
                className="flex-1 text-xs font-medium text-rose-500 hover:text-rose-700 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal with blurred backdrop */}
      <TaskDetailModal
        task={task}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
