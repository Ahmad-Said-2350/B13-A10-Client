"use client";


import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { protectedFetch } from "@/lib/api";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiImage, FiCheck, FiCircle } from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", image: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Register — RecipeHub";
  }, []);

  const rules = {
    length: form.password.length >= 6,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!rules.length || !rules.upper || !rules.lower) {
      setError("Password does not meet requirements");
      return;
    }
    setLoading(true);
    const { error: authError } = await signUp.email({
      name: form.name,
      email: form.email,
      password: form.password,
      image: form.image || "",
    });
    if (authError) {
      setError(authError.message || "Registration failed");
      setLoading(false);
      return;
    }
    await protectedFetch("/auth/jwt", {
      method: "POST",
      body: JSON.stringify({ email: form.email }),
    });
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="w-full max-w-md card p-8">
        <h1 className="text-2xl font-display font-bold text-primary mb-1">Create account</h1>
        <p className="text-muted text-sm mb-8">Join the RecipeHub community</p>

        {error && <div className="mb-4 p-3 rounded-xl text-sm alert-error">{error}</div>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {[
            { name: "name", label: "Name", icon: FiUser, type: "text", placeholder: "John Doe" },
            { name: "email", label: "Email", icon: FiMail, type: "email", placeholder: "you@example.com" },
            { name: "image", label: "Image URL (optional)", icon: FiImage, type: "url", placeholder: "https://..." },
          ].map(({ name, label, icon: Icon, type, placeholder }) => (
            <div key={name}>
              <label className="text-xs text-muted mb-1.5 block font-medium">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  required={name !== "image"}
                  className="w-full pl-10 pr-4 py-3 input-field text-sm"
                  placeholder={placeholder}
                />
              </div>
            </div>
          ))}

          <div>
            <label className="text-xs text-muted mb-1.5 block font-medium">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                name="password"
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 input-field text-sm"
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            <div className="mt-2 space-y-1.5">
              {[
                { key: "length", label: "Minimum 6 characters" },
                { key: "upper", label: "One uppercase letter" },
                { key: "lower", label: "One lowercase letter" },
              ].map(({ key, label }) => (
                <p
                  key={key}
                  className={`text-xs flex items-center gap-1.5 ${
                    rules[key] ? "text-[var(--success)]" : "text-muted"
                  }`}
                >
                  {rules[key] ? <FiCheck size={12} /> : <FiCircle size={12} />}
                  {label}
                </p>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm mt-2">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand hover:opacity-80 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
