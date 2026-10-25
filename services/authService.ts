import { LoginCredentials, RegisterCredentials, AuthResponse } from "@/types/auth";
import api from "./api"; // Asli API connection import kiya

export const authService = {
  // 1. LOGIN API (Admin aur User dono yahi se login honge)
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Backend API ko Request bheji
    const response = await api.post("/v1/auth/login", credentials);

    if (response.data.data?.requiresEmailVerification) {
      return {
        token: "",
        user: null as any,
        requiresEmailVerification: true,
        email: response.data.data.email,
        message: response.data.data.message,
      };
    }

    // Backend se aaya hua Token aur User ki detail nikali
    const token = response.data.data.accessToken;
    const refreshToken = response.data.data.refreshToken;
    const user = response.data.data.user;

    // Is token aur user ko browser ke storage me save kiya
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(user));
    }

    return { token, user };
  },

  // 2. REGISTER API
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post("/v1/auth/register", {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      confirmPassword: credentials.confirmPassword,
    });

    return response.data;
  },

  // 3. LOGOUT
  logout: async () => {
    try {
      await api.post("/v1/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  // 4. GET PROFILE
  getProfile: async () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) return { user: JSON.parse(stored) };
    }
    throw { response: { data: { message: "Not authenticated" } } };
  },

  // 5. FORGOT PASSWORD (Send OTP)
  forgotPassword: async (email: string) => {
    const response = await api.post("/v1/auth/forgot-password", { email });
    return response.data;
  },

  // 6. VERIFY RESET OTP
  verifyResetOtp: async (email: string, otp: string) => {
    const response = await api.post("/v1/auth/verify-forgot-password-otp", { email, otp });
    return response.data;
  },

  // 7. RESET PASSWORD
  resetPassword: async (resetToken: string, newPassword: string, confirmPassword: string) => {
    const response = await api.post("/v1/auth/reset-password", { resetToken, newPassword, confirmPassword });
    return response.data;
  },

  // 8. VERIFY EMAIL
  verifyEmail: async (email: string, otp: string) => {
    const response = await api.post("/v1/auth/verify-email", { email, otp });
    const data = response.data?.data;
    if (data?.accessToken && data?.user) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    }
    return response.data;
  },

  // 9. RESEND VERIFICATION OTP
  resendVerificationOtp: async (email: string) => {
    const response = await api.post("/v1/auth/resend-verification-otp", { email });
    return response.data;
  },
};