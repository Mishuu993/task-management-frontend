"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { getErrorMessage } from "@/utils/helpers";
import toast from "react-hot-toast";
import Link from "next/link";
import { CheckSquare, KeyRound, Mail, Lock } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);

  // States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success("OTP sent to your email!");
      setStep("otp");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");

    setIsLoading(true);
    try {
      const response = await authService.verifyResetOtp(email, otp);
      setResetToken(response.data.resetToken);
      toast.success("OTP verified!");
      setStep("password");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error("Please fill all fields");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");

    setIsLoading(true);
    try {
      await authService.resetPassword(resetToken, newPassword, confirmPassword);
      toast.success("Password reset successfully! Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/80 p-8 border border-gray-100">

          {step === "email" && (
            <div className="animate-fade-in">
              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                  <Mail size={26} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
                <p className="text-sm text-gray-500 mt-1 text-center">Enter your email address to receive a verification code.</p>
              </div>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Input
                  id="email"
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
                <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-2">
                  Send OTP
                </Button>
              </form>
            </div>
          )}

          {step === "otp" && (
            <div className="animate-fade-in">
              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                  <KeyRound size={26} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
                <p className="text-sm text-gray-500 mt-1 text-center">We have sent a 6-digit code to <span className="font-medium text-gray-700">{email}</span></p>
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <Input
                  id="otp"
                  label="Enter OTP"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  autoComplete="one-time-code"
                />
                <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-2">
                  Verify Code
                </Button>
              </form>
            </div>
          )}

          {step === "password" && (
            <div className="animate-fade-in">
              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/30">
                  <Lock size={26} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
                <p className="text-sm text-gray-500 mt-1 text-center">Your new password must be different from previous used passwords.</p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  id="new-password"
                  label="New Password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-2">
                  Save Password
                </Button>
              </form>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link href="/login" className="text-violet-600 font-semibold hover:text-violet-800">
              Back to login
            </Link>
          </p>
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
