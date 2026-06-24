"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { protectedFetch } from "@/lib/api";
import { signIn, authClient } from "@/lib/auth-client";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login — RecipeHub";
    if (searchParams.get("blocked") === "1") {
      setError("Your account has been blocked. Contact the administrator.");
    }
  }, [searchParams]);

  const issueJwt = async (userEmail) => {
    const res = await protectedFetch("/auth/jwt", {
      method: "POST",
      body: JSON.stringify({ email: userEmail }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    });

    if (authError) {
      setError(authError.message || "Invalid credentials");
      setLoading(false);
      return;
    }

    const { data: sessionData } = await authClient.getSession();

    if (sessionData?.user?.isBlocked) {
      await authClient.signOut();
      setError("Your account has been blocked. Contact the administrator.");
      setLoading(false);
      return;
    }

    try {
      await issueJwt(email);
      router.push(searchParams.get("callbackUrl") || "/dashboard");
    } catch (err) {
      await authClient.signOut();
      setError(err.message);
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    signIn.social({ provider: "google", callbackURL: "/dashboard" });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md card p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-primary mb-1">Welcome back</h1>
        <p className="text-muted text-sm mb-8">Sign in to your RecipeHub account</p>

        {error && <div className="mb-4 p-3 rounded-lg text-sm alert-error">{error}</div>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-muted mb-1.5 block font-medium">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 input-field text-sm"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted mb-1.5 block font-medium">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-10 py-3 input-field text-sm"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm mt-2">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[var(--border)]" />
          <span className="text-xs text-muted">or</span>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="btn-secondary w-full py-3 text-sm inline-flex items-center justify-center gap-2"
        >
          <FcGoogle size={18} />
          Continue with Google
        </button>

        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand hover:opacity-80 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
