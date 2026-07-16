import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const frameworkAit = join(dirname(projectRoot), "node_modules", "@apps-in-toss", "web-framework", "ait.js");

execFileSync(process.execPath, [frameworkAit, ...process.argv.slice(2)], {
  cwd: projectRoot,
  stdio: "inherit",
  env: { ...process.env, PATH: `${join(projectRoot, "scripts")}:${dirname(process.execPath)}:${process.env.PATH}` },
});
