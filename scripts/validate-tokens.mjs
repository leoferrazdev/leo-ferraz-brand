import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'tokens', 'tokens.json');
const tokens = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const errors = [];

function get(pathName) {
  return pathName.split('.').reduce((value, key) => value?.[key], tokens);
}

function resolve(value, trail = []) {
  if (!value || typeof value !== 'object' || !value.ref) return value;
  if (trail.includes(value.ref)) throw new Error(`cyclic token reference: ${trail.join(' → ')} → ${value.ref}`);
  return resolve(get(value.ref), [...trail, value.ref]);
}

function required(pathName) {
  if (get(pathName) === undefined) errors.push(`missing token path: ${pathName}`);
}

const requiredPaths = [
  'meta.brand', 'meta.version', 'meta.status', 'meta.source',
  'color.background', 'color.surface.1', 'color.surface.2', 'color.text.primary', 'color.text.secondary', 'color.text.muted', 'color.text.disabled',
  'color.border.default', 'color.border.strong', 'color.accent.primary', 'color.accent.strong', 'color.accent.subtle', 'color.experimental.primary', 'color.experimental.subtle',
  'color.semantic.success', 'color.semantic.warning', 'color.semantic.error', 'color.semantic.info',
  'spacing.micro', 'spacing.inline.compact', 'spacing.inline.standard', 'spacing.component.compact', 'spacing.component.standard', 'spacing.component.comfortable', 'spacing.block.content', 'spacing.block.major', 'spacing.section.standard', 'spacing.section.major',
  'radius.0', 'radius.4', 'radius.8', 'radius.structural', 'radius.control', 'radius.surface', 'radius.card', 'radius.artifact',
  'border.width.standard', 'border.width.strong', 'border.color.standard', 'border.color.strong', 'border.default', 'border.emphasis',
  'shadow.none', 'shadow.exceptional', 'shadow.default', 'font.family.sans', 'font.family.mono', 'font.weight.regular', 'font.weight.medium',
  'typography.lineHeight.display', 'typography.lineHeight.heading', 'typography.lineHeight.body', 'typography.lineHeight.small', 'typography.lineHeight.mono',
  'typography.tracking.display', 'typography.tracking.label', 'typography.tracking.metadata', 'typography.tracking.mono',
  'breakpoint.smallMax', 'breakpoint.mediumMin', 'breakpoint.mediumMax', 'breakpoint.largeMin', 'container.max',
  'signature.wordmark.weight', 'signature.wordmark.tracking', 'signature.wordmark.minimumFontSize', 'signature.wordmark.minimumWidth', 'signature.wordmark.clearSpace',
  'signature.symbol.name', 'signature.symbol.role', 'signature.symbol.viewBox', 'signature.symbol.minimumBox', 'signature.symbol.preferredMinimumBox', 'signature.symbol.clearSpace', 'signature.symbol.gap', 'signature.symbol.primaryColor', 'signature.symbol.activeModuleColor',
];

for (const pathName of requiredPaths) required(pathName);

const allowedColors = new Set(['#0D1117', '#151B24', '#1D2632', '#2A3543', '#405064', '#F3F6FA', '#B7C2CE', '#7F8B99', '#596574', '#4DA3FF', '#86C5FF', '#0F2E4C', '#9B8CFF', '#252044', '#79D6A2', '#E7B866', '#F07F8C', '#7DD3FC']);
const colorValues = [];
const walk = (value, pathName = '') => {
  if (Array.isArray(value)) return value.forEach((item, index) => walk(item, `${pathName}.${index}`));
  if (!value || typeof value !== 'object') {
    if (typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/.test(value)) colorValues.push([pathName, value]);
    return;
  }
  for (const [key, child] of Object.entries(value)) walk(child, pathName ? `${pathName}.${key}` : key);
};
walk(tokens);
for (const [pathName, value] of colorValues) if (!allowedColors.has(value)) errors.push(`unapproved color at ${pathName}: ${value}`);

const expectedSpaces = ['4px', '8px', '12px', '16px', '24px', '32px', '48px', '64px'];
for (const value of Object.values(tokens.space)) if (!expectedSpaces.includes(value)) errors.push(`unapproved spacing primitive: ${value}`);
for (const value of Object.values(tokens.radius).filter((item) => typeof item === 'string')) if (!['0', '4px', '8px'].includes(value)) errors.push(`unapproved radius: ${value}`);
for (const value of Object.values(tokens.font.weight)) if (![400, 500].includes(value)) errors.push(`unapproved font weight: ${value}`);
for (const pathName of ['spacing.micro', 'spacing.inline.compact', 'spacing.inline.standard', 'spacing.component.compact', 'spacing.component.standard', 'spacing.component.comfortable', 'spacing.block.content', 'spacing.block.major', 'spacing.section.standard', 'spacing.section.major', 'radius.structural', 'radius.control', 'radius.surface', 'radius.card', 'radius.artifact', 'border.color.standard', 'border.color.strong', 'border.default', 'border.emphasis', 'shadow.default', 'signature.wordmark.weight']) {
  try { resolve(get(pathName)); } catch (error) { errors.push(error.message); }
}
if (tokens.meta.status !== 'approved') errors.push('tokens meta.status must be approved');
if (tokens.meta.semanticColors !== 'state communication only') errors.push('semantic color rule is missing');
if (tokens.meta.lightMode !== 'deferred_to_post_v1') errors.push('light mode disposition is missing');
if (tokens.meta.motionSystem !== 'deferred') errors.push('motion disposition is missing');
if (tokens.meta.canonicalGlowValues !== 'none') errors.push('glow disposition is missing');
if (tokens.breakpoint.smallMax !== '767px' || tokens.breakpoint.mediumMin !== '768px' || tokens.breakpoint.mediumMax !== '1199px' || tokens.breakpoint.largeMin !== '1200px') errors.push('breakpoint values drifted');
if (tokens.signature.symbol.name !== 'Constructed LF' || tokens.signature.symbol.role !== 'primary' || tokens.signature.symbol.viewBox !== '0 0 64 64') errors.push('Constructed LF symbol contract drifted');

if (errors.length) {
  console.error(errors.map((error) => `ERROR: ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${requiredPaths.length} required token paths; no drift detected.`);
