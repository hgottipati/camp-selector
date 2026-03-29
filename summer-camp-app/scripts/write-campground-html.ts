/**
 * After `vite build`, writes `dist/campground/<id>/index.html` for each listing with
 * Open Graph + Twitter Card meta so shared links show the correct thumbnail.
 *
 * Set SITE_URL for production (e.g. https://your-site.netlify.app) so og:url is correct.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { campgrounds } from "../src/app/data/campgrounds.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "../dist");
const templatePath = join(distDir, "index.html");

function escapeHtmlText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return escapeHtmlText(s).replace(/"/g, "&quot;");
}

function truncate(s: string, max: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

const siteUrl = (process.env.SITE_URL ?? "http://localhost:4173").replace(/\/$/, "");

let template: string;
try {
  template = readFileSync(templatePath, "utf8");
} catch {
  console.error("write-campground-html: dist/index.html not found. Run vite build first.");
  process.exit(1);
}

for (const c of campgrounds) {
  const canonical = `${siteUrl}/campground/${c.id}`;
  const pageTitle = `${c.name} · Summer Camp 2026`;
  const desc = truncate(c.description, 220);
  const image = c.image;

  const headSnippet = [
    `<title>${escapeHtmlText(pageTitle)}</title>`,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
    `<meta name="description" content="${escapeAttr(desc)}" />`,
    `<meta property="og:title" content="${escapeAttr(pageTitle)}" />`,
    `<meta property="og:description" content="${escapeAttr(desc)}" />`,
    `<meta property="og:image" content="${escapeAttr(image)}" />`,
    `<meta property="og:image:alt" content="${escapeAttr(c.name)}" />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Summer Camp 2026" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(pageTitle)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(desc)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(image)}" />`,
  ].join("\n    ");

  const html = template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace("<head>", `<head>\n    ${headSnippet}\n`);

  const outDir = join(distDir, "campground", c.id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
}

console.log(`write-campground-html: wrote ${campgrounds.length} campground pages (SITE_URL=${siteUrl})`);
