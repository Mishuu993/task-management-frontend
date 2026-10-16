import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { activityService, ActivityLog } from "@/services/activityService";
import { Activity, Edit, Plus, Trash2, CheckCircle2, UserCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Loading } from "../common/Loading";

export function MyActivityTimeline() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const response = await activityService.getMyLogs(currentPage, 10);
      setLogs(response.logs || []);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch personal activity logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const getActionIcon = (action: string) => {
    if (action.includes("CREATED")) return <Plus size={16} className="text-emerald-500" />;
    if (action.includes("DELETED")) return <Trash2 size={16} className="text-rose-500" />;
    if (action.includes("UPDATED") || action.includes("CHANGED")) return <Edit size={16} className="text-amber-500" />;
    return <Activity size={16} className="text-blue-500" />;
  };

  const getActionText = (log: ActivityLog) => {
    const actionMap: Record<string, string> = {
      "TASK_CREATED": "You created a task",
      "TASK_UPDATED": "You updated a task",
      "TASK_STATUS_CHANGED": "You changed task status",
      "TASK_DELETED": "You deleted a task",
      "TASK_RESTORED": "You restored a task",
      "PROFILE_UPDATED": "You updated your profile",
      "USER_LOGGED_IN": "You logged in to your account",
      "USER_LOGGED_OUT": "You logged out of your account",
      "USER_REGISTERED": "You registered your account",
      "PASSWORD_RESET": "You reset your password",
      "EMAIL_VERIFIED": "You verified your email",
      "USER_ROLE_CHANGED": "Your role was changed",
    };
    return actionMap[log.action] || "You performed an action";
  };

  if (isLoading && page === 1) {
    return <div className="p-8"><Loading text="Loading your history..." /></div>;
  }

  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl m-6">
        <Activity size={32} className="mx-auto mb-3 opacity-50" />
        <p>You haven't performed any activities yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4 space-y-8 pb-4">
        {logs.map((log) => (
          <div key={log._id} className="relative pl-6 animate-fade-in">
            {/* Timeline Dot */}
            <div className="absolute -left-[17px] top-1 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-sm">
              {getActionIcon(log.action)}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1.5">
              <div className="text-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {getActionText(log)}
                </span>
                {log.entityName && (
                  <span className="text-gray-600 dark:text-gray-400">
                    {" "}— <span className="font-medium text-violet-600 dark:text-violet-400">{log.entityName}</span>
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 font-medium">
                {format(new Date(log.createdAt), "MMM d, yyyy 'at' h:mm a")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-violet-600 disabled:opacity-50 disabled:hover:text-gray-600 transition-colors"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-violet-600 disabled:opacity-50 disabled:hover:text-gray-600 transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
