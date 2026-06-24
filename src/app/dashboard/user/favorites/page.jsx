"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiTrash2, FiArrowRight } from "react-icons/fi";
import { protectedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import RecipeCard from "@/components/RecipeCard";
import Loader from "@/components/Loader";
import { getRecipeId, getRecipeHref } from "@/lib/recipes";

export default function FavoritesPage() {
  const { data: session } = authClient.useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const fetchFavorites = () => {
    if (!session?.user?.email) return;
    protectedFetch("/favorites")
      .then((r) => r.json())
      .then((data) => setRecipes(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFavorites();
  }, [session]);

  const handleRemove = async (recipe) => {
    const recipeId = getRecipeId(recipe);
    setRemovingId(recipeId);
    try {
      await protectedFetch(`/favorites/${recipeId}`, { method: "DELETE" });
      setRecipes((prev) => prev.filter((r) => getRecipeId(r) !== recipeId));
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-primary mb-6">My Favorites</h1>
      {recipes.length === 0 ? (
        <p className="text-muted text-sm">No favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((recipe) => {
            const recipeId = getRecipeId(recipe);
            return (
              <div key={recipeId} className="flex flex-col">
                <RecipeCard recipe={recipe} linkable={false} />
                <div className="flex items-center justify-between mt-2 px-1">
                  <Link
                    href={getRecipeHref(recipe)}
                    className="text-brand text-xs font-medium inline-flex items-center gap-1 hover:opacity-80"
                  >
                    View Details
                    <FiArrowRight size={12} />
                  </Link>
                  <button
                    type="button"
                    disabled={removingId === recipeId}
                    onClick={() => handleRemove(recipe)}
                    className="text-xs text-[var(--danger)] inline-flex items-center gap-1 hover:opacity-80 disabled:opacity-50"
                  >
                    <FiTrash2 size={12} />
                    {removingId === recipeId ? "Removing..." : "Remove"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
