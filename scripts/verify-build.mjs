import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";

const root = resolve("dist");
const html = await readFile(resolve(root, "index.html"), "utf8");
const useCustomDomain = process.env.SBRE_CUSTOM_DOMAIN === "true";
const base = useCustomDomain ? "/" : "/CreateSBREIngenierieWebsite/";

assert.match(html, /SBRE Ingénierie/);
assert.match(html, /contact-form/);

for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const rawUrl = match[1];
  if (
    !rawUrl ||
    rawUrl.includes("#") ||
    /^(?:https?:|mailto:|tel:|data:)/i.test(rawUrl)
  ) {
    continue;
  }

  let relative = rawUrl.split(/[?#]/)[0];
  if (!relative) continue;

  if (!useCustomDomain && relative.startsWith(base)) {
    relative = relative.slice(base.length);
  } else if (relative.startsWith("/")) {
    relative = relative.slice(1);
  }

  if (!relative || !/\.[a-z0-9]+$/i.test(relative)) continue;
  const file = resolve(root, relative);
  assert.ok((await stat(file)).isFile(), `Missing output asset: ${rawUrl}`);
}

for (const project of [
  "tertiaire-geneve",
  "micro-logements-lancy",
  "villa-prangins",
]) {
  assert.ok(
    html.includes(`${base}#/projet/${project}`),
    `Missing safe Pages URL for ${project}`,
  );
}

assert.equal(
  (html.match(/<h1[ >]/g) || []).length,
  2,
  "One main heading plus the noscript heading",
);

const assets = await readdir(resolve(root, "assets"));
assert.ok(
  assets.some((file) => file.startsWith("BuildingScene-") && file.endsWith(".js")),
  "3D must remain a separate chunk",
);
assert.ok(
  !assets.some((file) => /\.(mp4|mov)$/i.test(file)),
  "Heavy video must not be bundled into JS assets",
);

for (const file of assets) {
  const info = await stat(resolve(root, "assets", file));
  assert.ok(info.size > 0, `Zero-byte production asset: ${file}`);
}

const sitemap = await readFile(resolve(root, "sitemap.xml"), "utf8");
assert.ok(
  sitemap.includes("https://sbre-ingenierie.ch/"),
  "Sitemap must point to the production domain",
);
assert.ok(
  !sitemap.includes("/projet/"),
  "Hash routes must not pretend to be standalone indexed pages",
);

if (useCustomDomain) {
  assert.ok(
    html.includes('href="https://sbre-ingenierie.ch/"'),
    "Production canonical URL is missing",
  );
}

console.log(
  `Build verified: ${useCustomDomain ? "custom-domain production" : "GitHub Pages preview"}, prerender, assets, sitemap and independent 3D chunk OK.`,
);
