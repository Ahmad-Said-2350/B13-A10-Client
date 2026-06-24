"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Loader from "@/components/Loader";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.user?.role !== "admin") {
      router.push("/dashboard/user");
    }
  }, [session, isPending, router]);

  if (isPending) return <Loader fullScreen />;
  if (session?.user?.role !== "admin") return <Loader fullScreen />;

  return children;
}
