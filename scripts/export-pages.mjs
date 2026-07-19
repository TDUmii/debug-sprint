import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const output = resolve(root, "static-site");
const response = await fetch("http://localhost:3001/");

if (!response.ok) {
  throw new Error(`Không thể đọc bản local: HTTP ${response.status}`);
}

let html = await response.text();
html = html
  .replaceAll('href="/assets/', 'href="./assets/')
  .replaceAll('src="/assets/', 'src="./assets/')
  .replaceAll('\"/assets/', '\"./assets/')
  .replaceAll('href="/favicon.svg"', 'href="./favicon.svg"')
  .replaceAll('href="/file.svg"', 'href="./file.svg"')
  .replaceAll('href="/globe.svg"', 'href="./globe.svg"')
  .replaceAll('href="/window.svg"', 'href="./window.svg"');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(resolve(root, "dist/client/assets"), resolve(output, "assets"), { recursive: true });
await cp(resolve(root, "public/favicon.svg"), resolve(output, "favicon.svg"));
await writeFile(resolve(output, "index.html"), html, "utf8");
await writeFile(resolve(output, ".nojekyll"), "", "utf8");
await writeFile(resolve(output, "404.html"), html, "utf8");

console.log(`Đã tạo bản GitHub Pages tại ${output}`);
