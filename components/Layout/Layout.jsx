import { ThemeProvider } from "@/context/ThemeContext";

export default function Layout({ children }) {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-neutral-50 text-gray-900">
        <header className="p-6 border-b border-gray-200">Phambili Logo + Nav</header>
        <main className="p-8">{children}</main>
        <footer className="p-6 border-t border-gray-200">© Phambili Global</footer>
      </div>
    </ThemeProvider>
  );
}
