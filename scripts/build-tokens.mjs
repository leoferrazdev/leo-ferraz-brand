import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'tokens', 'tokens.json');
const outputPath = path.join(root, 'src', 'generated', 'tokens.css');
const tokens = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

function get(pathName) {
  return pathName.split('.').reduce((value, key) => value?.[key], tokens);
}

function resolve(value) {
  if (value && typeof value === 'object' && value.ref) return resolve(get(value.ref));
  return value;
}

function cssName(name) {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function add(lines, name, value) {
  lines.push(`  --lf-${name}: ${resolve(value)};`);
}

const lines = [
  '/* GENERATED FILE — DO NOT EDIT */',
  '/* Source: tokens/tokens.json */',
  '/* Deterministic output from scripts/build-tokens.mjs */',
  '',
  ':root {',
];

for (const [name, value] of [
  ['color-background', get('color.background')],
  ['color-surface-1', get('color.surface.1')],
  ['color-surface-2', get('color.surface.2')],
  ['color-text-primary', get('color.text.primary')],
  ['color-text-secondary', get('color.text.secondary')],
  ['color-text-muted', get('color.text.muted')],
  ['color-text-disabled', get('color.text.disabled')],
  ['color-border-default', get('color.border.default')],
  ['color-border-strong', get('color.border.strong')],
  ['color-accent-primary', get('color.accent.primary')],
  ['color-accent-strong', get('color.accent.strong')],
  ['color-accent-subtle', get('color.accent.subtle')],
  ['color-experimental-primary', get('color.experimental.primary')],
  ['color-experimental-subtle', get('color.experimental.subtle')],
  ['color-state-success', get('color.semantic.success')],
  ['color-state-warning', get('color.semantic.warning')],
  ['color-state-error', get('color.semantic.error')],
  ['color-state-info', get('color.semantic.info')],
]) add(lines, name, value);

for (const name of ['4', '8', '12', '16', '24', '32', '48', '64']) add(lines, `space-${name}`, get(`space.${name}`));
for (const [name, value] of [
  ['micro', get('spacing.micro')],
  ['inline-compact', get('spacing.inline.compact')],
  ['inline-standard', get('spacing.inline.standard')],
  ['component-compact', get('spacing.component.compact')],
  ['component-standard', get('spacing.component.standard')],
  ['component-comfortable', get('spacing.component.comfortable')],
  ['block-content', get('spacing.block.content')],
  ['block-major', get('spacing.block.major')],
  ['section-standard', get('spacing.section.standard')],
  ['section-major', get('spacing.section.major')],
]) add(lines, `spacing-${name}`, value);

for (const name of ['0', '4', '8']) add(lines, `radius-${name}`, get(`radius.${name}`));
for (const [name, value] of [
  ['structural', get('radius.structural')],
  ['control', get('radius.control')],
  ['surface', get('radius.surface')],
  ['card', get('radius.card')],
  ['artifact', get('radius.artifact')],
]) add(lines, `radius-${name}`, value);

for (const [name, value] of [
  ['border-width-standard', get('border.width.standard')],
  ['border-width-strong', get('border.width.strong')],
  ['border-color-standard', get('border.color.standard')],
  ['border-color-strong', get('border.color.strong')],
  ['border-default', get('border.default')],
  ['border-emphasis', get('border.emphasis')],
  ['shadow-none', get('shadow.none')],
  ['shadow-exceptional', get('shadow.exceptional')],
  ['shadow-default', get('shadow.default')],
  ['font-family-sans', get('font.family.sans')],
  ['font-family-mono', get('font.family.mono')],
  ['font-weight-regular', get('font.weight.regular')],
  ['font-weight-medium', get('font.weight.medium')],
  ['type-line-height-display', get('typography.lineHeight.display')],
  ['type-line-height-heading', get('typography.lineHeight.heading')],
  ['type-line-height-body', get('typography.lineHeight.body')],
  ['type-line-height-small', get('typography.lineHeight.small')],
  ['type-line-height-mono', get('typography.lineHeight.mono')],
  ['type-tracking-display', get('typography.tracking.display')],
  ['type-tracking-label', get('typography.tracking.label')],
  ['type-tracking-metadata', get('typography.tracking.metadata')],
  ['type-tracking-mono', get('typography.tracking.mono')],
  ['breakpoint-small-max', get('breakpoint.smallMax')],
  ['breakpoint-medium-min', get('breakpoint.mediumMin')],
  ['breakpoint-medium-max', get('breakpoint.mediumMax')],
  ['breakpoint-large-min', get('breakpoint.largeMin')],
  ['container-max', get('container.max')],
  ['signature-wordmark-weight', get('signature.wordmark.weight')],
  ['signature-wordmark-tracking', get('signature.wordmark.tracking')],
  ['signature-wordmark-minimum-font-size', get('signature.wordmark.minimumFontSize')],
  ['signature-wordmark-clear-space', get('signature.wordmark.clearSpace')],
  ['signature-utility-mark-minimum-box', get('signature.utilityMark.minimumBox')],
  ['signature-utility-mark-clear-space', get('signature.utilityMark.clearSpace')],
  ['signature-marker-size', get('signature.marker.size')],
  ['signature-marker-gap', get('signature.marker.gap')],
  ['signature-marker-color', get('signature.marker.color')],
]) add(lines, name, value);

for (const [role, values] of Object.entries(tokens.typography.role)) {
  add(lines, `type-${cssName(role)}-family`, values.family);
  add(lines, `type-${cssName(role)}-weight`, values.weight);
  add(lines, `type-${cssName(role)}-line-height`, values.lineHeight);
  if (values.tracking) add(lines, `type-${cssName(role)}-tracking`, values.tracking);
  for (const [breakpoint, size] of Object.entries(values.size)) add(lines, `type-${cssName(role)}-size-${breakpoint}`, size);
}

for (const [range, values] of Object.entries(tokens.grid)) {
  add(lines, `grid-${range}-columns`, values.columns);
  add(lines, `grid-${range}-gutter`, values.gutter);
  add(lines, `grid-${range}-outer`, values.outer);
}

lines.push('}', '');
lines.push('@media (min-width: 768px) and (max-width: 1199px) {', '  :root {');
for (const [role, values] of Object.entries(tokens.typography.role)) add(lines, `type-${cssName(role)}-size`, values.size.medium);
lines.push('  }', '}', '');
lines.push('@media (max-width: 767px) {', '  :root {');
for (const [role, values] of Object.entries(tokens.typography.role)) add(lines, `type-${cssName(role)}-size`, values.size.small);
lines.push('  }', '}');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
console.log(`Generated ${path.relative(root, outputPath)}`);
