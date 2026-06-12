const fs = require("fs");
const path = require("path");

const root = process.cwd();
const dist = path.join(root, "dist");
const copyRoots = ["assets", "public"];
const copyFiles = ["index.html", "styles.css", "app.js", "manifest.json", "service-worker.js"];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function extract(pattern, file, label) {
  const match = read(file).match(pattern);
  if (!match) throw new Error(`${label} not found in ${file}`);
  return match[1];
}

function copyFile(relativePath) {
  const source = path.join(root, relativePath);
  const target = path.join(dist, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of copyFiles) {
  copyFile(file);
}

for (const dir of copyRoots) {
  fs.cpSync(path.join(root, dir), path.join(dist, dir), { recursive: true });
}

const appBuild = extract(/const appBuild\s*=\s*"([^"]+)"/, "app.js", "appBuild");
const serviceWorkerCache = extract(/const cacheName\s*=\s*"([^"]+)"/, "service-worker.js", "service worker cache");

if (!serviceWorkerCache.includes(appBuild)) {
  throw new Error(`service worker cache ${serviceWorkerCache} does not include app build ${appBuild}`);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  appBuild,
  serviceWorkerCache,
  source: "static-copy",
  entry: "index.html",
};

fs.writeFileSync(path.join(dist, "build-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Built static web dist for ${appBuild} at ${path.relative(root, dist)}`);
