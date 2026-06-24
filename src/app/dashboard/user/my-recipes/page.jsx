"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { protectedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import SafeImage from "@/components/SafeImage";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Loader from "@/components/Loader";

export default function MyRecipesPage() {
  const { data: session } = authClient.useSession();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRecipes = () => {
    if (!session?.user?.email) return;
    protectedFetch("/recipes/my-recipes")
      .then((r) => r.json())
      .then(setRecipes)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRecipes(); }, [session]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    await protectedFetch(`/recipes/${deleteId}`, {
      method: "DELETE",
    });
    setDeleteId(null);
    setDeleteLoading(false);
    fetchRecipes();
  };

  const handleEdit = (recipe) => {
    setEditId(recipe._id);
    setEditForm({
      recipeName: recipe.recipeName,
      preparationTime: recipe.preparationTime,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    });
  };

  const handleSaveEdit = async () => {
    await protectedFetch(`/recipes/${editId}`, {
      method: "PUT",
      body: JSON.stringify(editForm),
    });
    setEditId(null);
    fetchRecipes();
  };

  if (loading) return <Loader />;

  const deleteRecipe = recipes.find((r) => r._id === deleteId);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-primary mb-6">My Recipes</h1>

      {recipes.length === 0 ? (
        <p className="text-muted text-sm">No recipes yet. Add your first recipe!</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-shell">
            <thead>
              <tr>
                <th className="pr-4">Recipe</th>
                <th className="pr-4 hidden sm:table-cell">Category</th>
                <th className="pr-4 hidden md:table-cell">Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe._id}>
                  <td className="pr-4">
                    <div className="flex items-center gap-3">
                      {recipe.recipeImage && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-default">
                          <SafeImage src={recipe.recipeImage} alt="" fill className="object-cover" />
                        </div>
                      )}
                      <span className="text-primary font-medium">{recipe.recipeName}</span>
                    </div>
                  </td>
                  <td className="pr-4 text-secondary hidden sm:table-cell">{recipe.category}</td>
                  <td className="pr-4 text-muted hidden md:table-cell text-xs">
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button type="button" onClick={() => handleEdit(recipe)} className="text-brand p-1 hover:opacity-80">
                        <FiEdit2 size={15} />
                      </button>
                      <button type="button" onClick={() => setDeleteId(recipe._id)} className="text-[var(--danger)] p-1 hover:opacity-80">
                        <FiTrash2 size={15} />
                      </button>
                      <Link href={`/recipes/${recipe._id}`} className="text-muted text-xs hover:text-primary transition-colors">
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditId(null)} />
          <div className="relative w-full max-w-md card p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Edit Recipe</h2>
            {["recipeName", "preparationTime", "ingredients", "instructions"].map((field) => (
              <div key={field} className="mb-3">
                <label className="text-xs text-muted capitalize block mb-1 font-medium">{field}</label>
                {field === "ingredients" || field === "instructions" ? (
                  <textarea
                    value={editForm[field]}
                    onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 input-field text-sm resize-none"
                  />
                ) : (
                  <input
                    value={editForm[field]}
                    onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                    className="w-full px-3 py-2 input-field text-sm"
                  />
                )}
              </div>
            ))}
            <button type="button" onClick={handleSaveEdit} className="btn-primary w-full py-2.5 text-sm mt-2">
              Save Changes
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        variant="danger"
        title="Delete Recipe?"
        message={`"${deleteRecipe?.recipeName || "This recipe"}" will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete Recipe"
      />
    </div>
  );
}
