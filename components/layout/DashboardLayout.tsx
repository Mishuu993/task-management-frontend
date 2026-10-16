"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Loading } from "@/components/common/Loading";

interface DashboardLayoutProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function DashboardLayout({ children, requireAdmin }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (requireAdmin && user?.role !== "admin") {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, requireAdmin, user, router]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [children]);

  if (isLoading) return <Loading text="Loading your workspace..." />;
  if (!isAuthenticated) return null;
  if (requireAdmin && user?.role !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
