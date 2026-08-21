// Rebuilds the delivery from the camera originals in a single encode.
//
// The published cut went camera -> base.mp4 -> final_raw.mp4 -> vertical, three
// lossy generations that took 16 Mbps down to 2.0. This rebuilds the same edit
// straight from the .MOV sources, so the exported file is the first and only
// lossy generation.
//
// It is possible only because edl.json records grade: "none" — there is no
// colour work living inside the intermediates that would be lost by skipping
// them. The cuts and the cutaways are the whole edit.
//
// Usage: node scripts/rebuild-video.mjs [youtube|tiktok]

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const editRoot = path.join(root, 'videos', 'edit');
const edl = JSON.parse(fs.readFileSync(path.join(editRoot, 'edl.json'), 'utf8'));
const platform = (process.argv[2] ?? 'youtube').toLowerCase();

// CRF and ceiling per platform. TikTok gets the lower CRF because it re-encodes
// on ingest, and detail lost before the upload never comes back.
const presets = {
  youtube: { crf: 17, maxrate: '16M', bufsize: '32M', out: 'entrega/produtos-reais-com-ia-leo-ferraz-01-v2.mp4', vf: null },
  tiktok: { crf: 16, maxrate: '20M', bufsize: '40M', out: 'vertical/completo-v2.mp4', vf: 'crop=ih*9/16:ih,scale=1080:1920:flags=lanczos' },
};
const preset = presets[platform];
if (!preset) { console.error('plataforma: youtube | tiktok'); process.exit(2); }

const sourceIds = Object.keys(edl.sources);
const inputs = sourceIds.map((id) => edl.sources[id]);
const overlays = edl.overlays ?? [];
const overlayBase = inputs.length;
for (const o of overlays) inputs.push(path.join(editRoot, o.file));

for (const f of inputs) {
  if (!fs.existsSync(f)) { console.error(`fonte ausente: ${f}`); process.exit(2); }
}

// One trim per range, then a single concat. Trimming with the decoder rather
// than with -ss per segment keeps every cut frame-accurate against the same
// timebase, which is what makes the result line up with the published edit.
const parts = [];
const concatLabels = [];
edl.ranges.forEach((r, i) => {
  const idx = sourceIds.indexOf(r.source);
  parts.push(`[${idx}:v]trim=${r.start}:${r.end},setpts=PTS-STARTPTS,fps=30,scale=1920:1080:flags=lanczos,setsar=1[v${i}]`);
  parts.push(`[${idx}:a]atrim=${r.start}:${r.end},asetpts=PTS-STARTPTS[a${i}]`);
  concatLabels.push(`[v${i}][a${i}]`);
});
parts.push(`${concatLabels.join('')}concat=n=${edl.ranges.length}:v=1:a=1[bv][outa]`);

// Cutaways replace the frame for their window; they carry no audio, so the
// narration underneath is untouched.
let current = 'bv';
overlays.forEach((o, i) => {
  const end = o.start_in_output + o.duration;
  const next = `ov${i}`;
  parts.push(`[${overlayBase + i}:v]setpts=PTS-STARTPTS+${o.start_in_output}/TB,fps=30,scale=1920:1080:flags=lanczos,setsar=1[o${i}]`);
  parts.push(`[${current}][o${i}]overlay=0:0:enable='between(t,${o.start_in_output},${end})'[${next}]`);
  current = next;
});

if (preset.vf) {
  parts.push(`[${current}]${preset.vf}[outv]`);
} else {
  parts.push(`[${current}]null[outv]`);
}

const outPath = path.join(editRoot, preset.out);
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const args = ['-hide_banner', '-y'];
for (const f of inputs) args.push('-i', f);
args.push(
  '-filter_complex', parts.join(';'),
  '-map', '[outv]', '-map', '[outa]',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', String(preset.crf),
  '-maxrate', preset.maxrate, '-bufsize', preset.bufsize,
  '-pix_fmt', 'yuv420p', '-profile:v', 'high',
  '-c:a', 'aac', '-b:a', '320k', '-ar', '48000',
  '-movflags', '+faststart',
  outPath,
);

console.log(`reconstruindo ${platform} a partir de ${sourceIds.length} fontes, ${edl.ranges.length} cortes e ${overlays.length} inserções`);
console.log(`saída: ${path.relative(root, outPath)}\n`);

const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'inherit', 'inherit'] });
proc.on('exit', (code) => {
  if (code === 0) console.log(`\nconcluído: ${path.relative(root, outPath)}`);
  process.exit(code ?? 1);
});
