// components/Layout/Nav.jsx
import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { href: "/technology", label: "Technology" },
  { href: "/impact", label: "Impact" },
  { href: "/applications", label: "Applications" },
  { href: "/contact", label: "Contact" },
];

export default function Nav({ brand = "Phambili", className = "" }) {
  const { pathname } = useRouter();

  return (
    <header className={`w-full ${className}`} role="banner">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-3">
        <div className="flex items-center justify-between border-b border-emerald-200/50 pb-2 dark:border-emerald-900/40">
          {/* Brand */}
          <Link
            href="/"
            className="font-medium tracking-wide text-emerald-800 hover:text-emerald-900 transition-colors dark:text-emerald-100 dark:hover:text-white"
            aria-label={`${brand} home`}
          >
            {brand}
          </Link>

          {/* Right cluster: nav links */}
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-2 text-xs sm:text-sm text-emerald-700 dark:text-emerald-100">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "px-2 py-1 rounded-md transition-colors",
                      isActive
                        ? "text-emerald-950 bg-emerald-100/80 dark:text-emerald-950 dark:bg-emerald-200/90"
                        : "hover:text-emerald-900 hover:bg-emerald-100/40 dark:hover:text-white dark:hover:bg-emerald-900/30",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
