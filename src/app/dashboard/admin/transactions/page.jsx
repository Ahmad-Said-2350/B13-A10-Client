"use client";

import { useEffect, useState } from "react";
import { protectedFetch } from "@/lib/api";
import Loader from "@/components/Loader";

export default function TransactionsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    protectedFetch("/admin/transactions")
      .then((r) => r.json())
      .then(setPayments)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-primary mb-6">Transactions</h1>
      {payments.length === 0 ? (
        <p className="text-muted text-sm">No transactions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-shell">
            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th className="hidden sm:table-cell">Date</th>
                <th>Status</th>
                <th className="hidden md:table-cell">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td className="text-secondary">{p.userEmail}</td>
                  <td className="text-primary font-medium">${p.amount}</td>
                  <td className="text-muted hidden sm:table-cell text-xs">
                    {new Date(p.paidAt).toLocaleDateString("en-US", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </td>
                  <td>
                    <span className="text-xs px-2 py-0.5 rounded-full alert-success font-medium">
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="text-muted hidden md:table-cell text-xs font-mono">
                    {p.transactionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
