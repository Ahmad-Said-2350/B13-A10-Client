"use client";

import { useEffect, useState } from "react";
import { protectedFetch } from "@/lib/api";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Loader from "@/components/Loader";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = () => {
    protectedFetch("/admin/users")
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBlockConfirm = async () => {
    if (!modal) return;
    setActionLoading(true);
    try {
      const res = await protectedFetch(`/admin/users/${modal.user._id}/block`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Action failed");
      setModal(null);
      fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-primary mb-2">Manage Users</h1>
      <p className="text-sm text-muted mb-6">Block users to prevent login and API access.</p>

      <div className="overflow-x-auto">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Name</th>
              <th className="hidden sm:table-cell">Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="text-primary">{user.name}</td>
                <td className="text-secondary hidden sm:table-cell">{user.email}</td>
                <td className="text-secondary capitalize">{user.role}</td>
                <td>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    user.isBlocked ? "alert-error" : "alert-success"
                  }`}>
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="text-right">
                  {user.role !== "admin" && (
                    <button
                      type="button"
                      onClick={() =>
                        setModal({
                          user,
                          action: user.isBlocked ? "unblock" : "block",
                        })
                      }
                      className={`btn-table ${user.isBlocked ? "btn-table-brand" : "btn-table-danger"}`}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        onConfirm={handleBlockConfirm}
        loading={actionLoading}
        variant={modal?.action === "block" ? "danger" : "warning"}
        title={modal?.action === "block" ? "Block User?" : "Unblock User?"}
        message={
          modal?.action === "block"
            ? `${modal?.user?.name} will not be able to log in or use protected features.`
            : `${modal?.user?.name} will regain full access to their account.`
        }
        confirmLabel={modal?.action === "block" ? "Block User" : "Unblock User"}
      />
    </div>
  );
}
