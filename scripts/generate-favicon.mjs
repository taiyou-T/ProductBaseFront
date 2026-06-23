import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svgPath = join(root, "src/app/icon.svg");
const outputs = [join(root, "src/app/favicon.ico"), join(root, "public/favicon.ico")];

const svg = readFileSync(svgPath);
const sizes = [16, 32, 48];
const pngBuffers = await Promise.all(
  sizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);
const ico = await toIco(pngBuffers);

for (const output of outputs) {
  writeFileSync(output, ico);
}

console.log(`Generated favicon.ico (${ico.length} bytes) -> ${outputs.join(", ")}`);
