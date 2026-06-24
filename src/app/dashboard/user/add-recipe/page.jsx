"use client";

import { useEffect, useState } from "react";
import { protectedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { uploadRecipeImage } from "@/lib/cloudinary";
import SafeImage from "@/components/SafeImage";
import Loader from "@/components/Loader";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiUpload,
  FiImage,
} from "react-icons/fi";

const categories = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Beverage", "Appetizer"];
const difficulties = ["Easy", "Medium", "Hard"];

export default function AddRecipePage() {
  const { data: session } = authClient.useSession();
  const [recipeCount, setRecipeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    recipeName: "",
    recipeImage: "",
    category: "Breakfast",
    cuisineType: "",
    difficultyLevel: "Easy",
    preparationTime: "",
    ingredients: "",
    instructions: "",
  });

  useEffect(() => {
    document.title = "Add Recipe — RecipeHub";
  }, []);

  useEffect(() => {
    if (!session?.user?.email) return;
    protectedFetch("/recipes/my-recipes")
      .then((r) => r.json())
      .then((data) => setRecipeCount(data.length))
      .finally(() => setLoading(false));
  }, [session]);

  const limitReached = !session?.user?.isPremium && recipeCount >= 2;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || limitReached) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const url = await uploadRecipeImage(file);
      setForm((prev) => ({ ...prev, recipeImage: url }));
      setSuccess("Recipe image uploaded to Cloudinary.");
    } catch (err) {
      setError(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (limitReached) return;

    if (!form.recipeImage) {
      setError("Please upload a recipe image first");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await protectedFetch("/recipes", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          authorId: session.user.id,
          authorName: session.user.name,
          authorEmail: session.user.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add recipe");

      setSuccess("Recipe added successfully!");
      setForm({
        recipeName: "",
        recipeImage: "",
        category: "Breakfast",
        cuisineType: "",
        difficultyLevel: "Easy",
        preparationTime: "",
        ingredients: "",
        instructions: "",
      });
      setRecipeCount((c) => c + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">Add Recipe</h1>
        <p className="text-sm text-muted mt-1">Share a new recipe with the community</p>
      </div>

      {limitReached && (
        <div className="mb-6 p-4 rounded-xl badge-premium text-sm">
          You&apos;ve used your 2 free recipe slots. Upgrade to Premium for unlimited recipes.
        </div>
      )}

      <div className="card p-6 md:p-8">
        {success && (
          <div className="mb-4 p-3 rounded-xl text-sm alert-success flex items-center gap-2">
            <FiCheckCircle size={16} />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm alert-error flex items-center gap-2">
            <FiAlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { name: "recipeName", label: "Recipe Name", type: "text", required: true },
            { name: "cuisineType", label: "Cuisine Type", type: "text", placeholder: "Italian, Indian..." },
            { name: "preparationTime", label: "Preparation Time", type: "text", placeholder: "30 minutes" },
          ].map(({ name, label, type, placeholder, required }) => (
            <div key={name}>
              <label className="text-xs text-muted mb-1.5 block font-medium">{label}</label>
              <input
                name={name}
                type={type}
                value={form[name]}
                onChange={handleChange}
                required={required}
                disabled={limitReached}
                placeholder={placeholder}
                className="w-full px-4 py-3 input-field text-sm disabled:opacity-50"
              />
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted mb-1.5 block font-medium">Category</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={limitReached}
                className="w-full px-4 py-3 input-field text-sm disabled:opacity-50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted mb-1.5 block font-medium">Difficulty Level</label>
              <select
                name="difficultyLevel"
                value={form.difficultyLevel}
                onChange={handleChange}
                disabled={limitReached}
                className="w-full px-4 py-3 input-field text-sm disabled:opacity-50"
              >
                {difficulties.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-muted mb-1.5 block font-medium">
              Recipe Image Upload
            </label>
            <label
              className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl text-sm border border-dashed border-default bg-card transition-colors ${
                limitReached
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer text-secondary hover:text-primary hover:border-brand"
              }`}
            >
              {uploading ? (
                <span>Uploading to Cloudinary...</span>
              ) : (
                <>
                  <FiUpload size={16} />
                  <span>Choose image from PC or phone</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageUpload}
                disabled={limitReached || uploading}
              />
            </label>

            {form.recipeImage ? (
              <div className="mt-4">
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-default bg-elevated">
                  <SafeImage
                    src={form.recipeImage}
                    alt="Recipe preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-xs text-muted mt-2 flex items-center gap-1 break-all">
                  <FiImage size={12} className="shrink-0" />
                  {form.recipeImage}
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted mt-2">
                Image uploads to Cloudinary. The returned link is saved in the recipes collection.
              </p>
            )}
          </div>

          {[
            { name: "ingredients", label: "Ingredients (one per line)" },
            { name: "instructions", label: "Instructions (one step per line)" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="text-xs text-muted mb-1.5 block font-medium">{label}</label>
              <textarea
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
                rows={4}
                disabled={limitReached}
                className="w-full px-4 py-3 input-field text-sm resize-none disabled:opacity-50"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting || uploading || limitReached}
            className="btn-primary w-full py-3 text-sm mt-2 disabled:opacity-60"
          >
            {submitting ? "Adding Recipe..." : "Add Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
}

