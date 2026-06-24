"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdOutlineSpaceDashboard,
  MdOutlineRestaurantMenu,
  MdOutlineBookmark,
  MdOutlineShoppingBag,
  MdOutlinePerson,
  MdOutlinePeople,
  MdOutlineReport,
  MdOutlinePayment,
  MdOutlineAdd,
} from "react-icons/md";
import { HiOutlineStar } from "react-icons/hi2";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import UserAvatar from "@/components/UserAvatar";

const userLinks = [
  { label: "Overview", href: "/dashboard/user", icon: MdOutlineSpaceDashboard },
  { label: "Add Recipe", href: "/dashboard/user/add-recipe", icon: MdOutlineAdd },
  { label: "My Recipes", href: "/dashboard/user/my-recipes", icon: MdOutlineRestaurantMenu },
  { label: "Favorites", href: "/dashboard/user/favorites", icon: MdOutlineBookmark },
  { label: "Purchased", href: "/dashboard/user/purchased", icon: MdOutlineShoppingBag },
  { label: "Profile", href: "/dashboard/user/profile", icon: MdOutlinePerson },
];

const adminLinks = [
  { label: "Overview", href: "/dashboard/admin", icon: MdOutlineSpaceDashboard },
  { label: "Manage Users", href: "/dashboard/admin/users", icon: MdOutlinePeople },
  { label: "Manage Recipes", href: "/dashboard/admin/recipes", icon: MdOutlineRestaurantMenu },
  { label: "Reports", href: "/dashboard/admin/reports", icon: MdOutlineReport },
  { label: "Transactions", href: "/dashboard/admin/transactions", icon: MdOutlinePayment },
];

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const role = session?.user?.role || "user";
  const links = role === "admin" ? adminLinks : userLinks;
  const name = session?.user?.name || "User";

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/") },
    });
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "DELETE",
      credentials: "include",
    });
  };

  return (
    <aside className="w-64 h-full flex flex-col border-r border-default bg-surface shrink-0">
      <div className="p-5 border-b border-default">
        <Logo href="/" onClick={() => onClose?.()} className="text-lg" />
      </div>

      <div className="p-5 border-b border-default">
        <div className="flex items-center gap-3">
          <UserAvatar user={session?.user} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary truncate">{name}</p>
            <p className="text-xs text-muted truncate">{session?.user?.email}</p>
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-elevated text-muted uppercase tracking-wide font-medium">
                {role}
              </span>
              {session?.user?.isPremium && (
                <span className="text-[10px] px-2 py-0.5 rounded-md badge-premium inline-flex items-center gap-1 font-medium">
                  <HiOutlineStar size={10} />
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => onClose?.()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "badge-brand border-l-2 border-[var(--brand)]"
                  : "text-secondary hover:text-primary hover:bg-elevated"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-default space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted">Theme</span>
          <ThemeToggle />
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full text-sm text-[var(--danger)] hover:opacity-80 text-left px-3 py-2 font-medium transition-opacity"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
