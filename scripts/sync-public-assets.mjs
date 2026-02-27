import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcAssets = path.join(root, 'src', 'assets');
const publicDir = path.join(root, 'public');
const publicAssets = path.join(publicDir, 'assets');
const faviconDir = path.join(srcAssets, 'images', 'favicon');

async function ensurePublicAssets() {
  await mkdir(publicDir, { recursive: true });
  await rm(publicAssets, { recursive: true, force: true });
  await cp(srcAssets, publicAssets, { recursive: true, force: true });

  const faviconFiles = await readdir(faviconDir, { withFileTypes: true });
  for (const entry of faviconFiles) {
    if (!entry.isFile()) {
      continue;
    }

    await cp(path.join(faviconDir, entry.name), path.join(publicDir, entry.name), {
      force: true
    });
  }
}

ensurePublicAssets().catch(error => {
  console.error(error);
  process.exit(1);
});
