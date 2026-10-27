import { existsSync, lstatSync, mkdirSync, readFileSync, symlinkSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

// The bundled Codex pnpm runtime can use a package map without creating the
// ordinary Windows junctions expected by Vite. Normal pnpm installs never need
// this helper; it only repairs missing links in this checkout.
const modules = resolve('node_modules');
const packageMapPath = resolve(modules, '.package-map.json');
if (!existsSync(packageMapPath)) process.exit(0);

const packageMap = JSON.parse(readFileSync(packageMapPath, 'utf8')).packages;
const rootDependencies = packageMap['.']?.dependencies || {};
const required = new Map(Object.entries(rootDependencies));
for (const name of ['@rollup/rollup-win32-x64-msvc', '@esbuild/win32-x64', 'picocolors', 'nanoid', 'source-map-js']) {
  const key = Object.keys(packageMap).find(candidate => candidate.startsWith(`${name}@`));
  if (key) required.set(name, key);
}

for (const [name, key] of required) {
  const record = packageMap[key];
  if (!record?.url) continue;
  const target = resolve(modules, record.url);
  const link = resolve(modules, ...name.split('/'));
  if (!existsSync(target) || existsSync(link)) continue;
  mkdirSync(dirname(link), { recursive: true });
  symlinkSync(target, link, 'junction');
  if (!lstatSync(link).isSymbolicLink()) throw new Error(`Could not link ${name}`);
}
