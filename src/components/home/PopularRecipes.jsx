"use client";

import { useEffect, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import Loader from "@/components/Loader";

export default function PopularRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/popular`)
      .then((r) => r.json())
      .then(setRecipes)
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="px-4 py-16 max-w-6xl mx-auto">
      <p className="section-label text-center mb-2">Popular Recipes</p>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-primary text-center mb-10">
        Most Loved by Community
      </h2>

      {loading ? (
        <Loader />
      ) : recipes.length === 0 ? (
        <p className="text-center text-muted text-sm">No recipes available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} showLikes showAuthor />
          ))}
        </div>
      )}
    </section>
  );
}
