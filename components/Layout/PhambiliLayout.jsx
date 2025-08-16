// components/Layout/PhambiliLayout.jsx
//PhambiliLayout = the canvas/background + content container.
//Owns the full-screen gradient & radial mask backdrop.
//Centers content with max-width container.
//Does NOT render Nav or Footer logic (that’s PageShell’s job).
//Think: “paint the wall and set the room dimensions.”

export default function PhambiliLayout({ children }) {
  return (
    <div className="min-h-screen w-full text-emerald-950 dark:text-emerald-50">
      {/* Background gradient + mask */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 via-sky-50 to-zinc-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-black" />
        <div className="absolute inset-0 pointer-events-none [mask:radial-gradient(80%_60%_at_50%_20%,#000_60%,transparent)]" />
      </div>

      {/* Page content */}
      <div className="mx-auto w-full max-w-[1200px] px-6">
        {children}
      </div>
    </div>
  );
}
