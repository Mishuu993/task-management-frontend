"use client";
import { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TableSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Pagination } from "@/components/common/Pagination";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/Button";
import { userService } from "@/services/userService";
import { User } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/utils/helpers";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminApprovalsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "rejected">("pending");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Approve action modal state
  const [userToApprove, setUserToApprove] = useState<User | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  // Reject action modal state
  const [userToReject, setUserToReject] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    if (search !== debouncedSearch) {
      setSearch(debouncedSearch);
      setPage(1);
    }
  }, [debouncedSearch, search]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeTab === "pending") {
        const data = await userService.getPendingUsers(page, 10, search);
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotalCount(data.total);
      } else {
        const data = await userService.getRejectedUsers(page, 10, search);
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotalCount(data.total);
      }
    } catch {
      toast.error("Failed to load approval requests");
    } finally {
      setIsLoading(false);
    }
  }, [search, page, activeTab]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleApprove = async () => {
    if (!userToApprove) return;
    setIsApproving(true);
    try {
      await userService.approveUser(userToApprove._id);
      toast.success(`${userToApprove.name} has been approved successfully!`);
      setUserToApprove(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to approve user");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!userToReject) return;
    setIsRejecting(true);
    try {
      await userService.rejectUser(userToReject._id, rejectionReason.trim());
      toast.success(`${userToReject.name} has been rejected.`);
      setUserToReject(null);
      setRejectionReason("");
      fetchUsers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reject user");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <UserCheck className="text-violet-600 dark:text-violet-400" size={28} />
            User Registration Approvals
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review and manage user account registrations before granting access to TaskFlow
          </p>
        </div>

        {/* Tabs & Search Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
            <button
              onClick={() => {
                setActiveTab("pending");
                setPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "pending"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Clock size={16} className={activeTab === "pending" ? "text-amber-500" : ""} />
              Pending Requests
              {activeTab === "pending" && totalCount > 0 && (
                <span className="ml-1.5 px-2 py-0.5 text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 font-semibold rounded-full">
                  {totalCount}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("rejected");
                setPage(1);
              }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "rejected"
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <XCircle size={16} className={activeTab === "rejected" ? "text-red-500" : ""} />
              Rejected Users
              {activeTab === "rejected" && totalCount > 0 && (
                <span className="ml-1.5 px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 font-semibold rounded-full">
                  {totalCount}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Content Table / Empty State */}
        {isLoading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : users.length === 0 ? (
          <EmptyState
            title={activeTab === "pending" ? "No Pending Requests" : "No Rejected Users"}
            description={
              activeTab === "pending"
                ? "All user registration requests have been reviewed."
                : "There are currently no rejected users."
            }
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">
                      {activeTab === "pending" ? "Registered On" : "Rejected On"}
                    </th>
                    {activeTab === "rejected" && <th className="px-6 py-4">Rejection Reason</th>}
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60 font-medium">
                  {users.map((u) => {
                    const initials = u.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "U";

                    return (
                      <tr
                        key={u._id}
                        className="hover:bg-gray-50/80 dark:hover:bg-gray-750 transition-colors"
                      >
                        {/* User column */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {u.name}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {u.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {activeTab === "pending" ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Pending Approval
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              Rejected
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(activeTab === "pending" ? u.createdAt : u.rejectedAt || u.createdAt)}
                        </td>

                        {/* Rejection reason (rejected tab only) */}
                        {activeTab === "rejected" && (
                          <td className="px-6 py-4 max-w-xs truncate text-xs text-gray-600 dark:text-gray-300">
                            <span
                              className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-300"
                              title={u.rejectionReason}
                            >
                              <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                              {u.rejectionReason || "No reason provided"}
                            </span>
                          </td>
                        )}

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setUserToApprove(u)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 transition-all shadow-sm"
                            >
                              <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />
                              Approve
                            </button>

                            {activeTab === "pending" && (
                              <button
                                onClick={() => {
                                  setUserToReject(u);
                                  setRejectionReason("");
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800 transition-all shadow-sm"
                              >
                                <XCircle size={14} className="text-red-600 dark:text-red-400" />
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            )}
          </div>
        )}

        {/* Confirm Approve Modal */}
        <ConfirmModal
          isOpen={!!userToApprove}
          onClose={() => setUserToApprove(null)}
          onConfirm={handleApprove}
          title="Approve User Account"
          message={`Are you sure you want to approve "${userToApprove?.name}" (${userToApprove?.email})? They will immediately receive access to log in.`}
          confirmText="Yes, Approve User"
          variant="primary"
          isLoading={isApproving}
        />

        {/* Reject Modal with Reason */}
        <Modal
          isOpen={!!userToReject}
          onClose={() => setUserToReject(null)}
          title="Reject User Account"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300">
              <ShieldAlert size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="font-semibold">Rejection Notice</p>
                <p className="mt-0.5">
                  Are you sure you want to reject <strong>{userToReject?.name}</strong>? They will
                  not be able to sign in unless approved later.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="rejection-reason"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5"
              >
                Rejection Reason (Optional):
              </label>
              <textarea
                id="rejection-reason"
                rows={3}
                placeholder="e.g., Unrecognized organization email or unauthorized request"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 dark:text-white placeholder-gray-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUserToReject(null)}
                disabled={isRejecting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleReject}
                isLoading={isRejecting}
              >
                Reject User
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
