"use client";
import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Loading } from "@/components/common/Loading";
import { activityService, ActivityLog } from "@/services/activityService";
import { format } from "date-fns";
import { ShieldCheck, UserCircle, Activity, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getErrorMessage } from "@/utils/helpers";
import toast from "react-hot-toast";

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  const fetchLogs = async (currentPage: number) => {
    setIsLoading(true);
    try {
      const response = await activityService.getGlobalLogs(currentPage, 15);
      setLogs(response.logs || []);
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages);
        setTotalLogs(response.pagination.totalLogs);
      }
    } catch (error) {
      toast.error(getErrorMessage(error) || "Failed to fetch activity logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const getActionBadge = (action: string) => {
    if (action.includes("CREATED")) return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Created</span>;
    if (action.includes("DELETED")) return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">Deleted</span>;
    if (action.includes("UPDATED") || action.includes("CHANGED")) return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Updated</span>;
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Action</span>;
  };

  const getActionDescription = (log: ActivityLog) => {
    const actionMap: Record<string, string> = {
      "TASK_CREATED": "Created Task",
      "TASK_UPDATED": "Updated Task",
      "TASK_STATUS_CHANGED": "Changed Task Status",
      "TASK_DELETED": "Deleted Task",
      "TASK_RESTORED": "Restored Task",
      "USER_ROLE_CHANGED": "Changed User Role",
      "PROFILE_UPDATED": "Updated Profile",
      "USER_DELETED": "Deleted User",
      "USER_RESTORED": "Restored User",
      "USER_LOGGED_IN": "Logged In",
      "USER_LOGGED_OUT": "Logged Out",
      "USER_REGISTERED": "Registered Account",
      "PASSWORD_RESET": "Reset Password",
      "EMAIL_VERIFIED": "Verified Email",
    };
    return actionMap[log.action] || log.action;
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="text-violet-600" />
              System Audit Logs
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Global activity history for all users and tasks in the system.
            </p>
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
            Total Logs: <span className="text-violet-600 dark:text-violet-400 font-bold">{totalLogs}</span>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                  <th className="px-6 py-4 font-semibold">Actor</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold">Target Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12">
                      <Loading text="Loading system logs..." />
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">
                        {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {log.actor?.name?.charAt(0).toUpperCase() || "S"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {log.actor?.name || "System"}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              {log.actorRole === "admin" ? <ShieldCheck size={12} className="text-rose-500" /> : <UserCircle size={12} className="text-blue-500" />}
                              <span className="capitalize">{log.actorRole || "system"}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5 items-start">
                          {getActionBadge(log.action)}
                          <span className="text-gray-600 dark:text-gray-300 font-medium">
                            {getActionDescription(log)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {log.entityName || "-"}
                          </p>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mt-0.5">
                            {log.entityType} • {log.entityId.slice(-6)}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && logs.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page <span className="font-medium text-gray-900 dark:text-white">{page}</span> of{" "}
                <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
