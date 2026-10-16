import clsx from "clsx";
import { TaskStatus } from "@/types/task";
import { getStatusColor, capitalize } from "@/utils/helpers";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        getStatusColor(status),
        className
      )}
    >
      <span className="mr-1">
        {status === "completed" ? "✓" : status === "in-progress" ? "●" : "○"}
      </span>
      {status === "in-progress" ? "In Progress" : capitalize(status)}
    </span>
  );
}
