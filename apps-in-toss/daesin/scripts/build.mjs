import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const workspaceRoot = dirname(dirname(projectRoot));
const dist = join(projectRoot, "dist");
const esbuild = join(workspaceRoot, "node_modules", ".bin", "esbuild");
const iconSource = join(workspaceRoot, "assets", "daesin", "app-icon.png");

if (!existsSync(esbuild)) throw new Error(`esbuild를 찾지 못했습니다: ${esbuild}`);
if (!existsSync(iconSource)) throw new Error(`DAESIN 아이콘을 찾지 못했습니다: ${iconSource}`);

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(dist, "assets"), { recursive: true });
cpSync(iconSource, join(dist, "assets", "app-icon.png"));

writeFileSync(
  join(dist, "index.html"),
  `<!doctype html><html lang="ko"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/><meta name="theme-color" content="#160F1E"/><meta name="color-scheme" content="dark"/><title>대신</title><link rel="stylesheet" href="/assets/app.css"/></head><body><div id="root"></div><script src="/assets/app.js"></script></body></html>`,
);

execFileSync(
  esbuild,
  [
    "src/index.tsx",
    "--bundle",
    "--format=iife",
    "--platform=browser",
    "--jsx=automatic",
    "--minify",
    "--loader:.png=file",
    "--asset-names=[name]-[hash]",
    "--public-path=/assets",
    "--outfile=dist/assets/app.js",
    ...(process.env.DAESIN_PREVIEW === "1"
      ? ["--alias:@toss/tds-mobile=./src/tds-preview.tsx"]
      : []),
  ],
  { cwd: projectRoot, stdio: "inherit" },
);

console.log("Built DAESIN Apps-in-Toss web bundle → dist");
