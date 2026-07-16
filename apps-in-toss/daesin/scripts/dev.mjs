import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { execFileSync } from "node:child_process";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(projectRoot, "dist");
const port = Number(process.env.PORT ?? 4182);

execFileSync(process.execPath, [join(projectRoot, "scripts", "build.mjs")], { stdio: "inherit" });

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
};

createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", `http://${request.headers.host}`).pathname;
  const requested = normalize(join(dist, pathname === "/" ? "index.html" : pathname));
  const file = requested.startsWith(dist) && existsSync(requested) ? requested : join(dist, "index.html");
  response.writeHead(200, { "Content-Type": mime[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(response);
}).listen(port, () => console.log(`DAESIN AIT preview: http://localhost:${port}`));
