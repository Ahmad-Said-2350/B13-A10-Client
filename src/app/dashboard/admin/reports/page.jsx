"use client";

import { useEffect, useState } from "react";
import { protectedFetch } from "@/lib/api";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Loader from "@/components/Loader";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = () => {
    protectedFetch("/admin/reports")
      .then((r) => r.json())
      .then(setReports)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, []);

  const handleConfirm = async () => {
    if (!modal) return;
    setActionLoading(true);
    try {
      const url =
        modal.action === "dismiss"
          ? `/admin/reports/${modal.report._id}`
          : `/admin/reports/${modal.report._id}/recipe`;

      await protectedFetch(url, { method: "DELETE" });
      setModal(null);
      fetchReports();
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-primary mb-2">Recipe Reports</h1>
      <p className="text-sm text-muted mb-6">Review user reports and dismiss or remove violating recipes.</p>

      {reports.length === 0 ? (
        <p className="text-muted text-sm">No pending reports.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-shell">
            <thead>
              <tr>
                <th>Recipe ID</th>
                <th className="hidden sm:table-cell">Reporter</th>
                <th>Reason</th>
                <th className="hidden md:table-cell">Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="text-secondary text-xs font-mono">{report.recipeId}</td>
                  <td className="text-secondary hidden sm:table-cell">{report.reporterEmail}</td>
                  <td className="text-primary">{report.reason}</td>
                  <td className="text-muted hidden md:table-cell text-xs">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setModal({ action: "dismiss", report })}
                        className="btn-table"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ action: "remove", report })}
                        className="btn-table btn-table-danger"
                      >
                        Remove Recipe
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!modal}
        onClose={() => setModal(null)}
        onConfirm={handleConfirm}
        loading={actionLoading}
        variant={modal?.action === "remove" ? "danger" : "warning"}
        title={modal?.action === "remove" ? "Remove Recipe?" : "Dismiss Report?"}
        message={
          modal?.action === "remove"
            ? "The reported recipe will be permanently deleted from the platform."
            : "This report will be marked as dismissed. The recipe will remain published."
        }
        confirmLabel={modal?.action === "remove" ? "Remove Recipe" : "Dismiss Report"}
      />
    </div>
  );
}
