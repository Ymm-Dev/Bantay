import { copyFile, mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'public', 'tesseract');

const CORE_DIR = path.join(root, 'node_modules', 'tesseract.js-core');
const WORKER_SRC = path.join(root, 'node_modules', 'tesseract.js', 'dist', 'worker.min.js');
const LANG_URL = 'https://tessdata.projectnaptha.com/4.0.0/eng.traineddata.gz';
const LANG_DEST = path.join(target, 'eng.traineddata.gz');

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

async function copyDirectory(source) {
  const entries = await readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    await copyFile(path.join(source, entry.name), path.join(target, entry.name));
  }
}

async function main() {
  await mkdir(target, { recursive: true });

  if (!(await exists(CORE_DIR))) {
    console.warn('[tesseract] core package not found; skipping asset copy.');
    return;
  }

  await copyDirectory(CORE_DIR);

  if (await exists(WORKER_SRC)) {
    await copyFile(WORKER_SRC, path.join(target, 'worker.min.js'));
  }

  if (await exists(LANG_DEST)) {
    return;
  }

  try {
    const response = await fetch(LANG_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(LANG_DEST, buffer);
    console.log(`[tesseract] downloaded ${path.relative(root, LANG_DEST)}`);
  } catch (error) {
    console.warn(
      `[tesseract] could not download language data (${error instanceof Error ? error.message : error}). OCR will retry at runtime.`,
    );
  }
}

main().catch((error) => {
  console.warn(`[tesseract] asset setup skipped: ${error?.message ?? error}`);
});
