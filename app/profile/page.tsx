"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatDate, getErrorMessage } from "@/utils/helpers";
import { Calendar, ShieldCheck, Activity, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { userService } from "@/services/userService";
import { MyActivityTimeline } from "@/components/profile/MyActivityTimeline";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [showActivity, setShowActivity] = useState(false);
  
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Jab page khule ya user data aaye, toh naam automatically bhar do
  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  // Ye function tab chalega jab "Save Changes" dabaya jayega
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Backend ko data bhej rahe hain
      const updatedUser = await userService.updateProfile({
        name,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });

      // Context (Global State) me naya data set kar rahe hain
      updateUser(updatedUser);
      
      toast.success("Profile updated successfully!");
      
      // Password ke dabbe khali kar do taaki screen saaf lage
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        
        {/* PROFILE CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600" />
          
          <div className="px-6 pb-6">
            <div className="-mt-12 mb-4 flex justify-between items-end">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg">
                <span className="text-white text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  {user?.role === "admin" && <ShieldCheck size={14} className="text-violet-500" />}
                  <span className="text-sm text-gray-500 dark:text-gray-400 capitalize font-medium">{user?.role}</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setShowActivity(true)}
                className="flex items-center gap-2"
              >
                <Activity size={16} />
                My Activity
              </Button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 pb-2">Profile Information</h3>
                <Input
                  id="name"
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  id="email"
                  label="Email Address"
                  value={user?.email || ""}
                  disabled
                  helperText="Email address cannot be changed."
                />
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 border-b dark:border-gray-700 pb-2">Change Password</h3>
                <Input
                  id="currentPassword"
                  type="password"
                  label="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <Input
                  id="newPassword"
                  type="password"
                  label="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="pt-4">
                <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* ACTIVITY MODAL */}
        {showActivity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity size={20} className="text-violet-500" />
                  My Recent Activity
                </h3>
                <button 
                  onClick={() => setShowActivity(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto custom-scrollbar">
                <MyActivityTimeline />
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}