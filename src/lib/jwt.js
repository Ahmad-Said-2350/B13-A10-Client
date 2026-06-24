import { protectedFetch } from "./api";

/**
 * Issue Express JWT (HTTPOnly cookie on port 5000) after BetterAuth login.
 */
export async function ensureJwt(session) {
  if (!session?.user?.email) return false;

  try {
    const res = await protectedFetch("/auth/jwt", {
      method: "POST",
      body: JSON.stringify({ email: session.user.email }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export { apiFetch, protectedFetch, PROTECTED_HEADERS } from "./api";
