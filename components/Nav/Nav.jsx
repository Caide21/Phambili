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
    <header className={`w-full ${className}`}>
      <div className="mx-auto w-full max-w-[1200px] px-6 py-3">
        <div className="flex items-center justify-between border-b border-emerald-200/50 pb-2">
          <Link
            href="/"
            className="font-medium tracking-wide text-emerald-900 hover:text-emerald-700 transition-colors"
            aria-label={`${brand} home`}
          >
            {brand}
          </Link>

          <nav className="flex items-center gap-4 text-xs sm:text-sm text-emerald-800/80">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-2 py-1 rounded-md transition-colors ${
                    isActive
                      ? "text-emerald-900 bg-emerald-100/70"
                      : "hover:text-emerald-900 hover:bg-emerald-100/40"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
