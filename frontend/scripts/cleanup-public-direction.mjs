import fs from 'node:fs';
import path from 'node:path';

const src = path.resolve(import.meta.dirname, '..', 'src');
const roots = [path.join(src, 'components'), path.join(src, 'pages'), path.join(src, 'App.tsx')];

function collect(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) =>
    collect(path.join(target, entry.name)),
  );
}

let changed = 0;
for (const file of roots.flatMap(collect).filter((file) => /\.tsx?$/.test(file))) {
  const source = fs.readFileSync(file, 'utf8');
  const output = source
    .replace(/^(["'])use client\1;\r?\n/gm, '')
    .replace(/\s+dir="rtl"/g, '')
    .replace(/\s+dir=\{"rtl"\}/g, '');
  if (output !== source) {
    fs.writeFileSync(file, output, 'utf8');
    changed += 1;
  }
}

console.log(`Removed inherited hard-coded RTL direction from ${changed} public files.`);
