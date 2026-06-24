"use client";


import Link from "next/link";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { SiPinterest } from "react-icons/si";
import Logo from "./Logo";
import { usePathname } from "next/navigation";

const footerLinks = {
  "Quick Links": [
    { label: "Home", href: "/" },
    { label: "Browse Recipes", href: "/recipes" },
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
  ],
  Contact: [
    { label: "hello@recipehub.com", href: "mailto:hello@recipehub.com" },
    { label: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { label: "Dhaka, Bangladesh", href: "#" },
  ],
};

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: SiPinterest, href: "#", label: "Pinterest" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

const Footer = () => {

const pathname = usePathname();
if(pathname.includes("/dashboard")) {
  return null; // Don't render the navbar on dashboard pages
}

  return (
    <footer className="w-full mt-auto px-4 py-14 border-t border-default bg-page">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <Logo href="/" className="text-xl mb-4" />
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Discover, share, and save exceptional recipes from culinary creators
              around the world.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="section-label mb-4">{title}</p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-secondary hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-default flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-lg flex items-center justify-center border border-default bg-card text-muted hover:text-brand hover:border-[var(--brand-border)] transition-colors"
              >
                <Icon size={13} />
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted whitespace-nowrap">
            Copyright 2026 — RecipeHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



