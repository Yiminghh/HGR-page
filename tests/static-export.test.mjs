import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
});

test("prefixes public assets for the GitHub project subpath", async () => {
  const html = await exportedHtml();

  assert.match(html, /\/HGR-page\/fig\/hgr-overview\.webp/);
  assert.match(html, /\/HGR-page\/logos\/imperial-wordmark\.svg/);
  assert.match(html, /\/HGR-page\/favicon\.svg/);
  assert.doesNotMatch(html, /(?:src|href)=["']\/(?:fig|logos|favicon\.svg)/);
});
