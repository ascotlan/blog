// Fails if any post or doc contains an em dash (U+2014).
import fs from 'node:fs';
import path from 'node:path';

const roots = ['src/content/blog', 'src/pages', 'templates', 'Agents.md', 'README.md'];
const hits = [];
function scan(p) {
  if (!fs.existsSync(p)) return;
  if (fs.statSync(p).isDirectory()) return fs.readdirSync(p).forEach((f) => scan(path.join(p, f)));
  if (!/\.(md|mdx|astro)$/.test(p)) return;
  fs.readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
    if (line.includes('\u2014')) hits.push(`${p}:${i + 1}: ${line.trim()}`);
  });
}
roots.forEach(scan);
if (hits.length) {
  console.error('Em dashes found (rewrite with periods, commas, colons or parentheses):\n' + hits.join('\n'));
  process.exit(1);
}
console.log('No em dashes found.');
