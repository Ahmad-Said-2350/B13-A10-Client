"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import UserAvatar from "./UserAvatar";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Recipes", href: "/recipes" },
];



const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


const pathname = usePathname();
if(pathname.includes("/dashboard")) {
  return null; // Don't render the navbar on dashboard pages
}




  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "DELETE",
      credentials: "include",
    });
    setIsMenuOpen(false);
  };

  const userName = session?.user?.name || "User";

  return (
    <div className="w-full sticky top-0 z-50 px-3 pt-3 bg-transparent">
      <nav className="w-full nav-glass rounded-lg px-4 md:px-6 h-14 flex items-center justify-between">
        <Logo href="/" className="text-lg md:text-xl" />

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-secondary hover:text-primary text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="w-px h-4 bg-[var(--border)]" />
          <ThemeToggle />

          {isPending ? (
            <div className="w-16 h-4 bg-elevated rounded animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-secondary hover:text-primary text-sm font-medium transition-colors"
              >
                <UserAvatar user={session.user} size="sm" />
                {userName.split(" ")[0]}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-brand hover:opacity-80 text-sm font-medium transition-opacity"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-brand hover:opacity-80 text-sm font-medium transition-opacity"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm px-5 py-2.5"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="text-secondary hover:text-primary p-2 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden mt-2 nav-glass rounded-lg px-6 py-5 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-secondary hover:text-primary text-sm font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-secondary hover:text-primary text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-left text-brand text-sm font-medium"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-brand text-sm">
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="btn-primary text-sm text-center py-2.5"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
