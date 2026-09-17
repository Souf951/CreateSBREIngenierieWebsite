import { readFile, writeFile } from "node:fs/promises";

process.env.NODE_ENV = "production";
const { render } = await import("../.prerender/render.js");
const path = new URL("../dist/index.html", import.meta.url);
const html = await readFile(path, "utf8");

const useCustomDomain = process.env.SBRE_CUSTOM_DOMAIN === "true";
const base = useCustomDomain ? "/" : "/CreateSBREIngenierieWebsite/";
const hashBase = `${base}#/`;

const markup = render().replace(
  /href="\/([^"\s]*)"/g,
  (_match, route) => `href="${hashBase}${route}"`,
);

await writeFile(
  path,
  html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`),
);

console.log(
  `Homepage pre-rendered for ${useCustomDomain ? "custom domain" : "GitHub project Pages"}.`,
);
