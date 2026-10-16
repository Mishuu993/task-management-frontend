"use client";
import React, { useState } from "react";
import { Task } from "@/types/task";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { TaskDetailModal } from "./TaskDetailModal";
import { formatDate } from "@/utils/helpers";
import { Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface TaskTableProps {
  tasks: Task[];
  isAdmin?: boolean;
  canCreateTask?: boolean;
  currentUserId?: string;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  onTaskClick?: (task: Task) => void;
  hideActions?: boolean;
  isDeletedTab?: boolean;
  onRestore?: (id: string) => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function TaskTable({
  tasks,
  isAdmin,
  canCreateTask,
  currentUserId,
  onDelete,
  onStatusChange,
  onTaskClick,
  hideActions,
  isDeletedTab,
  onRestore,
}: TaskTableProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleRowClick = (task: Task) => {
    if (isDeletedTab) return;
    if (onTaskClick) {
      onTaskClick(task);
    } else {
      setSelectedTask(task);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Title</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Status</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Priority</th>
              <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Due Date</th>
              {isAdmin && <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Assigned To</th>}
              {!hideActions && <th className="text-right px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {tasks.map((task) => (
              <tr
                key={task._id}
                onClick={() => handleRowClick(task)}
                className={`hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors bg-white dark:bg-gray-900 cursor-pointer ${
                  isDeletedTab ? "opacity-75" : ""
                }`}
              >
                <td className="px-5 py-4 max-w-xs">
                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate flex items-center gap-2 hover:text-violet-600 transition-colors">
                    {task.title}
                    {isDeletedTab && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                        DELETED
                      </span>
                    )}
                  </p>
                </td>
                <td className="px-5 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={task.status} />
                    {!hideActions && !isDeletedTab && onStatusChange && (
                      <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task._id, e.target.value)}
                        className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg px-2 py-0.5 transition-colors cursor-pointer outline-none focus:border-violet-500"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-5 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(task.dueDate)}
                </td>
                {isAdmin && (
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {task.assignedTo?.name ?? "—"}
                  </td>
                )}
                {!hideActions && (
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {!isDeletedTab ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleRowClick(task)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                            title="View details"
                          >
                            <Eye size={15} />
                          </button>
                          {(isAdmin || (canCreateTask && task.createdBy?._id === currentUserId)) && (
                            <Link
                              href={`/tasks/${task._id}/edit`}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title="Edit task"
                            >
                              <Pencil size={15} />
                            </Link>
                          )}
                          {onDelete && (isAdmin || (canCreateTask && task.createdBy?._id === currentUserId)) && (
                            <button
                              type="button"
                              onClick={() => onDelete(task._id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                              title="Delete task"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </>
                      ) : (
                        <button 
                          className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border border-emerald-200 dark:border-emerald-800"
                          onClick={() => onRestore && onRestore(task._id)}
                        >
                          Restore ♻️
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal with blurred backdrop */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
