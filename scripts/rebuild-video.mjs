// Rebuilds the delivery from the camera originals in a single encode.
//
// The published cut went camera -> base.mp4 -> final_raw.mp4 -> vertical, three
// lossy generations that took 16 Mbps down to 2.0. This rebuilds the same edit
// straight from the .MOV sources, so the exported file is the first and only
// lossy generation.
//
// It is possible only because edl.json records grade: "none" — there is no
// creative colour work living inside the intermediates that would be lost by
// skipping them. The cuts and the cutaways are the whole edit.
//
// grade: "none" is NOT the same claim as "no colour processing needed". The
// camera shoots HDR (HLG, bt2020nc/arib-std-b67) by default, and base.mp4 in
// the original pipeline did a mandatory HLG-to-SDR/bt709 tonemap before any
// cut — a format conversion, not a creative grade. The first version of this
// script skipped that step and carried raw HLG pixel data into an H.264 file
// tagged bt2020/HLG, a combination almost no real-world player expects (that
// pairing is normal for HEVC HDR delivery, not H.264), so it read as blown
// highlights on ordinary playback even though ffmpeg's own decode path showed
// nothing wrong. The bt709 SDR overlay graphics got carried through and
// mis-tagged the same way, which is why the AI-generated screen inserts
// looked off too. TONEMAP below is that missing step, applied to every camera
// source before any cut or composite, so the whole graph runs in one
// consistent SDR space.
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
  // Written to videos/v2/, not videos/edit/entrega or /vertical: those hold
  // the v1 working files and intermediates, and every corrected deliverable
  // this rebuild produces belongs together, outside that working mess, one
  // subfolder per platform.
  youtube: { crf: 17, maxrate: '16M', bufsize: '32M', out: 'youtube-horizontal/produtos-reais-com-ia-leo-ferraz-01-v2.mp4', vf: null },
  tiktok: { crf: 16, maxrate: '20M', bufsize: '40M', out: 'tiktok-vertical/completo-v2.mp4', vf: 'crop=ih*9/16:ih,scale=1080:1920:flags=lanczos' },
};
const preset = presets[platform];
if (!preset) { console.error('plataforma: youtube | tiktok'); process.exit(2); }

const isVertical = Boolean(preset.vf);

// The overlay cards are graphic cards laid out full-bleed across 1920px of
// text. Forcing them through the same centre-crop the camera footage needs
// chopped that text at both edges — the crop takes only the middle 607px of
// the 1920 the card was designed for. Every card and broll clip used in the
// edit already has a hand-authored 1080x1920 sibling (v_<slot>, vb_<clip>)
// laid out for the vertical frame, so the vertical build points at those
// instead of reflowing the horizontal ones through a crop that cannot know
// where the text is safe to lose.
function verticalOverlayFile(rel) {
  let m = rel.match(/^animations\/slot_(.+)\/render\.mp4$/);
  if (m) return `animations/v_${m[1]}/render.mp4`;
  m = rel.match(/^broll\/out\/b_(.+)\.mp4$/);
  if (m) return `broll/out/vb_${m[1]}.mp4`;
  throw new Error(`sem par vertical conhecido para ${rel} — gere o asset 1080x1920 e mapeie-o aqui antes de rodar tiktok`);
}

const sourceIds = Object.keys(edl.sources);
const inputs = sourceIds.map((id) => edl.sources[id]);
const overlays = edl.overlays ?? [];
const overlayBase = inputs.length;
const overlayFiles = overlays.map((o) => (isVertical ? verticalOverlayFile(o.file) : o.file));
for (const f of overlayFiles) inputs.push(path.join(editRoot, f));

for (const f of inputs) {
  if (!fs.existsSync(f)) { console.error(`fonte ausente: ${f}`); process.exit(2); }
}

// zscale needs full-range linear light to tone-map correctly, then returns to
// tv-range bt709 8-bit for everything downstream. npl=100 is HLG's nominal
// peak luminance in nits, the reference value the BBC/NHK HLG spec defines.
// Applied only to camera sources — the overlay renders are already bt709 SDR,
// and running them through an HDR tonemap they do not need would distort them.
const TONEMAP = 'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p10le,';
const cameraIndices = new Set(sourceIds.map((_, i) => i));

// One trim per range, then a single concat. Trimming with the decoder rather
// than with -ss per segment keeps every cut frame-accurate against the same
// timebase, which is what makes the result line up with the published edit.
const parts = [];
const concatLabels = [];
edl.ranges.forEach((r, i) => {
  const idx = sourceIds.indexOf(r.source);
  const tonemap = cameraIndices.has(idx) ? TONEMAP : '';
  parts.push(`[${idx}:v]trim=${r.start}:${r.end},setpts=PTS-STARTPTS,${tonemap}fps=30,scale=1920:1080:flags=lanczos,setsar=1[v${i}]`);
  parts.push(`[${idx}:a]atrim=${r.start}:${r.end},asetpts=PTS-STARTPTS[a${i}]`);
  concatLabels.push(`[v${i}][a${i}]`);
});
parts.push(`${concatLabels.join('')}concat=n=${edl.ranges.length}:v=1:a=1[bv][outa]`);

// The vertical crop runs on the camera track before any overlay is composited
// — Leo's face is centred in the 1920-wide frame, so a centre-crop is correct
// for him. It must happen here, not at the end: applying it after the overlay
// cards are composited is exactly what cropped their text, since it would
// treat cards and camera the same way.
let current = 'bv';
if (isVertical) {
  parts.push(`[bv]${preset.vf}[bvv]`);
  current = 'bvv';
}

// Cutaways replace the frame for their window; they carry no audio, so the
// narration underneath is untouched. Vertical overlays are already 1080x1920
// — no scale needed, just the timing offset.
overlays.forEach((o, i) => {
  const end = o.start_in_output + o.duration;
  const next = `ov${i}`;
  const overlayScale = isVertical ? '' : 'scale=1920:1080:flags=lanczos,';
  parts.push(`[${overlayBase + i}:v]setpts=PTS-STARTPTS+${o.start_in_output}/TB,fps=30,${overlayScale}setsar=1[o${i}]`);
  parts.push(`[${current}][o${i}]overlay=0:0:enable='between(t,${o.start_in_output},${end})'[${next}]`);
  current = next;
});

parts.push(`[${current}]null[outv]`);

const outPath = path.join(root, 'videos', 'v2', preset.out);
fs.mkdirSync(path.dirname(outPath), { recursive: true });

const args = ['-hide_banner', '-y'];
for (const f of inputs) args.push('-i', f);
args.push(
  '-filter_complex', parts.join(';'),
  '-map', '[outv]', '-map', '[outa]',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', String(preset.crf),
  '-maxrate', preset.maxrate, '-bufsize', preset.bufsize,
  '-pix_fmt', 'yuv420p', '-profile:v', 'high',
  // Tagged explicitly rather than left to inherit: this is the exact mismatch
  // that caused the blown-highlights defect, so the output space is asserted
  // here instead of trusted to propagate correctly through the filter graph.
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv',
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
