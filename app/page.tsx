"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/common/Loading";

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace(user?.role === "admin" ? "/admin" : "/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  return <Loading text="Redirecting..." />;
}
