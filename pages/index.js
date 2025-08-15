// pages/index.js
import Link from "next/link";
import path from "path";
import fs from "fs";

const CANDIDATES = [
  "content/content.json",
  "data/content.json",
  "data/phambili-lite.json",
  "public/data/content.json",
];

function loadContent() {
  const cwd = process.cwd();
  for (const rel of CANDIDATES) {
    const p = path.join(cwd, rel);
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf-8");
      const data = JSON.parse(raw);
      const pages = Array.isArray(data) ? data : data.pages || [];
      return pages;
    }
  }
  return [];
}

export async function getStaticProps() {
  return { props: { pages: loadContent() }, revalidate: 60 };
}

export default function Home({ pages }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-semibold text-emerald-900">Phambili</h1>
        <p className="mt-3 text-emerald-800/90 text-lg">
          Choose a section:
        </p>

        <ul className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pages.map((p) => (
            <li key={p.slug} className="rounded-2xl bg-white shadow-sm ring-1 ring-emerald-200/60">
              <Link href={`/${p.slug}`} className="block p-6 hover:bg-emerald-50/60 transition-colors">
                <div className="text-emerald-900 font-medium">{p.title || p.slug}</div>
                {p.subtitle && <div className="text-emerald-800/80 text-sm mt-1">{p.subtitle}</div>}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
