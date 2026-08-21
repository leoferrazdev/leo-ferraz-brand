// Measures caption drift between two video files by cross-correlating audio,
// not by comparing total duration. Total-duration drift (v1 105.97s vs v2
// 105.50s, ~0.47s) tells nothing about WHERE the drift sits — it could be one
// cut or spread evenly, and only the former would actually desync captions
// visibly. Anchors are SRT/chapter cue timestamps; each is checked
// independently against v1 (the file the captions were authored against).
//
// Usage: node scripts/check-caption-sync.mjs <v1.mp4> <v2.mp4> <t1,t2,...>

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const [v1, v2, timesArg] = process.argv.slice(2);
if (!v1 || !v2 || !timesArg) {
  console.error('uso: node scripts/check-caption-sync.mjs <v1.mp4> <v2.mp4> <t1,t2,...>');
  process.exit(2);
}
const anchors = timesArg.split(',').map(Number);

const SR = 16000;
function dumpPCM(file, start, duration) {
  const out = path.join(os.tmpdir(), `sync-${Math.random().toString(36).slice(2)}.pcm`);
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', String(Math.max(0, start)), '-t', String(duration), '-i', file,
    '-ac', '1', '-ar', String(SR), '-f', 's16le', out]);
  const buf = fs.readFileSync(out);
  fs.unlinkSync(out);
  const samples = new Float32Array(buf.length / 2);
  for (let i = 0; i < samples.length; i++) samples[i] = buf.readInt16LE(i * 2) / 32768;
  return samples;
}

// Normalized cross-correlation, searching every lag in the window rather than
// picking a single best-guess offset — a false peak from a repeated syllable
// is the failure mode here, and only checking the score's shape catches it.
function bestLag(ref, search) {
  const maxLag = search.length - ref.length;
  let bestScore = -Infinity;
  let bestI = 0;
  const refNorm = Math.sqrt(ref.reduce((s, v) => s + v * v, 0)) || 1;
  for (let i = 0; i <= maxLag; i += 4) {
    let dot = 0;
    let searchNorm = 0;
    for (let j = 0; j < ref.length; j += 4) {
      dot += ref[j] * search[i + j];
      searchNorm += search[i + j] * search[i + j];
    }
    const score = dot / (refNorm * (Math.sqrt(searchNorm) || 1));
    if (score > bestScore) { bestScore = score; bestI = i; }
  }
  return { lagSamples: bestI, score: bestScore };
}

console.log(`\n${path.basename(v1)} (referência) vs ${path.basename(v2)}\n`);
for (const t of anchors) {
  const ref = dumpPCM(v1, t, 1.2);
  const search = dumpPCM(v2, Math.max(0, t - 2), 5.2);
  const { lagSamples, score } = bestLag(ref, search);
  const foundAt = Math.max(0, t - 2) + lagSamples / SR;
  const driftMs = (foundAt - t) * 1000;
  const tag = score < 0.5 ? '  <-- correlação fraca, verificar a olho' : '';
  console.log(`t=${t.toFixed(2)}s  ->  encontrado em t=${foundAt.toFixed(3)}s no v2  |  deriva ${driftMs >= 0 ? '+' : ''}${driftMs.toFixed(0)}ms  |  correlação ${score.toFixed(2)}${tag}`);
}
