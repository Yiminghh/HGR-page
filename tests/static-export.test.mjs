import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("builds a relocatable static shell", async () => {
  const html = await read("../dist/index.html");

  assert.match(html, /<title>HGR — Higher-Order Molecular Grammars<\/title>/i);
  assert.match(html, /href="\.\/favicon\.svg"/);
  assert.match(html, /src="\.\/assets\/[^"']+\.js"/);
  assert.match(html, /href="\.\/assets\/[^"']+\.css"/);
  assert.doesNotMatch(html, /\/HGR-page\//);
  assert.doesNotMatch(html, /_next/);
  assert.doesNotMatch(html, /localhost|\/Users\//);
});

test("keeps the paper-backed claims and all section anchors", async () => {
  const source = await read("../src/App.tsx");

  assert.match(source, /Higher-Order Molecular Grammars/);
  assert.match(source, /GuacaMol FCD score \(higher is better\): 84\.4 vs 78\.3/);
  assert.match(source, /RSG\s+used throughout the main experiments and MIG reported as an ablation/);
  for (const anchor of ["method", "ringdiv", "results", "foundation-model", "resources", "citation"]) {
    assert.match(source, new RegExp(`href=["']#${anchor}["']`));
  }
});

test("keeps all benchmark tables available", async () => {
  const results = JSON.parse(await read("../src/results-data.json"));

  assert.deepEqual(results.generationOrder, ["QM9", "MOSES", "GuacaMol", "ZINC250k", "RingDiv300k"]);
  assert.deepEqual(results.foundation.protocolOrder, ["Probing", "Full fine-tuning"]);
  for (const dataset of results.generationOrder) {
    assert.ok(results.generation[dataset].rows.length > 0, `${dataset} should include result rows`);
  }
});

test("keeps mobile navigation scrollable", async () => {
  const cssFiles = await readdir(new URL("../dist/assets/", import.meta.url));
  const cssName = cssFiles.find((name) => name.endsWith(".css"));
  assert.ok(cssName, "expected a generated stylesheet");
  const css = await read(`../dist/assets/${cssName}`);

  assert.match(css, /overflow-x:\s*auto/);
  assert.doesNotMatch(css, /\.nav-links\s*\{[^}]*display:\s*none/);
});
