"use client";

import { FiAlertTriangle, FiX } from "react-icons/fi";

const variants = {
  danger: {
    icon: "text-[var(--danger)]",
    iconBg: "bg-[var(--danger-muted)]",
    button: "bg-[var(--danger)] hover:opacity-90 text-white",
  },
  warning: {
    icon: "text-brand",
    iconBg: "badge-brand",
    button: "btn-primary",
  },
  primary: {
    icon: "text-brand",
    iconBg: "badge-brand",
    button: "btn-primary",
  },
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  loading = false,
}) {
  if (!isOpen) return null;

  const styles = variants[variant] || variants.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />
      <div className="relative w-full max-w-md card p-6">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-muted hover:text-primary transition-colors disabled:opacity-50"
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${styles.iconBg}`}>
            <FiAlertTriangle size={20} className={styles.icon} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary mb-1">{title}</h2>
            <p className="text-sm text-secondary leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm rounded-md font-medium disabled:opacity-50 ${styles.button}`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
