function validateImageFile(file) {
  if (!file) throw new Error("Please select an image");

  const isImage =
    file.type?.startsWith("image/") ||
    /\.(jpe?g|png|gif|webp|bmp)$/i.test(file.name || "");

  if (!isImage) throw new Error("Please select JPG, PNG, GIF, or WEBP");
  if (file.size > 10 * 1024 * 1024) throw new Error("Image must be under 10 MB");
}

export async function uploadImage(file, folder) {
  validateImageFile(file);

  const formData = new FormData();
  formData.append("image", file);
  formData.append("folder", folder);

  const res = await fetch("/api/cloudinary/upload", {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Upload failed (${res.status})`);
  }

  if (!data.url) {
    throw new Error("Cloudinary did not return an image URL");
  }

  return data.url;
}

export function uploadProfileImage(file) {
  return uploadImage(file, "profiles");
}

export function uploadRecipeImage(file) {
  return uploadImage(file, "recipes");
}
