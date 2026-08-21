// Rebuilds legendas.srt against v2's actual timeline instead of shifting the
// old file by a guessed offset.
//
// The old captions were authored against v1, which drifts against v2 by a
// measured amount that GROWS across the video (about -20ms near the start,
// -420ms by the end — see check-caption-sync.mjs) rather than sitting at one
// constant offset. A single shift value cannot correct that; nothing short of
// a real re-timing does.
//
// edl.json already carries the exact text (`quote`) of every cut in source
// time. Since v2 is built by concatenating those same ranges back to back
// with zero gap (rebuild-video.mjs's trim+concat, frame-accurate by
// construction), each range's position on v2's OUTPUT timeline is just the
// cumulative sum of the ranges before it — not measured, not interpolated,
// exact by the same arithmetic that built the file.

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const editRoot = path.join(root, 'videos', 'edit');
const edl = JSON.parse(fs.readFileSync(path.join(editRoot, 'edl.json'), 'utf8'));
// Written to the centralised v2 deliverable folder, alongside the video and
// thumbnail it captions — not videos/edit/, which holds v1's working files.
const outRoot = path.join(root, 'videos', 'v2', 'youtube-horizontal');
fs.mkdirSync(outRoot, { recursive: true });

function srtTime(t) {
  const ms = Math.round(t * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const msRem = ms % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(msRem).padStart(3, '0')}`;
}

// Matches the original file's visual convention (natural word wrap, no line
// over ~42 chars) without trying to reproduce its exact break points, which
// depended on word-level timing this rebuild does not have.
function wrap(text, maxChars = 42) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length > maxChars && current) { lines.push(current); current = w; } else { current = next; }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2).join('\n');
}

let cumulative = 0;
const blocks = [];
edl.ranges.forEach((r, i) => {
  const start = cumulative;
  const duration = r.end - r.start;
  cumulative += duration;
  blocks.push({ index: i + 1, start, end: cumulative, text: r.quote });
});

const srt = blocks.map((b) => `${b.index}\n${srtTime(b.start)} --> ${srtTime(b.end)}\n${wrap(b.text)}\n`).join('\n');
fs.writeFileSync(path.join(outRoot, 'legendas-v2.srt'), srt, 'utf8');

console.log(`legendas-v2.srt: ${blocks.length} blocos, ${blocks[blocks.length - 1].end.toFixed(2)}s de conteúdo falado`);
console.log('Amostra de deriva contra os blocos originais correspondentes (índice pode não bater 1:1 — a EDL tem 34 cortes, o srt original tinha 30 blocos):');
console.log(`  bloco 1  novo início ${blocks[0].start.toFixed(3)}s`);
console.log(`  bloco ${blocks.length}  novo início ${blocks[blocks.length - 1].start.toFixed(3)}s`);
