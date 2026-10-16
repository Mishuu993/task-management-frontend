"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validations";
import { useAuth } from "@/hooks/useAuth";
import { LoginCredentials } from "@/types/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/utils/helpers";
import toast from "react-hot-toast";
import Link from "next/link";
import { CheckSquare, ShieldCheck, User } from "lucide-react";



export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success("Welcome to TaskFlow!");
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;
      router.push(user?.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="light min-h-screen flex bg-white text-gray-900">
      {/* Left panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white" style={{ width: `${(i + 2) * 120}px`, height: `${(i + 2) * 120}px`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
          ))}
        </div>
        <div className="relative text-white max-w-md text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/30 shadow-2xl">
            <CheckSquare size={36} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">TaskFlow</h1>
          <p className="text-lg text-white/80 leading-relaxed mb-10">Manage tasks efficiently. Stay organized, stay productive.</p>
          <div className="grid grid-cols-3 gap-4">
            {[{ label: "Tasks", value: "12+" }, { label: "Users", value: "5+" }, { label: "Status", value: "Live" }].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6" style={{backgroundColor: 'white'}}>
        <div className="w-full max-w-md space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2 lg:hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <CheckSquare size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500 mt-1">Sign in to your account to continue</p>
          </div>



          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
            <Input
              id="email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="off"
              error={errors.email?.message}
              {...register("email")}
            />
            <div>
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                error={errors.password?.message}
                {...register("password")}
              />
              <div className="flex justify-end mt-1.5">
                <Link href="/forgot-password" className="text-sm text-violet-600 font-semibold hover:text-violet-800">
                  Forgot password?
                </Link>
              </div>
            </div>
            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full" size="lg">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Do not have an account?{" "}
            <Link href="/register" className="text-violet-600 font-semibold hover:text-violet-800">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}