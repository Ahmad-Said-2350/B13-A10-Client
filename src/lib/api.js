/**
 * All protected Express API calls MUST use these headers.
 * Server rejects requests without X-Requested-With (blocks direct browser URL access).
 */
export const PROTECTED_HEADERS = {
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest",
};

export function protectedFetch(path, options = {}) {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(isFormData
        ? { "X-Requested-With": "XMLHttpRequest" }
        : PROTECTED_HEADERS),
      ...options.headers,
    },
  });
}



export async function apiFetch(path, options = {}) {
  const res = await protectedFetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}
