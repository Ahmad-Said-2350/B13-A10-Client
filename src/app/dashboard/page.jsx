"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { protectedFetch } from "@/lib/api";
import Loader from "@/components/Loader";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/login");
      return;
    }

    protectedFetch("/auth/jwt", {
      method: "POST",
      body: JSON.stringify({ email: session.user.email }),
    });

    if (session.user.role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/dashboard/user");
    }
  }, [session, isPending, router]);

  return <Loader fullScreen />;
}



