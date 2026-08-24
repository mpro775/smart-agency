import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const siteOrigin = (process.env.SITE_URL || process.env.VITE_SITE_URL || "https://smartagency-ye.com").replace(/\/$/, "");
const configuredApiOrigin = process.env.SITEMAP_API_URL?.trim();

if (configuredApiOrigin && !/^https?:\/\//.test(configuredApiOrigin)) {
  throw new Error(
    "[sitemap] SITEMAP_API_URL must be an absolute http(s) public API origin.",
  );
}

const apiOrigin = configuredApiOrigin?.replace(/\/$/, "") || null;

const staticPaths = ["", "/about", "/projects", "/blog", "/contact", "/quote", "/bot"];

const escapeXml = (value) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

async function fetchSlugs(endpoint) {
  if (!apiOrigin) return [];
  const slugs = [];
  let page = 1;
  let totalPages = 1;

  do {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const separator = endpoint.includes("?") ? "&" : "?";
      const response = await fetch(
        `${apiOrigin}${endpoint}${separator}page=${page}&limit=100&lang=ar`,
        { signal: controller.signal, headers: { "Accept-Language": "ar" } },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const items = Array.isArray(payload?.data) ? payload.data : [];
      slugs.push(
        ...items
          .map((item) => item?.slug)
          .filter((slug) => typeof slug === "string" && slug.length > 0),
      );
      totalPages = Number(payload?.meta?.totalPages) || 1;
      page += 1;
    } catch (error) {
      throw new Error(
        `[sitemap] Failed to fetch ${endpoint} from ${apiOrigin}: ${error.message}`,
        { cause: error },
      );
    } finally {
      clearTimeout(timeout);
    }
  } while (page <= totalPages);

  return slugs;
}

function localizedEntries(pathname) {
  const ar = `${siteOrigin}/ar${pathname}`;
  const en = `${siteOrigin}/en${pathname}`;
  const alternates = `<xhtml:link rel="alternate" hreflang="ar" href="${escapeXml(ar)}"/><xhtml:link rel="alternate" hreflang="en" href="${escapeXml(en)}"/><xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(ar)}"/>`;
  return [`<url><loc>${escapeXml(ar)}</loc>${alternates}</url>`, `<url><loc>${escapeXml(en)}</loc>${alternates}</url>`];
}

if (!apiOrigin) {
  console.warn(
    "[sitemap] SITEMAP_API_URL is not set; generating static localized routes only.",
  );
}

const [projectSlugs, blogSlugs] = await Promise.all([
  fetchSlugs("/projects"),
  fetchSlugs("/blog"),
]);

const paths = [
  ...staticPaths,
  ...projectSlugs.map((slug) => `/projects/${encodeURIComponent(slug)}`),
  ...blogSlugs.map((slug) => `/blog/${encodeURIComponent(slug)}`),
];
const uniquePaths = [...new Set(paths)];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${uniquePaths.flatMap(localizedEntries).map((entry) => `  ${entry}`).join("\n")}\n</urlset>\n`;
const outputPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/sitemap.xml");
await writeFile(outputPath, xml, "utf8");
console.log(`[sitemap] Wrote ${uniquePaths.length * 2} localized URLs to ${outputPath}`);
