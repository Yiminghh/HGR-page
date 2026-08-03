import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function exportedHtml() {
  return readFile(new URL("../out/index.html", import.meta.url), "utf8");
}

test("exports the complete HGR project page", async () => {
  const html = await exportedHtml();

  assert.match(html, /<title>HGR — Higher-Order Molecular Grammars<\/title>/i);
  assert.match(html, /Higher-Order Molecular Grammars/);
  assert.match(html, /Higher-order.*molecular topology.*rule sequence/is);
  assert.match(html, /100%/);
  assert.match(html, /1\.18M/);
  assert.match(html, /RingDiv/);
  assert.match(html, /HGR-FM/);
  assert.match(html, /GuacaMol FCD score \(higher is better\): 84\.4 vs 78\.3/);
  assert.match(html, /RSG used throughout the main experiments and MIG reported as an ablation/);
});

test("prefixes public assets for the GitHub project subpath", async () => {
  const html = await exportedHtml();

  assert.match(html, /\/HGR-page\/fig\/hgr-overview\.webp/);
  assert.match(html, /\/HGR-page\/logos\/imperial-wordmark\.svg/);
  assert.match(html, /\/HGR-page\/favicon\.svg/);
  assert.doesNotMatch(html, /(?:src|href)=["']\/(?:fig|logos|favicon\.svg)/);
});

test("keeps all section links available in the mobile navigation", async () => {
  const html = await exportedHtml();
  const cssFiles = await readdir(new URL("../out/_next/static/chunks/", import.meta.url));
  const cssName = cssFiles.find((name) => name.endsWith(".css"));
  assert.ok(cssName, "expected an exported stylesheet");
  const css = await readFile(
    new URL(`../out/_next/static/chunks/${cssName}`, import.meta.url),
    "utf8",
  );

  for (const anchor of ["method", "ringdiv", "results", "foundation-model", "resources", "citation"]) {
    assert.match(html, new RegExp(`href=["']#${anchor}["']`));
  }
  assert.match(css, /overflow-x:\s*auto/);
  assert.doesNotMatch(css, /\.nav-links\s*\{[^}]*display:\s*none/);
});
