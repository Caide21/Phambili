#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";
import { optimize } from "svgo";
import { parse, stringify } from "svgson";
import svgpath from "svgpath";
import bounds from "svg-path-bounds";
import { transform as svgr } from "@svgr/core";

const args = parseArgs(process.argv.slice(2));
if (!args.in || !args.outDir) die("Usage: node scripts/svg-ringify.mjs --in file.svg --outDir public/brand --name phambili-portal --rings 6 --both --makeReact");

const IN = path.resolve(args.in);
const OUTDIR = path.resolve(args.outDir);
const NAME = args.name || baseKebab(IN);
const RINGS = Number(args.rings || 6);
const BOTH = !!args.both;
const MAKE = !!args.makeReact;

await fs.mkdir(OUTDIR, { recursive: true });

const raw = await fs.readFile(IN, "utf8");

// 1) SVGO (keep viewBox, flatten transforms; DO NOT mergePaths here)
const { data: svgoed } = optimize(raw, {
  multipass: true,
  plugins: [
    { name: "preset-default", params: { overrides: {
      removeViewBox: false, removeUnknownsAndDefaults: false,
      mergePaths: false, // keep individual segments
    }}},
    "inlineStyles",
    "convertStyleToAttrs",
    "removeDimensions",
    { name: "convertTransform", params: { collapseIntoOne: true } },
  ],
});

// 2) Parse & collect paths with transforms flattened into 'd'
const ast = await parse(svgoed);
const vb = ast.attributes.viewBox; if (!vb) die("SVG missing viewBox");
const [vx, vy, vw, vh] = vb.split(/\s+/).map(Number);
const cx = vx + vw/2, cy = vy + vh/2;

const flatPaths = [];
walk(ast, "", (node, transformStack) => {
  if (node.name !== "path") return;
  const d = node.attributes.d; if (!d) return;

  // Compose transforms from ancestors + self
  const tfm = [ ...transformStack, node.attributes.transform ].filter(Boolean).join(" ");
  let dFlat = d;
  if (tfm) dFlat = svgpath(d).transform(tfm).abs().toString();

  // compute bbox + center
  const [minX, minY, maxX, maxY] = bounds(dFlat);
  const w = maxX - minX, h = maxY - minY;
  const px = (minX + maxX) / 2, py = (minY + maxY) / 2;

  // effective radius from global center (distance + a touch of size)
  const dist = Math.hypot(px - cx, py - cy);
  const effR = dist + (w + h) / 8;

  // copy attrs (retain colors)
  const attrs = { ...node.attributes };
  delete attrs.transform;
  attrs.d = dFlat;

  flatPaths.push({ attrs, effR });
});

// 3) Cluster into K rings (1D k-means on effR)
const values = flatPaths.map(p => p.effR);
const { assignments } = kmeans1d(values, RINGS);
flatPaths.forEach((p, i) => p.ring = assignments[i]);

// 4) Build two outputs: retain-colors + themeable
const outRetain = makeSvg(ast.attributes, flatPaths, { themeable:false });
const outTheme  = makeSvg(ast.attributes, flatPaths, { themeable:true });

// 5) Write files
const out1 = path.join(OUTDIR, `${NAME}.ringed.svg`);
await fs.writeFile(out1, outRetain, "utf8");
let out2 = null;
if (BOTH) {
  out2 = path.join(OUTDIR, `${NAME}.ringed.themable.svg`);
  await fs.writeFile(out2, outTheme, "utf8");
}

// 6) Optional React components
if (MAKE) {
  const compDir = path.join(process.cwd(), "components", "svg");
  await fs.mkdir(compDir, { recursive: true });

  const comp1 = await svgr(outRetain, { jsxRuntime: "automatic", titleProp: true, svgo:false }, { componentName: toPascal(NAME)+"Ringed" });
  await fs.writeFile(path.join(compDir, `${toPascal(NAME)}Ringed.jsx`), comp1, "utf8");

  if (BOTH) {
    const comp2 = await svgr(outTheme, { jsxRuntime: "automatic", titleProp: true, svgo:false }, { componentName: toPascal(NAME)+"RingedThemeable" });
    await fs.writeFile(path.join(compDir, `${toPascal(NAME)}RingedThemeable.jsx`), comp2, "utf8");
  }
}

console.log("✅ Wrote:", out1, out2 ? `\n✅ Wrote: ${out2}` : "");

// ---------- helpers ----------
function die(m){ console.error("❌", m); process.exit(2); }
function baseKebab(p){ return path.parse(p).name.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[\s_]+/g,"-").toLowerCase(); }
function toPascal(s){ return s.replace(/(^\w|[-_\s]\w)/g,m=>m.replace(/[-_\s]/,"").toUpperCase()); }
function parseArgs(a){ const f={}; for (let i=0;i<a.length;i++){ const k=a[i]; if(k.startsWith("--")){ const key=k.slice(2); const v=a[i+1] && !a[i+1].startsWith("--") ? a[++i] : true; f[key]=v; } } return f; }
function walk(node, tfm, visit){
  const nextTfm = node.attributes?.transform ? (tfm ? tfm+" "+node.attributes.transform : node.attributes.transform) : tfm;
  visit(node, tfm ? tfm.split("|") : nextTfm ? [nextTfm] : []);
  if (node.children) node.children.forEach(ch => walk(ch, nextTfm, visit));
}
function kmeans1d(vals, k, iters=25){
  const n=vals.length, sorted=[...vals].sort((a,b)=>a-b);
  const cents=Array.from({length:k},(_,i)=>sorted[Math.floor((i+0.5)*n/k)]);
  const assign=new Array(n).fill(0);
  for(let t=0;t<iters;t++){
    for(let i=0;i<n;i++){ let b=0,d=Infinity; for(let c=0;c<k;c++){ const dd=Math.abs(vals[i]-cents[c]); if(dd<d){d=dd;b=c;} } assign[i]=b; }
    for(let c=0;c<k;c++){ const cluster=vals.filter((v, i)=>assign[i]===c); if(cluster.length) cents[c]=cluster.reduce((a,b)=>a+b,0)/cluster.length; }
  }
  return { assignments: assign, centroids: cents };
}
function makeSvg(rootAttrs, paths, { themeable }){
  const attrs = { ...rootAttrs };
  delete attrs.width; delete attrs.height; // responsive
  const groups = new Map();
  for (const p of paths) {
    if (!groups.has(p.ring)) groups.set(p.ring, []);
    const a = { ...p.attrs };
    if (themeable) {
      if (a.fill && a.fill !== "none" && !a.fill.startsWith("url(")) a.fill = "currentColor";
      if (a.stroke && a.stroke !== "none" && !a.stroke.startsWith("url(")) a.stroke = "currentColor";
    }
    groups.get(p.ring).push({ name:"path", type:"element", value:"", attributes:a, children:[] });
  }
  const children = [...groups.keys()].sort((a,b)=>a-b).map(ring => ({
    name: "g", type:"element", value:"", attributes: { id:`ring-${ring}`, "data-ring": String(ring) }, children: groups.get(ring)
  }));
  return stringify({ name:"svg", type:"element", value:"", attributes: attrs, children }) + "\n";
}
