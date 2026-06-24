"use client";

import { useEffect, useState } from "react";
import { HiOutlineStar } from "react-icons/hi2";
import { FiMinus, FiEdit2 } from "react-icons/fi";
import { protectedFetch } from "@/lib/api";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Loader from "@/components/Loader";

export default function ManageRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [featureModal, setFeatureModal] = useState(null);
  const [editRecipe, setEditRecipe] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRecipes = (p = page) => {
    protectedFetch(`/admin/recipes?page=${p}&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        setRecipes(data.recipes || []);
        setTotalPages(data.totalPages || 1);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRecipes(page); }, [page]);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    await protectedFetch(`/admin/recipes/${deleteId}`, {
      method: "DELETE",
    });
    setDeleteId(null);
    setActionLoading(false);
    fetchRecipes(page);
  };

  const handleFeatureConfirm = async () => {
    if (!featureModal) return;
    setActionLoading(true);
    await protectedFetch(`/admin/recipes/${featureModal._id}/feature`, {
      method: "PATCH",
    });
    setFeatureModal(null);
    setActionLoading(false);
    fetchRecipes(page);
  };

  const openEdit = (recipe) => {
    setEditRecipe(recipe);
    setEditForm({
      recipeName: recipe.recipeName,
      category: recipe.category,
      cuisineType: recipe.cuisineType,
      difficultyLevel: recipe.difficultyLevel,
      preparationTime: recipe.preparationTime,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    });
  };

  const handleSaveEdit = async () => {
    if (!editRecipe) return;
    setActionLoading(true);
    try {
      await protectedFetch(`/admin/recipes/${editRecipe._id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      setEditRecipe(null);
      fetchRecipes(page);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;

  const deleteRecipe = recipes.find((r) => r._id === deleteId);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-primary mb-2">Manage Recipes</h1>
      <p className="text-sm text-muted mb-6">Edit, feature, or remove recipes from the platform.</p>

      <div className="overflow-x-auto">
        <table className="table-shell">
          <thead>
            <tr>
              <th>Name</th>
              <th className="hidden sm:table-cell">Author</th>
              <th>Category</th>
              <th>Featured</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr key={recipe._id}>
                <td className="text-primary">{recipe.recipeName}</td>
                <td className="text-secondary hidden sm:table-cell">{recipe.authorName}</td>
                <td className="text-secondary">{recipe.category}</td>
                <td>
                  {recipe.isFeatured ? (
                    <HiOutlineStar size={16} className="text-brand" />
                  ) : (
                    <FiMinus size={14} className="text-muted" />
                  )}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(recipe)}
                      className="btn-table"
                    >
                      <FiEdit2 size={13} className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeatureModal(recipe)}
                      className="btn-table btn-table-brand"
                    >
                      {recipe.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(recipe._id)}
                      className="btn-table btn-table-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary px-4 py-2 text-sm disabled:opacity-30">
            Previous
          </button>
          <span className="text-sm text-muted">Page {page} of {totalPages}</span>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary px-4 py-2 text-sm disabled:opacity-30">
            Next
          </button>
        </div>
      )}

      {editRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setEditRecipe(null)} />
          <div className="relative w-full max-w-lg card p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold text-primary mb-4">Edit Recipe</h2>
            {[
              { key: "recipeName", label: "Recipe Name", type: "input" },
              { key: "category", label: "Category", type: "input" },
              { key: "cuisineType", label: "Cuisine Type", type: "input" },
              { key: "difficultyLevel", label: "Difficulty", type: "input" },
              { key: "preparationTime", label: "Preparation Time", type: "input" },
              { key: "ingredients", label: "Ingredients", type: "textarea" },
              { key: "instructions", label: "Instructions", type: "textarea" },
            ].map(({ key, label, type }) => (
              <div key={key} className="mb-3">
                <label className="text-xs text-muted block mb-1 font-medium">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    value={editForm[key] || ""}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 input-field text-sm resize-none"
                  />
                ) : (
                  <input
                    value={editForm[key] || ""}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="w-full px-3 py-2 input-field text-sm"
                  />
                )}
              </div>
            ))}
            <button
              type="button"
              disabled={actionLoading}
              onClick={handleSaveEdit}
              className="btn-primary w-full py-2.5 text-sm mt-2"
            >
              {actionLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        loading={actionLoading}
        variant="danger"
        title="Delete Recipe?"
        message={`"${deleteRecipe?.recipeName}" will be permanently deleted from the platform.`}
        confirmLabel="Delete"
      />

      <ConfirmModal
        isOpen={!!featureModal}
        onClose={() => setFeatureModal(null)}
        onConfirm={handleFeatureConfirm}
        loading={actionLoading}
        variant="warning"
        title={featureModal?.isFeatured ? "Remove from Featured?" : "Feature Recipe?"}
        message={
          featureModal?.isFeatured
            ? `"${featureModal?.recipeName}" will be removed from the homepage featured section.`
            : `"${featureModal?.recipeName}" will appear on the homepage featured section.`
        }
        confirmLabel={featureModal?.isFeatured ? "Unfeature" : "Feature"}
      />
    </div>
  );
}
