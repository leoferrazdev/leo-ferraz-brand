import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCoverPack } from './lib/video-cover-pack.mjs';

const defaultRootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function runCoverPackCli({
  rootDir = defaultRootDir,
  outputDir = path.join(rootDir, 'brand-assets', 'capas', 'master-pack'),
  manifestPath = path.join(outputDir, 'content.json'),
  log = console.log,
  warn = console.warn,
} = {}) {
  const result = await buildCoverPack({ rootDir, outputDir, manifestPath });
  for (const cover of result.covers.filter(({ extension }) => extension === 'png')) {
    const target = 0.95;
    const effective = cover.metrics.headlineLineHeight / cover.metrics.headlineSize;
    if (effective > target + Number.EPSILON) {
      warn(`warning: ${cover.id} ${cover.format} line-height target=${target.toFixed(3)} effective=${effective.toFixed(3)}`);
    }
  }
  log(`covers: ${result.covers.length}`);
  log(`contact_sheet: ${path.relative(rootDir, result.contactSheet)}`);
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await runCoverPackCli();
}
