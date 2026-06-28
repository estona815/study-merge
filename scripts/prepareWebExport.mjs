import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const distPath = join(process.cwd(), "dist");
const indexPath = join(process.cwd(), "dist", "index.html");
const originalHtml = readFileSync(indexPath, "utf8");

const patchedHtml = originalHtml
  .replace('href="/favicon.ico"', 'href="./favicon.ico"')
  .replaceAll('src="/_expo/', 'src="./_expo/');

if (patchedHtml !== originalHtml) {
  writeFileSync(indexPath, patchedHtml, "utf8");
  console.log("Patched dist/index.html for GitHub Pages relative asset paths.");
} else {
  console.log("No GitHub Pages path rewrites were needed.");
}

writeFileSync(join(distPath, ".nojekyll"), "", "utf8");
console.log("Wrote dist/.nojekyll for GitHub Pages asset serving.");
