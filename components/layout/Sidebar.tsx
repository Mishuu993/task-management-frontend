"use client";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import Link from "next/link";
import clsx from "clsx";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  UserCircle,
  LogOut,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";
import { useRouter } from "next/navigation";

const userNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/logs", label: "System Logs", icon: ClipboardList },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const navItems = user?.role === "admin" ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden transition-opacity" 
          onClick={onClose}
        />
      )}
      
      <aside className={clsx(
        "w-64 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 h-screen z-50 transition-all duration-300 ease-in-out",
        "fixed md:sticky top-0 left-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30">
            <CheckSquare size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">TaskFlow</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 capitalize flex items-center gap-1">
              {user?.role === "admin" && <ShieldCheck size={11} className="text-violet-500" />}
              {user?.role}
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-16">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-200 w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
      </aside>

      <ConfirmModal
        isOpen={showLogoutModal}
        title="Logout Confirmation"
        message="Are you sure you want to logout from TaskFlow?"
        confirmText="Yes, Logout"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        isDestructive={true}
      />
    </>
  );
}
