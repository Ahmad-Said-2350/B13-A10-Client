"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FiCheckCircle, FiCheck, FiAlertCircle } from "react-icons/fi";
import { protectedFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import Loader from "@/components/Loader";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const type = searchParams.get("type");
  const recipeId = searchParams.get("recipeId");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!session?.user?.email || calledRef.current) return;
    calledRef.current = true;

    const activate = async () => {
      try {
        const email = session.user.email;

        if (type === "premium") {
          const res = await protectedFetch("/user/premium", {
            method: "PATCH",
            body: JSON.stringify({
              email,
              transactionId: `TXN_${Date.now()}`,
              amount: 19.99,
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data.message || "Failed to activate premium");
          }
          await authClient.getSession();
        } else if (type === "recipe") {
          if (!recipeId) {
            throw new Error("Recipe ID missing from payment return URL");
          }

          const res = await protectedFetch("/user/purchase-recipe", {
            method: "PATCH",
            body: JSON.stringify({
              email,
              recipeId,
              transactionId: `TXN_${Date.now()}`,
              amount: 4.99,
            }),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(data.message || "Failed to save recipe purchase");
          }
        }
      } catch (err) {
        setError(err.message || "Payment activation failed");
      } finally {
        setDone(true);
      }
    };

    activate();
  }, [session, type, recipeId]);

  useEffect(() => {
    if (!done || error) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [done, error]);

  useEffect(() => {
    if (!done || error || countdown > 0) return;

    const destination =
      type === "recipe" ? "/dashboard/user/purchased" : "/dashboard/user";
    router.push(destination);
  }, [done, error, countdown, type, router]);

  if (!session?.user?.email || !done) {
    return <Loader fullScreen />;
  }

  const benefits = [
    "Unlimited recipe creation",
    "Premium member badge",
    "Priority support",
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 alert-error">
          <FiAlertCircle size={40} />
        </div>
        <h1 className="text-2xl font-display font-bold text-primary mb-3">
          Payment Record Failed
        </h1>
        <p className="text-secondary text-sm mb-6 max-w-sm leading-relaxed">{error}</p>
        <Link href="/dashboard/user" className="btn-primary px-6 py-3 text-sm">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 alert-success">
        <FiCheckCircle size={40} />
      </div>
      <h1 className="text-3xl font-display font-bold text-primary mb-3">Payment Successful</h1>
      <p className="text-secondary text-sm mb-6 max-w-sm leading-relaxed">
        {type === "premium"
          ? "You are now a Premium Member. Unlimited recipes unlocked!"
          : "Recipe purchased successfully!"}
      </p>
      {type === "premium" && (
        <ul className="text-sm text-secondary space-y-2.5 mb-8 text-left">
          {benefits.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <FiCheck size={14} className="text-[var(--success)] shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
      <p className="text-muted text-xs mb-6">
        Redirecting in {countdown} seconds...
      </p>
      <Link
        href={type === "recipe" ? "/dashboard/user/purchased" : "/dashboard/user"}
        className="btn-primary px-6 py-3 text-sm"
      >
        {type === "recipe" ? "View Purchased Recipes" : "Go to Dashboard"}
      </Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}


