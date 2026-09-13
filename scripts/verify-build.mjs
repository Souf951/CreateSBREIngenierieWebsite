import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";
const root = resolve("dist");
const html = await readFile(resolve(root, "index.html"), "utf8");
assert.match(html, /Chaque détail/);
assert.match(html, /Sous/);
assert.match(html, /contact-form/);
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const url = match[1];
  if (!url.startsWith("/CreateSBREIngenierieWebsite/") || url.includes("#"))
    continue;
  const file = resolve(root, url.replace("/CreateSBREIngenierieWebsite/", ""));
  assert.ok((await stat(file)).isFile(), `Missing output asset: ${url}`);
}
for (const project of [
  "tertiaire-geneve",
  "micro-logements-lancy",
  "villa-prangins",
])
  assert.ok(
    html.includes(`/#/projet/${project}`),
    `Missing safe Pages URL for ${project}`,
  );
assert.equal(
  (html.match(/<h1[ >]/g) || []).length,
  2,
  "One main heading plus the noscript heading",
);
const assets = await readdir(resolve(root, "assets"));
assert.ok(
  assets.some((f) => f.startsWith("BuildingScene-") && f.endsWith(".js")),
  "3D must remain a separate chunk",
);
assert.ok(
  !assets.some((f) => /\.(mp4|mov)$/i.test(f)),
  "No heavy video in production",
);
const sitemap = await readFile(resolve(root, "sitemap.xml"), "utf8");
assert.ok(
  !sitemap.includes("/projet/"),
  "Hash routes must not pretend to be standalone indexed pages",
);
console.log(
  "Build verified: pre-rendered content, Pages links, assets, sitemap and independent 3D chunk.",
);

for (const name of await readdir(resolve("src/media"))) {
  if (!name.endsWith(".webp")) continue;
  const bytes = await readFile(resolve("src/media", name));
  assert.ok(
    bytes.length > 12 &&
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP",
    `Empty or invalid WebP: ${name}`,
  );
}
console.log("Image headers verified: no empty WebP files.");
