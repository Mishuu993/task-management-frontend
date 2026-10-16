"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Loading } from "@/components/common/Loading";
import { TaskForm } from "@/components/tasks/TaskForm";
import { taskService } from "@/services/taskService";
import { userService } from "@/services/userService";
import { Task, TaskFormData } from "@/types/task";
import { User } from "@/types/user";
import { getErrorMessage } from "@/utils/helpers";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      taskService.getTaskById(id),
      user?.role === "admin" ? userService.getUsersList() : Promise.resolve([]),
    ])
      .then(([t, u]) => {
        setTask(t);
        setUsers(u);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setIsLoading(false));
  }, [id, user]);

  const handleSubmit = async (data: TaskFormData) => {
    setIsSaving(true);
    try {
      await taskService.updateTask(id, data);
      toast.success("Task updated successfully");
      if (user?.role === "admin") {
        router.push("/admin/tasks");
      } else {
        router.push("/tasks");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Link href={`/tasks/${id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 transition-colors">
          <ArrowLeft size={16} />
          Back to task
        </Link>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Edit Task</h1>
          {isLoading ? (
            <Loading text="Loading task..." />
          ) : task ? (
            <TaskForm
              defaultValues={{
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate?.split("T")[0],
                assignedTo: task.assignedTo?._id,
              }}
              onSubmit={handleSubmit}
              isLoading={isSaving}
              users={users}
              isAdmin={user?.role === "admin"}
              submitLabel="Update Task"
            />
          ) : (
            <p className="text-gray-400 text-sm">Task not found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}