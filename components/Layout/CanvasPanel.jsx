// components/Layout/CanvasPanel.jsx
export default function CanvasPanel({ children, className = "" }) {
  return (
    <section
      className={`relative rounded-3xl bg-white/90 shadow-sm ring-1 ring-emerald-200/60 p-6 md:p-8 ${className}`}
    >
      {children}

      {/* subtle blue/emerald aura */}
      <div className="pointer-events-none absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-sky-200/40 via-transparent to-emerald-200/30 [mask:linear-gradient(#000_0,transparent_65%)]" />
    </section>
  );
}
