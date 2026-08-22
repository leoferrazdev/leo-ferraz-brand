import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCoverPack } from './lib/video-cover-pack.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(rootDir, 'brand-assets', 'capas', 'master-pack');
const manifestPath = path.join(outputDir, 'content.json');

const result = await buildCoverPack({ rootDir, outputDir, manifestPath });
console.log(`covers: ${result.covers.length}`);
console.log(`contact_sheet: ${path.relative(rootDir, result.contactSheet)}`);
