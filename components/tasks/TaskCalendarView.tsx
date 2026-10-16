import React, { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  parseISO 
} from "date-fns";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Task } from "@/types/task";

interface TaskCalendarViewProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export function TaskCalendarView({ tasks, onTaskClick }: TaskCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  // Group tasks by date string (YYYY-MM-DD)
  const getTasksForDate = (day: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, day);
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30";
      case "medium":
        return "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 border-orange-200 dark:border-orange-500/30";
      case "low":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700";
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your deadlines
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Today
          </button>
          <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <button
              onClick={prevMonth}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 border-r border-gray-300 dark:border-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-all dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const dateFormat = "EEEE";
    const days = [];
    let startDateOfWeek = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div
          className="py-3 flex justify-center items-center text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700"
          key={i}
        >
          {format(addDays(startDateOfWeek, i), dateFormat).substring(0, 3)}
        </div>
      );
    }
    return <div className="grid grid-cols-7 w-full">{days}</div>;
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const dayTasks = getTasksForDate(cloneDay);
        const isToday = isSameDay(day, new Date());
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            className={`min-h-[140px] border-b border-r border-gray-200 dark:border-gray-700 p-2 transition-colors relative group
              ${!isCurrentMonth ? "bg-gray-50/50 dark:bg-gray-900/30" : "bg-white dark:bg-gray-800"} 
              ${i === 6 ? "border-r-0" : ""}
              hover:bg-gray-50 dark:hover:bg-gray-700/50`}
            key={day.toString()}
          >
            <div className="flex justify-between items-start mb-2">
              <span
                className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-all
                  ${
                    isToday
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/30"
                      : !isCurrentMonth
                      ? "text-gray-400 dark:text-gray-600"
                      : "text-gray-700 dark:text-gray-300"
                  }
                `}
              >
                {formattedDate}
              </span>
              
              {dayTasks.length > 0 && (
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                  {dayTasks.length} task{dayTasks.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[90px] custom-scrollbar pr-1">
              {dayTasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => onTaskClick?.(task)}
                  className={`text-xs px-2 py-1.5 rounded-md border truncate cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-sm ${getPriorityColor(
                    task.priority
                  )}`}
                  title={task.title}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium truncate">{task.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7 w-full border-l border-gray-200 dark:border-gray-700" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    
    return <div className="flex flex-col border-t border-gray-200 dark:border-gray-700 rounded-b-2xl overflow-hidden">{rows}</div>;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 overflow-hidden animate-fade-in">
      {renderHeader()}
      <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
        {renderDays()}
        {renderCells()}
      </div>
    </div>
  );
}
