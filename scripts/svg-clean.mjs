#!/usr/bin/env node
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { optimize } from "svgo";
import { transform } from "@svgr/core";
import { JSDOM } from "jsdom";
import svgoConfig from "../svgo.config.js";

const cwd = process.cwd();
const args = process.argv.slice(2);
const flags = parseArgs(args);

/*
Examples:
node scripts/svg-clean.mjs --in ./incoming/logo.svg --outDir public/brand --name phambili-portal --theme retain --makeReact
node scripts/svg-clean.mjs --in ./incoming/logo.svg --outDir public/brand --name phambili-portal --theme themeable --makeReact
node scripts/svg-clean.mjs --in ./incoming --outDir public/icons --mode icon --both --makeReact
*/

if (!flags.in) die("Provide --in <file-or-folder>");
if (!flags.outDir) die("Provide --outDir <dest folder (e.g., public/icons)>");
const mode = flags.mode === "icon" ? "icon" : "illustration";
const theme = flags.theme === "themeable" ? "themeable" : "retain"; // default retain
const makeReact = Boolean(flags.makeReact);
const makeBoth = Boolean(flags.both);

const targets = await collectSvgs(flags.in);
if (!targets.length) die("No .svg files found.");

await fsp.mkdir(flags.outDir, { recursive: true });
if (makeReact) await fsp.mkdir(path.join(cwd, "components", "svg"), { recursive: true });

const results = [];
for (const file of targets) {
  const baseName = flags.name ? flags.name : kebabCase(path.parse(file).name);

  // 1) read + SVGO
  const raw = await fsp.readFile(file, "utf8");
  const { data: cleaned } = optimize(raw, svgoConfig);

  // 2) produce requested variant(s)
  const toMake = makeBoth ? ["retain", "themeable"] : [theme];

  for (const variant of toMake) {
    const outName = variant === "retain" ? `${baseName}.svg` : `${baseName}.themable.svg`;
    const outSvgPath = path.join(flags.outDir, outName);

    const normalized = await normalizeSvg(cleaned, { mode, theme: variant });

    // budgets / warnings
    const bytes = Buffer.byteLength(normalized, "utf8");
    const prettyKB = Math.round(bytes / 102.4) / 10;
    if (mode === "icon" && bytes > 4096) warn(`${outName} is ${prettyKB} KB; consider simplifying.`);
    if (mode === "illustration" && bytes > 60000) warn(`${outName} is ${prettyKB} KB; consider simplifying.`);

    // write svg
    await fsp.writeFile(outSvgPath, normalized, "utf8");

    // optional React component
    let cmpPath = null;
    if (makeReact) {
      const compBase = pascalCase(baseName) + (variant === "themeable" ? "Themeable" : "");
      const jsx = await transform(
        normalized,
        { jsxRuntime: "automatic", typescript: false, svgo: false, ref: true, titleProp: true },
        { componentName: compBase }
      );
      cmpPath = path.join(cwd, "components", "svg", `${compBase}.jsx`);
      await fsp.writeFile(cmpPath, jsx, "utf8");
    }

    results.push({ file, outSvgPath, cmpPath });
  }
}

// summary
console.log("✅ SVGs written:");
for (const r of results) {
  console.log(" -", short(r.outSvgPath), r.cmpPath ? " + React" : "");
}
process.exit(0);

// ---------- helpers ----------
function die(msg){ console.error("❌", msg); process.exit(2); }
function warn(msg){ console.warn("⚠️ ", msg); }
function short(p){ return path.relative(cwd, p); }
function kebabCase(s){ return s.replace(/([a-z])([A-Z])/g,"$1-$2").replace(/[\s_]+/g,"-").toLowerCase(); }
function pascalCase(s){ return s.replace(/(^\w|[-_\s]\w)/g, m => m.replace(/[-_\s]/,"").toUpperCase()); }
function parseArgs(a){
  const f={}; for (let i=0;i<a.length;i++){const k=a[i];
    if(k.startsWith("--")){const key=k.slice(2); const v=a[i+1] && !a[i+1].startsWith("--") ? a[++i] : true; f[key]=v;}
  } return f;
}
async function collectSvgs(input){
  const p = path.resolve(cwd, input);
  const st = await fsp.stat(p);
  if (st.isDirectory()){
    const files = await walk(p);
    return files.filter(f=>f.toLowerCase().endsWith(".svg"));
  } else if (st.isFile() && p.toLowerCase().endsWith(".svg")){
    return [p];
  }
  return [];
}
async function walk(dir){
  const out=[]; const items=await fsp.readdir(dir,{withFileTypes:true});
  for (const it of items){
    const fp=path.join(dir,it.name);
    if(it.isDirectory()) out.push(...await walk(fp));
    else out.push(fp);
  }
  return out;
}

async function normalizeSvg(svg, { mode, theme }) {
  const { window } = new JSDOM(svg, { contentType: "image/svg+xml" });
  const doc = window.document;
  const root = doc.querySelector("svg");
  if (!root) die("Not an SVG.");
  if (!root.getAttribute("viewBox")) die("SVG missing viewBox.");

  // Disallow heavy features
  const banned = ["image","foreignObject","filter","mask","clipPath","pattern","script"];
  for (const t of banned) if (doc.querySelector(t)) die(`SVG contains <${t}> which is disallowed.`);

  // THEME HANDLING
  if (theme === "themeable") {
    // Nuke inline styles then force currentColor
    doc.querySelectorAll("[style]").forEach(n => n.removeAttribute("style"));
    doc.querySelectorAll("[fill]").forEach(n => {
      const v = n.getAttribute("fill");
      if (v && v !== "none" && !v.startsWith("url(")) n.setAttribute("fill","currentColor");
    });
    doc.querySelectorAll("[stroke]").forEach(n => {
      const v = n.getAttribute("stroke");
      if (v && v !== "none" && !v.startsWith("url(")) n.setAttribute("stroke","currentColor");
    });
    if (!doc.querySelector("[fill],[stroke]")) root.setAttribute("fill","currentColor");
  } else {
    // RETAIN colors: if any elements still have inline style, convert the common bits
    doc.querySelectorAll("[style]").forEach(el => {
      const rules = el.getAttribute("style").split(";").map(s => s.trim()).filter(Boolean);
      for (const rule of rules) {
        const [prop, val] = rule.split(":").map(x => x && x.trim());
        if (!prop || !val) continue;
        if (prop === "fill" || prop === "stroke" || prop === "stroke-width" ||
            prop === "stroke-linecap" || prop === "stroke-linejoin" ||
            prop === "opacity" || prop === "fill-opacity" || prop === "stroke-opacity") {
          el.setAttribute(prop, val);
        }
      }
      el.removeAttribute("style");
    });
  }

  // Serialize back
  const out = root.outerHTML.replace(/\s{2,}/g," ").replace(/>[\s\r\n]+</g,"><");
  return out.endsWith("\n") ? out : out + "\n";
}

