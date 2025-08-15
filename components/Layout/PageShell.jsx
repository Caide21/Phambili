// components/Layout/PageShell.jsx
export default function PageShell({
  kicker,        // small label above title (optional)
  title,         // main h1
  subtitle,      // optional lead paragraph
  actions,       // optional React node (buttons/links)
  children,      // page content
}) {
  return (
    <section className="relative">
      {/* Header block */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          {kicker && (
            <div className="text-xs uppercase tracking-widest text-sky-700/70">
              {kicker}
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-semibold text-emerald-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-emerald-900/80 max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="mt-2 md:mt-0">{actions}</div>}
      </div>

      {/* Content card */}
      <div className="relative mt-8 rounded-3xl bg-white/90 shadow-sm ring-1 ring-emerald-200/60">
        {/* blue glow edge */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-3xl bg-gradient-to-b from-sky-200/40 via-transparent to-emerald-200/30 [mask:linear-gradient(#000_0,transparent_60%)]" />
        <div className="relative p-6 md:p-8">
          {children}
        </div>
      </div>
    </section>
  );
}
