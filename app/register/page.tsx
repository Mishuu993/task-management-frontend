"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations";
import { useAuth } from "@/hooks/useAuth";
import { RegisterCredentials } from "@/types/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/utils/helpers";
import toast from "react-hot-toast";
import Link from "next/link";
import { CheckSquare, UserPlus, Clock, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterCredentials) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success("Account created successfully!");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="light min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-white to-indigo-50 text-gray-900">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 p-8 border border-gray-100">
          {isSubmitted ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <Clock size={32} className="text-amber-600 animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Awaiting Admin Approval</h2>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Your account for <span className="font-semibold text-gray-800">{submittedEmail}</span> has been created successfully.
              </p>
              <div className="mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 leading-relaxed text-left">
                ℹ️ For security, new accounts require administrator approval before logging in. You will receive an email once your account is approved.
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Button
                  type="button"
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => router.push("/login")}
                >
                  Proceed to Login <ArrowRight size={16} />
                </Button>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
                >
                  Register another account
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                  <UserPlus size={26} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
                <p className="text-sm text-gray-500 mt-1">Join TaskFlow today — it is free</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  id="name"
                  label="Full name"
                  placeholder="Rahul Sharma"
                  autoComplete="name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  id="reg-email"
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  id="reg-password"
                  label="Password"
                  type="password"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  error={errors.password?.message}
                  {...register("password")}
                />
                <Input
                  id="confirm-password"
                  label="Confirm password"
                  type="password"
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
                <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-2">
                  Create Account
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-violet-600 font-semibold hover:text-violet-800">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
          <CheckSquare size={13} className="text-violet-400" />
          <span>TaskFlow – Stay organized, stay ahead</span>
        </div>
      </div>
    </div>
  );
}
