"use client";
import React, { useState } from "react";
import { Task } from "@/types/task";
import { formatDate } from "@/utils/helpers";
import { TaskDetailModal } from "./TaskDetailModal";
import { Pencil, Trash2, Eye, Calendar } from "lucide-react";
import Link from "next/link";
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface TaskKanbanBoardProps {
  tasks: Task[];
  isAdmin?: boolean;
  canCreateTask?: boolean;
  currentUserId?: string;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  onTaskClick?: (task: Task) => void;
}

const COLUMNS = [
  { id: "pending", title: "To Do", color: "border-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/10" },
  { id: "in-progress", title: "In Progress", color: "border-blue-400", bg: "bg-blue-50 dark:bg-blue-900/10" },
  { id: "completed", title: "Completed", color: "border-green-400", bg: "bg-green-50 dark:bg-green-900/10" },
];

function DroppableColumn({ id, title, color, bg, children, count }: any) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col flex-1 rounded-2xl border ${isOver ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-gray-100 dark:border-gray-800'} bg-gray-50/50 dark:bg-gray-800/30 overflow-hidden transition-all`}
    >
      {/* Column Header */}
      <div className={`p-4 border-t-4 ${color} ${bg} border-b border-b-gray-100 dark:border-b-gray-800 flex items-center justify-between`}>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        <span className="px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 text-xs font-bold text-gray-500 shadow-sm">{count}</span>
      </div>
      
      {/* Column Body */}
      <div className="flex-1 p-3 space-y-3 min-h-[200px]">
        {children}
        {isOver && <div className="h-24 rounded-xl border-2 border-dashed border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/10 animate-pulse" />}
      </div>
    </div>
  );
}

function DraggableCard({ task, isAdmin, canCreateTask, currentUserId, onDelete, onTaskClick }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id,
    data: task,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  const priorityColors = {
    low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    high: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  const handleClick = (e: React.MouseEvent) => {
    // If not dragging, trigger modal
    if (!isDragging && onTaskClick) {
      onTaskClick(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      className={`bg-white dark:bg-gray-900 rounded-xl p-4 border ${isDragging ? 'border-violet-500 shadow-xl' : 'border-gray-100 dark:border-gray-700 shadow-sm'} hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${priorityColors[task.priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-600'}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
           <button
             type="button"
             onPointerDown={(e) => e.stopPropagation()}
             onClick={(e) => {
               e.stopPropagation();
               onTaskClick?.(task);
             }}
             className="p-1 rounded text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
             title="View details"
           >
             <Eye size={14} />
           </button>
           {(isAdmin || (canCreateTask && task.createdBy?._id === currentUserId)) && (
             <Link
               href={`/tasks/${task._id}/edit`}
               onPointerDown={(e) => e.stopPropagation()}
               onClick={(e) => e.stopPropagation()}
               className="p-1 rounded text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
               title="Edit task"
             >
               <Pencil size={14} />
             </Link>
           )}
           {onDelete && (isAdmin || (canCreateTask && task.createdBy?._id === currentUserId)) && (
             <button
               type="button"
               onPointerDown={(e) => e.stopPropagation()}
               onClick={(e) => {
                 e.stopPropagation();
                 onDelete(task._id);
               }}
               className="p-1 rounded text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
               title="Delete task"
             >
               <Trash2 size={14} />
             </button>
           )}
        </div>
      </div>
      
      <div className="group-hover:text-violet-600 transition-colors">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-violet-600">
          {task.title}
        </h4>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Calendar size={13} />
          {formatDate(task.dueDate)}
        </div>
        {task.assignedTo && (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm" title={task.assignedTo.name}>
            {task.assignedTo.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskKanbanBoard({
  tasks,
  isAdmin,
  canCreateTask,
  currentUserId,
  onDelete,
  onStatusChange,
  onTaskClick,
}: TaskKanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires 5px movement before dragging starts
      },
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: any) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return; // Dropped outside

    const taskId = active.id;
    const newStatus = over.id; // column id is the status
    const task = tasks.find(t => t._id === taskId);

    if (task && task.status !== newStatus && onStatusChange) {
      onStatusChange(taskId, newStatus);
    }
  };

  const handleCardClick = (task: Task) => {
    if (onTaskClick) {
      onTaskClick(task);
    } else {
      setSelectedTask(task);
    }
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 items-stretch w-full overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter(t => t.status === col.id);
            return (
              <DroppableColumn key={col.id} id={col.id} title={col.title} color={col.color} bg={col.bg} count={colTasks.length}>
                {colTasks.map((task) => (
                  <DraggableCard 
                    key={task._id} 
                    task={task} 
                    isAdmin={isAdmin} 
                    canCreateTask={canCreateTask} 
                    currentUserId={currentUserId} 
                    onDelete={onDelete}
                    onTaskClick={handleCardClick}
                  />
                ))}
              </DroppableColumn>
            );
          })}
        </div>

        <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeTask ? (
            <DraggableCard 
              task={activeTask} 
              isAdmin={isAdmin} 
              canCreateTask={canCreateTask} 
              currentUserId={currentUserId} 
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Detail Modal with blurred backdrop */}
      <TaskDetailModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onStatusChange={onStatusChange}
      />
    </>
  );
}
