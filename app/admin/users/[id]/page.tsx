"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Loading } from "@/components/common/Loading";
import { EmptyState } from "@/components/common/EmptyState";
import { TaskTable } from "@/components/tasks/TaskTable";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { userService } from "@/services/userService";
import { taskService } from "@/services/taskService";
import { User } from "@/types/user";
import { Task, TaskFilters } from "@/types/task";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Calendar, ShieldCheck, Mail } from "lucide-react";
import { formatDate } from "@/utils/helpers";
import toast from "react-hot-toast";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userData, tasksData] = await Promise.all([
        userService.getUserById(userId),
        taskService.getTasks({ assignedTo: userId, limit: 100 }) // Fetching up to 100 tasks for simplicity
      ]);
      setUser(userData);
      setTasks(tasksData.tasks);
    } catch {
      toast.error("Failed to load user details");
      router.push("/admin/users");
    } finally {
      setIsLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    if (userId) fetchUserDetails();
  }, [userId, fetchUserDetails]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await taskService.updateTaskStatus(id, status);
      toast.success("Status updated!");
      fetchUserDetails();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingTaskId(id);
  };

  const executeDelete = async () => {
    if (!deletingTaskId) return;
    setIsDeleting(true);
    try {
      await taskService.deleteTask(deletingTaskId);
      toast.success("Task deleted");
      fetchUserDetails();
    } catch {
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
      setDeletingTaskId(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout requireAdmin>
        <Loading text="Loading user profile..." />
      </DashboardLayout>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout requireAdmin>
      <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        
        {/* Back button */}
        <button 
          onClick={() => router.push("/admin/users")}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Users
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600" />
          <div className="px-6 pb-6 relative">
            <div className="-mt-10 mb-4 flex justify-between items-end">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg shrink-0">
                <span className="text-white text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${user.role === "admin" ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-600"}`}>
                  {user.role === "admin" && <ShieldCheck size={14} />}
                  {user.role}
                </span>
                {user.role === "user" && user.canCreateTask && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                    Can Create Tasks
                  </span>
                )}
              </div>
            </div>
            
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Mail size={15} className="text-gray-400" />
                {user.email}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={15} className="text-gray-400" />
                Joined {formatDate(user.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Assigned Tasks</h3>
            <p className="text-sm text-gray-500">Tasks currently assigned to {user.name}</p>
          </div>

          {tasks.length === 0 ? (
            <EmptyState 
              title="No tasks assigned" 
              description={`${user.name} does not have any tasks assigned to them right now.`}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-2">
              <TaskTable
                tasks={tasks}
                isAdmin={true}
                canCreateTask={true}
                currentUserId={currentUser?._id}
                hideActions={true}
              />
            </div>
          )}
        </div>
      </div>

      {/* Delete Task Modal */}
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
