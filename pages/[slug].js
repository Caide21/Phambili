// pages/[slug].js
import Head from "next/head";
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
      return { pages, source: rel };
    }
  }
  return { pages: [], source: null };
}

export async function getStaticPaths() {
  const { pages } = loadContent();
  const paths = pages.map((p) => ({ params: { slug: String(p.slug) } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { pages, source } = loadContent();
  const page = pages.find((p) => String(p.slug) === String(params.slug));

  if (!page) return { notFound: true };

  return {
    props: {
      title: page.title || params.slug,
      subtitle: page.subtitle || null,
      body: page.body || "",
      meta: page.meta || {},
      _source: source,
    },
    revalidate: 60,
  };
}

export default function DynamicPage({ title, subtitle, body, meta }) {
  return (
    <>
      <Head>
        <title>{title} · Phambili</title>
        {meta?.description && <meta name="description" content={meta.description} />}
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
        <section className="max-w-4xl mx-auto px-6 py-14">
          <h1 className="text-3xl md:text-5xl font-semibold text-emerald-900">{title}</h1>
          {subtitle && <p className="mt-3 text-emerald-800/90 text-lg">{subtitle}</p>}

          {/* If body is a string → paragraph. If array → bullet cards. */}
          {typeof body === "string" ? (
            <p className="prose prose-emerald mt-8 max-w-none">{body}</p>
          ) : Array.isArray(body) ? (
            <div className="mt-8 grid gap-6">
              {body.map((b, i) => (
                <div key={i} className="rounded-2xl p-6 bg-white shadow-sm">
                  <div className="text-emerald-900/90">{b}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 text-emerald-900/80">No content provided.</div>
          )}
        </section>
      </main>
    </>
  );
}
