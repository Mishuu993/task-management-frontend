"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/utils/helpers";
import toast from "react-hot-toast";
import Link from "next/link";
import { MailCheck, CheckSquare } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email is missing. Please register again.");
      return;
    }
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyEmail(email, otp);
      toast.success("Email verified successfully! You can now log in.");
      router.push("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email is missing.");
      return;
    }

    setIsResending(true);
    try {
      await authService.resendVerificationOtp(email);
      toast.success("Verification code resent to your email.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 p-8 border border-gray-100">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
            <MailCheck size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify your email</h1>
          <p className="text-sm text-gray-500 mt-2">
            We have sent a verification code to <br />
            <span className="font-semibold text-gray-700">{email || "your email"}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            id="otp"
            label="Verification Code"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            autoComplete="one-time-code"
          />

          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-2">
            Verify Email
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-violet-600 font-semibold hover:text-violet-800 disabled:opacity-50 transition-colors"
            >
              {isResending ? "Sending..." : "Click to resend"}
            </button>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Back to log in
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
        <CheckSquare size={13} className="text-violet-400" />
        <span>TaskFlow – Stay organized, stay ahead</span>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="light min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-white to-indigo-50 text-gray-900">
      <Suspense fallback={<div className="w-full max-w-md text-center text-gray-500">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
