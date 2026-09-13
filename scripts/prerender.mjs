import { readFile, writeFile } from "node:fs/promises";
process.env.NODE_ENV = "production";
const { render } = await import("../.prerender/render.js");
const path = new URL("../dist/index.html", import.meta.url);
const html = await readFile(path, "utf8");
const markup = render().replace(
  /href="\/(?!CreateSBREIngenierieWebsite)([^"\s]*)"/g,
  'href="/CreateSBREIngenierieWebsite/#/$1"',
);
await writeFile(
  path,
  html.replace('<div id="root"></div>', `<div id="root">${markup}</div>`),
);
console.log(
  "Homepage pre-rendered: content and links available without JavaScript.",
);
