// components/Layout/PhambiliLayout.jsx

export default function PhambiliLayout({ children }) {
  return (
    <div className="min-h-screen w-full text-emerald-950">
      {/* Background gradient + mask */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-sky-50 to-zinc-100" />
        <div className="absolute inset-0 pointer-events-none [mask:radial-gradient(80%_60%_at_50%_20%,#000_60%,transparent)]" />
      </div>

      {/* Page content */}
      <div className="mx-auto w-full max-w-[1200px] px-6">
        {children}
      </div>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-[1200px] px-6 py-8 text-xs text-emerald-900/70">
        © {new Date().getFullYear()} Phambili.
      </footer>
    </div>
  );
}
