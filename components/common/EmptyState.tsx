import { InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No items found",
  description = "Get started by creating your first item.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
        <InboxIcon size={28} className="text-gray-400" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-xs">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
