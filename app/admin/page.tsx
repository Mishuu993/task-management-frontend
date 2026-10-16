"use client";
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { taskService } from "@/services/taskService";
import { AdminDashboardStats } from "@/types/task";
import { Loading } from "@/components/common/Loading";
import { StatCardSkeleton } from "@/components/common/Skeleton";
import { Users, CheckSquare, Clock, Loader2, TrendingUp, AlertTriangle } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import Link from "next/link";
import { DashboardCharts } from "@/components/charts/DashboardCharts";


function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href?: string;
}) {
  const card = (
    <div className={clsx("bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm transition-all", href && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer")}>
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
  return href ? <Link href={href}>{card}</Link> : card;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    taskService
      .getAdminStats()
      .then(setStats)
      .catch(() => toast.error("Failed to load admin stats"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout requireAdmin>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of all system activity</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
        ) : stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="bg-gradient-to-br from-violet-500 to-indigo-600" href="/admin/users" />
            <StatCard label="Total Tasks" value={stats.totalTasks} icon={CheckSquare} color="bg-gradient-to-br from-blue-500 to-cyan-500" href="/admin/tasks" />
            <StatCard label="Pending" value={stats.pendingTasks} icon={Clock} color="bg-gradient-to-br from-amber-400 to-orange-500" />
            <StatCard label="In Progress" value={stats.inProgressTasks} icon={Loader2} color="bg-gradient-to-br from-sky-400 to-blue-500" />
            <StatCard label="Completed" value={stats.completedTasks} icon={TrendingUp} color="bg-gradient-to-br from-emerald-400 to-teal-500" />
            <StatCard label="High Priority" value={stats.highPriorityTasks} icon={AlertTriangle} color="bg-gradient-to-br from-rose-400 to-red-500" />
          </div>
        ) : null}

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/admin/users" className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center group-hover:bg-violet-600 transition-colors">
                <Users size={18} className="text-violet-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Manage Users</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">View, search and delete users</p>
              </div>
            </div>
          </Link>
          <Link href="/admin/tasks" className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                <CheckSquare size={18} className="text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">Manage Tasks</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Create, assign and track tasks</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Charts Section */}
        {!isLoading && stats && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Analytics Overview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Visual breakdown of task data</p>
            </div>
            <DashboardCharts
              pendingTasks={stats.pendingTasks}
              inProgressTasks={stats.inProgressTasks}
              completedTasks={stats.completedTasks}
              totalTasks={stats.totalTasks}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}