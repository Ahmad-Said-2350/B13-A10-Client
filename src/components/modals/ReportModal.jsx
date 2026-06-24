"use client";

import { useState } from "react";
import { protectedFetch } from "@/lib/api";
import { FiX } from "react-icons/fi";

const reasons = ["Spam", "Offensive Content", "Copyright Issue"];

export default function ReportModal({ isOpen, onClose, recipeId, reporterEmail, onSuccess }) {
  const [reason, setReason] = useState(reasons[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await protectedFetch("/reports", {
        method: "POST",
        body: JSON.stringify({ recipeId, reporterEmail, reason }),
      });
      if (!res.ok) throw new Error("Failed to submit report");
      setSuccess(true);
      onSuccess?.();
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md card p-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-primary transition-colors"
        >
          <FiX size={18} />
        </button>

        <h2 className="text-lg font-display font-bold text-primary mb-4">Report Recipe</h2>

        {success ? (
          <p className="alert-success text-sm p-3 rounded-xl">Report submitted successfully.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-muted mb-2 block font-medium">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full input-field px-4 py-3 text-sm"
              >
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="alert-error text-xs p-3 rounded-xl">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
