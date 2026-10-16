import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { taskService } from "@/services/taskService";
import { Activity, Edit, Plus, Trash2, CheckCircle2, UserCircle2 } from "lucide-react";

interface ActivityLog {
  _id: string;
  actor: { name: string; email: string };
  action: string;
  metadata: any;
  createdAt: string;
}

export function TaskActivityTimeline({ taskId }: { taskId: string }) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await taskService.getTaskActivity(taskId);
        setLogs(response.logs || []);
      } catch (error) {
        console.error("Failed to fetch activity logs");
      } finally {
        setIsLoading(false);
      }
    };
    if (taskId) fetchLogs();
  }, [taskId]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "TASK_CREATED":
        return <Plus size={16} className="text-emerald-500" />;
      case "TASK_STATUS_CHANGED":
        return <CheckCircle2 size={16} className="text-violet-500" />;
      case "TASK_UPDATED":
        return <Edit size={16} className="text-amber-500" />;
      case "TASK_DELETED":
        return <Trash2 size={16} className="text-rose-500" />;
      default:
        return <Activity size={16} className="text-blue-500" />;
    }
  };

  const getActionText = (log: ActivityLog) => {
    const actorName = log.actor?.name || "System";
    switch (log.action) {
      case "TASK_CREATED":
        return <span className="text-gray-700 dark:text-gray-300"><b>{actorName}</b> created this task</span>;
      case "TASK_STATUS_CHANGED":
        return (
          <span className="text-gray-700 dark:text-gray-300">
            <b>{actorName}</b> changed status to <span className="font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 text-xs">{log.metadata?.newStatus}</span>
          </span>
        );
      case "TASK_UPDATED":
        return <span className="text-gray-700 dark:text-gray-300"><b>{actorName}</b> updated the task details</span>;
      case "TASK_DELETED":
        return <span className="text-gray-700 dark:text-gray-300"><b>{actorName}</b> deleted this task</span>;
      default:
        return <span className="text-gray-700 dark:text-gray-300"><b>{actorName}</b> performed an action</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse p-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex gap-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Activity size={32} className="mx-auto mb-2 opacity-50" />
        <p>No activity recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Activity size={20} className="text-violet-500" />
        Activity Timeline
      </h3>
      <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4 space-y-8">
        {logs.map((log) => (
          <div key={log._id} className="relative pl-6 animate-fade-in">
            {/* Timeline Dot */}
            <div className="absolute -left-[17px] top-1 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center">
              {getActionIcon(log.action)}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <div className="text-sm">
                {getActionText(log)}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <Clock size={12} />
                {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Dummy Clock Icon (in case lucide-react doesn't have it directly mapped to Clock)
const Clock = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
