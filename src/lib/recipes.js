export function getDocumentId(value) {
  if (value == null) return "";

  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "object") {
    if (value.$oid) return String(value.$oid).trim();
    if (value._id) return getDocumentId(value._id);
    if (typeof value.toHexString === "function") {
      return value.toHexString();
    }
  }

  const asString = String(value).trim();
  return asString === "[object Object]" ? "" : asString;
}

export function getRecipeId(recipe) {
  if (!recipe) return "";

  // Server always sends recipeId on recipe objects. Prefer it over _id
  // so favorite/payment wrappers cannot break links.
  if (recipe.recipeName) {
    return getDocumentId(recipe.recipeId || recipe._id);
  }

  return getDocumentId(recipe.recipeId || recipe._id);
}

export function getRecipeHref(recipe) {
  const id = getRecipeId(recipe);
  return id ? `/recipes/${id}` : "/recipes";
}
