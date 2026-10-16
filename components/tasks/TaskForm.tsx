"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema } from "@/lib/validations";
import { TaskFormData } from "@/types/task";
import { User } from "@/types/user";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

interface TaskFormProps {
  defaultValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  isLoading?: boolean;
  users?: User[];
  isAdmin?: boolean;
  submitLabel?: string;
}

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TaskForm({
  defaultValues,
  onSubmit,
  isLoading,
  users = [],
  isAdmin,
  submitLabel = "Save Task",
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: defaultValues || { priority: "" as any, status: "" as any, assignedTo: "" },
    resolver: zodResolver(taskSchema),
  });

  const userOptions = users.map((u) => ({ value: u._id, label: u.name }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Title"
        placeholder="Enter task title"
        error={errors.title?.message}
        {...register("title", { required: "Title is required" })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          rows={4}
          placeholder="Describe the task..."
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all duration-200 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none"
          {...register("description")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Select
          label="Priority"
          options={priorityOptions}
          placeholder="Select priority"
          error={errors.priority?.message}
          {...register("priority", { required: "Priority is required" })}
        />
        <Select
          label="Status"
          options={statusOptions}
          placeholder="Select status"
          error={errors.status?.message}
          {...register("status", { required: "Status is required" })}
        />
      </div>

      <Input
        label="Due Date"
        type="date"
        error={errors.dueDate?.message}
        {...register("dueDate", { required: "Due date is required" })}
      />

      {isAdmin && userOptions.length > 0 && (
        <Select
          label="Assign To"
          options={userOptions}
          placeholder="Select user"
          {...register("assignedTo")}
        />
      )}

      <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
