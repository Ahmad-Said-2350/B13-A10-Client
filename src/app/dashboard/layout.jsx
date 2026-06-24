"use client";

import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ensureJwt } from "@/lib/jwt";
import Sidebar from "@/components/dashboard/Sidebar";
import Logo from "@/components/Logo";
import Loader from "@/components/Loader";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jwtReady, setJwtReady] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }

    if (session?.user?.isBlocked) {
      authClient.signOut({
        fetchOptions: {
          onSuccess: () => router.push("/login?blocked=1"),
        },
      });
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: "DELETE",
        credentials: "include",
      });
      return;
    }

    if (session) {
      ensureJwt(session).then((ok) => {
        if (!ok) {
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => router.push("/login?blocked=1"),
            },
          });
          return;
        }
        setJwtReady(true);
      });
    }
  }, [isPending, session, router]);

  if (isPending || !jwtReady) return <Loader fullScreen />;
  if (!session || session.user?.isBlocked) return <Loader fullScreen />;

  return (
    <div className="flex min-h-screen bg-page">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 md:relative md:translate-x-0 md:flex md:flex-shrink-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-default bg-surface">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-secondary hover:text-primary p-1 transition-colors"
            aria-label="Open menu"
          >
            <FiMenu size={22} />
          </button>
          <Logo href="/" showIcon={false} className="text-base" />
          <div className="w-7" />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
