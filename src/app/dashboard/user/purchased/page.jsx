"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { protectedFetch } from "@/lib/api";
import RecipeCard from "@/components/RecipeCard";
import Loader from "@/components/Loader";
import { getRecipeHref, getRecipeId, getDocumentId } from "@/lib/recipes";

async function fetchRecipesByIds(ids) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const uniqueIds = [...new Set(ids.filter(Boolean))];

  const recipes = await Promise.all(
    uniqueIds.map(async (id) => {
      const res = await fetch(`${apiUrl}/recipes/${id}`);
      if (!res.ok) return null;
      const recipe = await res.json();
      return { ...recipe, recipeId: getRecipeId(recipe) };
    })
  );

  return recipes.filter(Boolean);
}

async function loadPurchasedRecipes() {
  const purchasedRes = await protectedFetch("/payments/purchased-recipes");

  if (purchasedRes.ok) {
    const data = await purchasedRes.json().catch(() => []);
    return Array.isArray(data) ? data : [];
  }

  if (purchasedRes.status !== 404) {
    const data = await purchasedRes.json().catch(() => ({}));
    throw new Error(data.message || "Failed to load purchased recipes");
  }

  const paymentsRes = await protectedFetch("/payments");
  const payments = await paymentsRes.json().catch(() => []);

  if (!paymentsRes.ok) {
    const data = payments;
    throw new Error(data.message || "Failed to load purchased recipes");
  }

  const recipeIds = (Array.isArray(payments) ? payments : [])
    .filter((payment) => payment.recipeId)
    .map((payment) => getDocumentId(payment.recipeId));

  if (recipeIds.length === 0) {
    return [];
  }

  return fetchRecipesByIds(recipeIds);
}

export default function PurchasedPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPurchasedRecipes()
      .then(setRecipes)
      .catch((err) => {
        setRecipes([]);
        setError(err.message || "Failed to load purchased recipes");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-primary mb-6">My Purchased Recipes</h1>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-sm alert-error">{error}</div>
      )}

      {recipes.length === 0 ? (
        <p className="text-muted text-sm">No purchased recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((recipe) => {
            const recipeId = getRecipeId(recipe);
            return (
              <div key={recipeId} className="flex flex-col">
                <RecipeCard recipe={recipe} linkable={false} />
                <Link
                  href={getRecipeHref(recipe)}
                  className="text-brand text-xs mt-2 inline-flex items-center gap-1 font-medium hover:opacity-80 px-1"
                >
                  View Details
                  <FiArrowRight size={12} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
