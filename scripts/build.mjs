import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
for (const entry of ['index.html', 'styles.css', 'experience.css', 'app.js', 'experience.js', 'assets', 'data', 'week1', 'week2']) {
  await cp(`${root}/${entry}`, `${root}/dist/${entry}`, { recursive: true });
}
console.log('Built final site and both standalone weekly submissions in dist/.');
