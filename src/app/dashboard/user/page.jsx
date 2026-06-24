"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { ensureJwt, apiFetch } from "@/lib/jwt";
import { MdOutlineRestaurantMenu, MdOutlineFavorite, MdOutlineThumbUp } from "react-icons/md";
import { HiOutlineStar } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";
import Loader from "@/components/Loader";

export default function UserOverviewPage() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState({ recipes: 0, favorites: 0, likes: 0 });
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    if (!session?.user?.email) return;
    const email = session.user.email;
    Promise.all([
      apiFetch("/recipes/my-recipes"),
      apiFetch("/favorites"),
    ])
      .then(([recipes, favorites]) => {
        const likes = recipes.reduce((sum, r) => sum + (r.likesCount || 0), 0);
        setStats({ recipes: recipes.length, favorites: favorites.length, likes });
      })
      .catch(() => setStats({ recipes: 0, favorites: 0, likes: 0 }))
      .finally(() => setLoading(false));
  }, [session]);

  const handleUpgrade = async () => {
    setUpgrading(true);
    setPayError("");
    try {
      const jwtOk = await ensureJwt(session);
      if (!jwtOk) throw new Error("Session expired. Please sign in again.");

      const data = await apiFetch("/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ email: session.user.email }),
      });

      if (data.url) window.location.href = data.url;
      else throw new Error("No checkout URL returned");
    } catch (err) {
      setPayError(err.message);
      setUpgrading(false);
    }
  };

  if (loading) return <Loader />;

  const statCards = [
    { label: "Total Recipes", value: stats.recipes, icon: MdOutlineRestaurantMenu },
    { label: "Total Favorites", value: stats.favorites, icon: MdOutlineFavorite },
    { label: "Likes Received", value: stats.likes, icon: MdOutlineThumbUp },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-primary mb-2">Dashboard Overview</h1>
      <p className="text-muted text-sm mb-8">
        Welcome back, {session?.user?.name}!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 badge-brand">
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-primary">{value}</p>
            <p className="text-xs text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {session?.user?.isPremium ? (
        <div className="card p-5 flex items-center gap-4 badge-premium">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center badge-premium">
            <HiOutlineStar size={24} />
          </div>
          <div>
            <p className="font-semibold text-primary">Premium Member</p>
            <p className="text-xs text-muted">Unlimited recipe creation unlocked</p>
          </div>
        </div>
      ) : (
        <div className="premium-banner rounded-2xl p-6">
          <h3 className="font-display font-semibold text-primary mb-1">Upgrade to Premium</h3>
          <p className="text-sm text-secondary mb-4">
            Unlock unlimited recipes and get a premium badge.
          </p>
          {payError && (
            <p className="text-sm alert-error p-3 rounded-xl mb-3">{payError}</p>
          )}
          <button
            type="button"
            disabled={upgrading}
            onClick={handleUpgrade}
            className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2"
          >
            {upgrading ? "Redirecting..." : "Upgrade Now"}
            {!upgrading && <FiArrowRight size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}

