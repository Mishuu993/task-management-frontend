"use client";
import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Loading } from "@/components/common/Loading";
import { TableSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { userService } from "@/services/userService";
import { User } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/utils/helpers";
import { Search, Trash2, Eye, ShieldCheck, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "deleted">("active");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "user">("user");
  const [editCanCreateTask, setEditCanCreateTask] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    if (search !== debouncedSearch) {
      setSearch(debouncedSearch);
      setPage(1);
    }
  }, [debouncedSearch, search]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getUsers({ 
        search, 
        page, 
        limit: 10, 
        onlyDeleted: activeTab === "deleted" 
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, [search, page, activeTab]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const confirmDelete = (id: string) => {
    setDeletingUserId(id);
  };

  const executeDelete = async () => {
    if (!deletingUserId) return;
    setIsSaving(true);
    try {
      await userService.deleteUser(deletingUserId);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setIsSaving(false);
      setDeletingUserId(null);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await userService.restoreUser(id);
      toast.success("User restored successfully");
      fetchUsers();
    } catch {
      toast.error("Failed to restore user");
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role);
    setEditCanCreateTask(user.canCreateTask || false);
  };

  const closeEditModal = () => {
    setEditingUser(null);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSaving(true);
    try {
      await userService.updateUserByAdmin(editingUser._id, { name: editName, role: editRole, canCreateTask: editCanCreateTask });
      toast.success("User updated successfully");
      closeEditModal();
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout requireAdmin>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Manage all registered users</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => { setActiveTab("active"); setPage(1); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "active"
                ? "border-violet-500 text-violet-600 dark:border-violet-400 dark:text-violet-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Active Users
          </button>
          <button
            onClick={() => { setActiveTab("deleted"); setPage(1); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "deleted"
                ? "border-rose-500 text-rose-600 dark:border-rose-400 dark:text-rose-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            Deleted Users 🗑️
          </button>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
          <div className="relative max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <TableSkeleton rows={6} cols={6} />
        ) : users.length === 0 ? (
          <EmptyState title="No users found" description="Try adjusting your search." />
        ) : (
          <>
            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Name</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Role</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Tasks</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Joined</th>
                    <th className="text-right px-5 py-3.5 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {users.map((u) => (
                    <tr key={u._id} className={`hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors bg-white dark:bg-gray-900 ${activeTab === 'deleted' ? 'opacity-75' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${activeTab === 'deleted' ? 'bg-gray-400' : 'bg-gradient-to-br from-violet-500 to-indigo-600'}`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                              {u.name}
                              {activeTab === 'deleted' && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">DELETED</span>}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}>
                          {u.role === "admin" && <ShieldCheck size={11} />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{u.taskCount ?? 0}</td>
                      <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{formatDate(u.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {activeTab === "active" ? (
                            <>
                              <button className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors" onClick={() => router.push(`/admin/users/${u._id}`)} title="View Profile & Tasks">
                                <Eye size={15} />
                              </button>
                              <button className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors" onClick={() => openEditModal(u)} title="Edit User">
                                <Pencil size={15} />
                              </button>
                              <button className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors" onClick={() => confirmDelete(u._id)} title="Delete User">
                                <Trash2 size={15} />
                              </button>
                            </>
                          ) : (
                            <button 
                              className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors border border-emerald-200 dark:border-emerald-800"
                              onClick={() => handleRestore(u._id)}
                            >
                              Restore ♻️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editingUser} onClose={closeEditModal} title="Edit User Details">
        <form onSubmit={handleUpdateUser} className="space-y-4">
          <Input 
            label="Full Name" 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)} 
            required 
          />
          <Input 
            label="Email Address" 
            value={editingUser?.email || ""} 
            disabled 
            helperText="Email cannot be changed." 
          />
          <Select 
            label="Role" 
            value={editRole} 
            onChange={(e) => setEditRole(e.target.value as "admin" | "user")} 
            options={[
              { label: "User", value: "user" },
              { label: "Admin", value: "admin" },
            ]} 
          />
          {editRole === "user" && (
            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Task Creation Access</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Allow this user to create and manage their own tasks</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={editCanCreateTask} onChange={(e) => setEditCanCreateTask(e.target.checked)} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={closeEditModal}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingUserId}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        onConfirm={executeDelete}
        onCancel={() => setDeletingUserId(null)}
        isLoading={isSaving}
        isDestructive={true}
      />
    </DashboardLayout>
  );
}