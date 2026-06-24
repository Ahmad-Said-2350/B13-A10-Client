export function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return "";

  const trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed;
  }

  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }

  // Relative or broken paths should not be used as image URLs.
  if (trimmed.startsWith("/") || trimmed.startsWith(".")) {
    return "";
  }

  return `https://${trimmed}`;
}
