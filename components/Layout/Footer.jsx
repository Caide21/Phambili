// components/Layout/Footer.jsx
export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1200px] px-6 py-8 text-sm text-emerald-800 dark:text-emerald-100 border-t border-emerald-200/50 mt-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left side: copyright */}
        <p>© {new Date().getFullYear()} Phambili. All rights reserved.</p>

        {/* Right side: quick links */}
        <nav className="flex gap-6 text-emerald-700 dark:text-emerald-100">
          <a href="/about" className="hover:text-emerald-900 dark:hover:text-white">
            About
          </a>
          <a href="/contact" className="hover:text-emerald-900 dark:hover:text-white">
            Contact
          </a>
          <a href="/privacy" className="hover:text-emerald-900 dark:hover:text-white">
            Privacy
          </a>
        </nav>
      </div>
    </footer>
  );
}
