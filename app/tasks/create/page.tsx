"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TaskForm } from "@/components/tasks/TaskForm";
import { taskService } from "@/services/taskService";
import { userService } from "@/services/userService";
import { TaskFormData } from "@/types/task";
import { User } from "@/types/user";
import { getErrorMessage } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateTaskPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "admin") {
      userService.getUsersList().then(setUsers).catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      const submitData = user?.role !== "admin" ? { ...data, assignedTo: user?._id || "" } : data;
      await taskService.createTask(submitData);
      toast.success("Task created successfully!");
      if (user?.role === "admin") {
        router.push("/admin/tasks");
      } else {
        router.push("/tasks");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Link href="/tasks" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} />
          Back to tasks
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Create New Task</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Fill in the details below to create a task.</p>
          <TaskForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            users={users}
            isAdmin={user?.role === "admin"}
            submitLabel="Create Task"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}