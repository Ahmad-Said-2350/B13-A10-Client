"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiHeart,
  FiBookmark,
  FiFlag,
  FiShoppingCart,
  FiArrowLeft,
  FiGlobe,
  FiBarChart2,
  FiClock,
} from "react-icons/fi";
import { GiCookingPot } from "react-icons/gi";
import { protectedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { getDocumentId, getRecipeId } from "@/lib/recipes";
import Loader from "@/components/Loader";
import SafeImage from "@/components/SafeImage";
import ReportModal from "@/components/modals/ReportModal";

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const recipeId = getDocumentId(id);

  const fetchRecipe = async () => {
    if (!recipeId) {
      setRecipe(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeId}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setRecipe(data);
      if (session?.user?.email) {
        setLiked(data.likedBy?.includes(session.user.email));
        protectedFetch("/favorites")
          .then((r) => r.json())
          .then((favorites) => {
            setSaved(
              favorites.some((item) => getRecipeId(item) === recipeId)
            );
          })
          .catch(() => {});
      }
    } catch {
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchRecipe();
  }, [recipeId, session]);

  const requireAuth = () => {
    if (!session) {
      router.push("/login");
      return false;
    }
    return true;
  };

  const handleLike = async () => {
    if (!requireAuth()) return;
    setActionLoading(true);
    try {
      const res = await protectedFetch(`/recipes/${recipeId}/like`, { method: "POST" });
      const data = await res.json();
      setLiked(data.liked);
      setRecipe((r) => ({
        ...r,
        likesCount: data.liked ? (r.likesCount || 0) + 1 : Math.max(0, (r.likesCount || 0) - 1),
      }));
    } finally {
      setActionLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!requireAuth()) return;
    setActionLoading(true);
    try {
      const res = await protectedFetch("/favorites", {
        method: "POST",
        body: JSON.stringify({
          userEmail: session.user.email,
          userId: session.user.id,
          recipeId,
        }),
      });
      const data = await res.json();
      setSaved(data.saved);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!requireAuth()) return;
    setActionLoading(true);
    try {
      const res = await protectedFetch("/create-recipe-checkout-session", {
        method: "POST",
        body: JSON.stringify({ email: session.user.email, recipeId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-secondary">Recipe not found.</p>
        <Link href="/recipes" className="text-brand text-sm font-medium inline-flex items-center gap-1">
          <FiArrowLeft size={14} />
          Back to recipes
        </Link>
      </div>
    );
  }

  const ingredients = recipe.ingredients?.split("\n").filter(Boolean) || [];
  const instructions = recipe.instructions?.split("\n").filter(Boolean) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/recipes"
        className="flex items-center gap-2 text-muted text-sm mb-6 hover:text-primary transition-colors"
      >
        <FiArrowLeft size={14} />
        Back to recipes
      </Link>

      <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 bg-elevated border border-default">
        {recipe.recipeImage ? (
          <SafeImage src={recipe.recipeImage} alt={recipe.recipeName} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand">
            <GiCookingPot size={64} />
          </div>
        )}
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-primary mb-3">{recipe.recipeName}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-secondary">
          <span className="px-2.5 py-0.5 rounded-full badge-brand font-medium">
            {recipe.category}
          </span>
          <span className="inline-flex items-center gap-1">
            <FiGlobe size={13} />
            {recipe.cuisineType}
          </span>
          <span className="inline-flex items-center gap-1">
            <FiBarChart2 size={13} />
            {recipe.difficultyLevel}
          </span>
          <span className="inline-flex items-center gap-1">
            <FiClock size={13} />
            {recipe.preparationTime}
          </span>
          <span className="inline-flex items-center gap-1">
            <FiHeart size={13} />
            {recipe.likesCount || 0} likes
          </span>
        </div>
        <p className="text-muted text-sm mt-2">by {recipe.authorName}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-10">
        {[
          { icon: FiHeart, label: liked ? "Liked" : "Like", action: handleLike, active: liked },
          { icon: FiBookmark, label: saved ? "Saved" : "Favorite", action: handleFavorite, active: saved },
          { icon: FiFlag, label: "Report", action: () => requireAuth() && setReportOpen(true) },
          { icon: FiShoppingCart, label: "Purchase", action: handlePurchase },
        ].map(({ icon: Icon, label, action, active }) => (
          <button
            key={label}
            type="button"
            disabled={actionLoading}
            onClick={action}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-50 ${
              active
                ? "badge-brand"
                : "border-default bg-card text-secondary hover:text-primary hover:border-[var(--border-strong)]"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display font-semibold text-primary mb-4">Ingredients</h2>
          <ul className="space-y-2">
            {ingredients.map((item, i) => (
              <li key={i} className="text-sm text-secondary flex gap-2">
                <span className="text-brand font-bold">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display font-semibold text-primary mb-4">Instructions</h2>
          <ol className="space-y-3">
            {instructions.map((step, i) => (
              <li key={i} className="text-sm text-secondary flex gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold badge-brand">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        recipeId={recipeId}
        reporterEmail={session?.user?.email}
      />
    </div>
  );
}
