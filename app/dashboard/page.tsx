"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { taskService } from "@/services/taskService";
import { DashboardStats } from "@/types/task";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Loading } from "@/components/common/Loading";
import { StatCardSkeleton, CardGridSkeleton } from "@/components/common/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { CheckSquare, Clock, Loader2, TrendingUp, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import Link from "next/link";

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center", color)}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await taskService.getDashboardStats();
      setStats(res);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      toast.success("Task status updated!");
      await fetchStats();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Good to see you, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here is a summary of your tasks.
          </p>
        </div>

        {isLoading ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)}
            </div>
            <div>
              <div className="h-7 w-32 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse mb-4" />
              <CardGridSkeleton count={3} />
            </div>
          </>
        ) : stats ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <StatCard label="Total Tasks" value={stats.totalTasks} icon={CheckSquare} color="bg-gradient-to-br from-violet-500 to-indigo-600" />
              <StatCard label="Pending" value={stats.pendingTasks} icon={Clock} color="bg-gradient-to-br from-amber-400 to-orange-500" />
              <StatCard label="In Progress" value={stats.inProgressTasks} icon={Loader2} color="bg-gradient-to-br from-blue-400 to-cyan-500" />
              <StatCard label="Completed" value={stats.completedTasks} icon={TrendingUp} color="bg-gradient-to-br from-emerald-400 to-teal-500" />
              <StatCard label="High Priority" value={stats.highPriorityTasks} icon={AlertTriangle} color="bg-gradient-to-br from-rose-400 to-red-500" />
            </div>

            {/* Recent Tasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Tasks</h2>
                <Link
                  href="/tasks"
                  className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
                >
                  View All Tasks ({stats.totalTasks}) →
                </Link>
              </div>
              {stats.recentTasks?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.recentTasks.map((task) => (
                    <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 text-gray-400 dark:text-gray-500 text-sm">
                  No tasks yet. Create your first task to get started.
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
