"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { notificationService } from "@/services/notificationService";
import { AppNotification } from "@/types/notification";
import {
  Bell,
  User,
  Check,
  CheckCircle2,
  ClipboardList,
  RefreshCw,
  Trash2,
  Menu,
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load notifications and unread count from real backend API
  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotifications("all", 1, 20);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  }, [user]);

  // Polling unread count & notifications every 10 seconds
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (item: AppNotification) => {
    const notifId = item._id || item.id;
    if (notifId && (!item.isRead && !item.read)) {
      await notificationService.markAsRead(notifId);
      loadNotifications();
    }
    setIsOpen(false);

    // Navigate to related task if exists
    if (item.relatedId) {
      const taskId = typeof item.relatedId === "object" ? item.relatedId._id : item.relatedId;
      if (taskId) {
        router.push(`/tasks/${taskId}`);
        return;
      }
    }
    if (item.link) {
      router.push(item.link);
    }
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    await notificationService.markAllAsRead();
    await loadNotifications();
    setLoading(false);
  };

  const handleClearRead = async () => {
    setLoading(true);
    await notificationService.clearAllRead();
    await loadNotifications();
    setLoading(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "task_assigned":
      case "task_reassigned":
        return <ClipboardList size={16} />;
      case "task_deleted":
        return <Trash2 size={16} />;
      case "task_completed":
        return <CheckCircle2 size={16} />;
      case "task_status_changed":
      case "task_updated":
      default:
        return <RefreshCw size={16} />;
    }
  };

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "task_assigned":
      case "task_reassigned":
        return "bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400";
      case "task_completed":
        return "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400";
      case "task_deleted":
        return "bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400";
      default:
        return "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400";
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-2">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
          <span className="text-white text-xs font-bold">T</span>
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-lg hidden sm:block">
          TaskFlow
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Real Notification Bell Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              loadNotifications();
              setIsOpen(!isOpen);
            }}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
            title="Notifications"
          >
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      disabled={loading}
                      className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 flex items-center gap-1 transition-colors"
                    >
                      <Check size={13} /> Mark all read
                    </button>
                  )}
                  {notifications.some((n) => n.isRead || n.read) && (
                    <button
                      onClick={handleClearRead}
                      disabled={loading}
                      title="Clear read notifications"
                      className="text-xs font-medium text-gray-400 hover:text-rose-500 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800/60">
                {notifications.length > 0 ? (
                  notifications.map((item) => {
                    const isItemRead = item.isRead ?? item.read ?? false;
                    const notifId = item._id || item.id;
                    return (
                      <div
                        key={notifId}
                        onClick={() => handleNotificationClick(item)}
                        className={clsx(
                          "p-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer flex items-start gap-3",
                          !isItemRead
                            ? "bg-violet-50/50 dark:bg-violet-950/20"
                            : "bg-white dark:bg-gray-900"
                        )}
                      >
                        <div
                          className={clsx(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                            getNotificationBadgeColor(item.type)
                          )}
                        >
                          {getNotificationIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {item.title}
                            </p>
                            {!isItemRead && (
                              <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                            {new Date(item.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            •{" "}
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-xs flex flex-col items-center gap-2">
                    <CheckCircle2 size={24} className="text-gray-300 dark:text-gray-600" />
                    <span>No notifications yet</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/profile"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
            <User size={14} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">
              {user?.name}
            </p>
            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
