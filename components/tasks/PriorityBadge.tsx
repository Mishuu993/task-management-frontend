import clsx from "clsx";
import { TaskPriority } from "@/types/task";
import { getPriorityColor, capitalize } from "@/utils/helpers";

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const icons = { low: "▽", medium: "◈", high: "▲" };
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold",
        getPriorityColor(priority),
        className
      )}
    >
      <span>{icons[priority]}</span>
      {capitalize(priority)}
    </span>
  );
}
