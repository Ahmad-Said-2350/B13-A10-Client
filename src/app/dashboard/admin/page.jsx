"use client";

import { useEffect, useState } from "react";
import { MdOutlinePeople, MdOutlineRestaurantMenu, MdOutlineReport } from "react-icons/md";
import { HiOutlineStar } from "react-icons/hi2";
import { protectedFetch } from "@/lib/api";
import Loader from "@/components/Loader";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    protectedFetch("/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const cards = [
    { label: "Total Users", value: stats?.totalUsers, icon: MdOutlinePeople },
    { label: "Total Recipes", value: stats?.totalRecipes, icon: MdOutlineRestaurantMenu },
    { label: "Premium Members", value: stats?.totalPremium, icon: HiOutlineStar },
    { label: "Pending Reports", value: stats?.totalReports, icon: MdOutlineReport },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-primary mb-6">Admin Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 badge-brand">
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-primary">{value ?? 0}</p>
            <p className="text-xs text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
