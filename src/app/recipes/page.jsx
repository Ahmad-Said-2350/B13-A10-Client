"use client";

import { useEffect, useState, useCallback } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import RecipeCard from "@/components/RecipeCard";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Dessert",
  "Snack",
  "Beverage",
  "Appetizer",
];

export default function BrowseRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchRecipes = useCallback(async (p, cats, q) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 9 });
      cats.forEach((c) => params.append("category", c));
      if (q) params.set("search", q);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes?${params}`
      );
      const data = await res.json();
      setRecipes(data.recipes || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch {
      setRecipes([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selected]);

  useEffect(() => {
    fetchRecipes(page, selected, debouncedSearch);
  }, [page, selected, debouncedSearch, fetchRecipes]);

  const toggleCategory = (cat) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearAll = () => {
    setSearch("");
    setSelected([]);
    setPage(1);
  };

  const hasFilters = selected.length > 0 || debouncedSearch;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <p className="section-label mb-2">Explore</p>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-primary">
          Browse Recipes
        </h1>
        <p className="text-sm text-muted mt-2">
          {total} recipe{total !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="mb-6 relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, cuisine, category, or author..."
          className="w-full pl-10 pr-10 py-3 input-field text-sm"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
            aria-label="Clear search"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted uppercase tracking-wide">Categories</p>
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-brand font-medium hover:opacity-80"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`chip ${selected.includes(cat) ? "chip-active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 card">
          <p className="text-secondary text-sm mb-1">No recipes found</p>
          <p className="text-muted text-xs">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
