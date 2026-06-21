import { copyFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "docs", "openapi.json");
const sources = [
  join(root, "..", "ProductBaseBack", "docs", "openapi.json"),
  join(root, "docs", "openapi.json"),
];

const source = sources.find((path) => existsSync(path));

if (!source) {
  console.error("openapi.json not found. Run export on ProductBaseBack first.");
  process.exit(1);
}

if (source !== target) {
  copyFileSync(source, target);
  console.log(`Synced openapi.json from ${source}`);
} else {
  console.log("Using docs/openapi.json");
}
