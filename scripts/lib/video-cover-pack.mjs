import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { create as createFont } from 'fontkitten';

sharp.concurrency(1);
sharp.cache(false);

export const COVER_FORMATS = Object.freeze({
  horizontal: Object.freeze({ width: 1280, height: 720, grid: 48 }),
  vertical: Object.freeze({ width: 1080, height: 1920, grid: 60 }),
});

export const APPROVED_PORTRAITS = Object.freeze([
  'leo-ferraz-cutout-front.png',
  'leo-ferraz-cutout-smile-three-quarter.png',
  'leo-ferraz-cutout-present-right.png',
  'leo-ferraz-cutout-neutral.png',
  'leo-ferraz-cutout-present-left.png',
  'leo-ferraz-cutout-arms-crossed.png',
]);

export async function loadCoverManifest(manifestPath) {
  return JSON.parse(await fs.promises.readFile(manifestPath, 'utf8'));
}

export function validateCoverManifest(entries) {
  if (!Array.isArray(entries) || entries.length === 0) throw new Error('manifest must be a non-empty array');
  const ids = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') throw new Error('manifest entry must be an object');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id ?? '')) throw new Error(`invalid id: ${entry.id ?? ''}`);
    if (ids.has(entry.id)) throw new Error(`duplicate id: ${entry.id}`);
    ids.add(entry.id);
    if (typeof entry.category !== 'string' || entry.category.trim() === '') throw new Error(`empty category: ${entry.id}`);
    if (!Array.isArray(entry.headlineLines) || ![2, 3].includes(entry.headlineLines.length)) {
      throw new Error(`headlineLines must contain 2 or 3 lines: ${entry.id}`);
    }
    if (entry.headlineLines.some((line) => typeof line !== 'string' || line.trim() === '')) {
      throw new Error(`headline line must be non-empty: ${entry.id}`);
    }
    if (!APPROVED_PORTRAITS.includes(entry.portrait)) throw new Error(`unsupported portrait: ${entry.portrait}`);
  }
  return entries;
}

export async function renderCoverSvg() {
  throw new Error('renderCoverSvg not implemented');
}

export async function buildCoverPack() {
  throw new Error('buildCoverPack not implemented');
}
