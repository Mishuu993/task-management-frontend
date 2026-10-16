import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "TaskFlow – Task Management System",
  description: "A modern task management system for teams and individuals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: "12px",
                background: "#1f2937",
                color: "#f9fafb",
                fontSize: "14px",
                fontWeight: "500",
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error: { 
                duration: 3000,
                iconTheme: { primary: "#f43f5e", secondary: "#fff" } 
              },
            }}
          />
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
