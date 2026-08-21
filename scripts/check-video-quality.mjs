// Quality gate for video delivery.
//
// Turns the TikTok quality guidance (videos/tiktok-qualidade.txt) into checks
// that either pass or fail, because "o objeto está nítido, o brilho está
// adequado, a resolução é 1080p ou superior" cannot be verified by looking at
// a file — and the failure that got the first video flagged was invisible to
// the eye at preview size.
//
// Usage: node scripts/check-video-quality.mjs <arquivo> [youtube|tiktok]

import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const file = process.argv[2];
const platform = (process.argv[3] ?? 'youtube').toLowerCase();
if (!file || !fs.existsSync(file)) {
  console.error('uso: node scripts/check-video-quality.mjs <arquivo> [youtube|tiktok]');
  process.exit(2);
}

// YouTube publishes 8 Mbps for 1080p30 SDR. TikTok publishes no figure, so its
// target is ours: the platform re-encodes on ingest, and whatever is lost
// before that upload is never recovered. Entering high is the only lever left.
const targets = {
  youtube: { minVideoBitrate: 8_000_000, minShortSide: 1080, label: 'YouTube 1080p30' },
  tiktok: { minVideoBitrate: 10_000_000, minShortSide: 1080, label: 'TikTok 1080x1920' },
};
const target = targets[platform] ?? targets.youtube;

const ffprobe = (args) => execFileSync('ffprobe', args, { encoding: 'utf8' }).trim();
const ffmpeg = (args) => execFileSync('ffmpeg', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

// Parsed by key, never by position: ffprobe emits fields in stream order, not
// in the order they were requested, so positional destructuring silently pairs
// the wrong value with the wrong name — pix_fmt read as the frame rate here.
const probe = (stream, fields) => {
  const out = ffprobe(['-v', 'error', '-select_streams', stream, '-show_entries', `stream=${fields}`, '-of', 'default=noprint_wrappers=1', file]);
  return Object.fromEntries(out.split('\n').filter(Boolean).map((line) => {
    const at = line.indexOf('=');
    // Trimmed: ffprobe ends lines with CRLF on Windows. The trailing
    // carriage return makes every string comparison fail while the numeric
    // ones still parse, so it breaks some checks and spares others.
    return [line.slice(0, at).trim(), line.slice(at + 1).trim()];
  }));
};

const v = probe('v:0', 'codec_name,width,height,r_frame_rate,bit_rate,pix_fmt');
const a = probe('a:0', 'codec_name,bit_rate,sample_rate,channels');
const { codec_name: codec, width, height, r_frame_rate: fps, bit_rate: vBitrate, pix_fmt: pixFmt } = v;
const duration = Number(ffprobe(['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file]));

const w = Number(width);
const h = Number(height);
const shortSide = Math.min(w, h);
// Some containers omit the per-stream bitrate; fall back to the format's minus
// the audio, so a missing tag does not read as a failing video.
let videoBitrate = Number(vBitrate) || 0;
if (!videoBitrate) {
  const formatBitrate = Number(ffprobe(['-v', 'error', '-show_entries', 'format=bit_rate', '-of', 'default=noprint_wrappers=1:nokey=1', file])) || 0;
  videoBitrate = Math.max(0, formatBitrate - (Number(a.bit_rate) || 0));
}

// Effective resolution, not declared resolution. A frame cropped from 16:9 and
// stretched to fill 9:16 reports 1080x1920 while carrying roughly 608px of real
// detail. Shrinking it and blowing it back up costs nothing it had not already
// lost, so a high PSNR here means the pixels were never real.
const PROBE_FACTOR = 0.6;
const UPSCALE_PSNR = 45;
function effectiveResolution() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'vq-'));
  const samples = [0.25, 0.5, 0.75].map((f) => Math.max(1, duration * f));
  const scores = [];
  try {
    for (const [i, t] of samples.entries()) {
      const original = path.join(tmp, `f${i}.png`);
      const roundTrip = path.join(tmp, `r${i}.png`);
      ffmpeg(['-v', 'error', '-y', '-ss', String(t), '-i', file, '-frames:v', '1', original]);
      if (!fs.existsSync(original)) continue;
      const rw = Math.round(w * PROBE_FACTOR);
      const rh = Math.round(h * PROBE_FACTOR);
      ffmpeg(['-v', 'error', '-y', '-i', original, '-vf', `scale=${rw}:${rh}:flags=lanczos,scale=${w}:${h}:flags=lanczos`, roundTrip]);
      // ffmpeg reports psnr on stderr, not stdout. Reading only stdout returned
      // an empty string, no match, and an empty score list — which the report
      // then blamed on frame sampling that had in fact worked.
      const psnr = spawnSync('ffmpeg', ['-hide_banner', '-i', original, '-i', roundTrip, '-lavfi', 'psnr', '-f', 'null', '-'], { encoding: 'utf8' });
      const match = /average:([0-9.]+)/.exec(`${psnr.stdout ?? ''}${psnr.stderr ?? ''}`);
      if (match) scores.push(Number(match[1]));
    }
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  return scores;
}

const results = [];
// Two levels. Bitrate is a warning, not a failure: these exports use constant
// quality (CRF), where a simple scene legitimately produces fewer bits at the
// same visual quality — the rebuilt file sits at 4.9 Mbps and measures sharper
// than the published one. A gate that fails a good file gets ignored, and then
// it protects nothing.
const check = (name, ok, detail, level = 'falha') => results.push({ name, ok, detail, level });

check('resolução declarada', shortSide >= target.minShortSide, `${w}x${h} (menor lado ${shortSide}, mínimo ${target.minShortSide})`);
check('bitrate de vídeo', videoBitrate >= target.minVideoBitrate,
  `${(videoBitrate / 1e6).toFixed(2)} Mbps (alvo ${(target.minVideoBitrate / 1e6).toFixed(0)} Mbps para ${target.label})`, 'aviso');
check('codec e pixel format', codec === 'h264' && pixFmt === 'yuv420p', `${codec} / ${pixFmt}`);
check('áudio', a.codec_name === 'aac' && Number(a.bit_rate) >= 128_000,
  `${a.codec_name} ${(Number(a.bit_rate) / 1000).toFixed(0)} kbps ${a.sample_rate} Hz ${a.channels}ch`);

const psnrScores = effectiveResolution();
if (psnrScores.length) {
  const worst = Math.max(...psnrScores);
  const upscaled = worst > UPSCALE_PSNR;
  check('resolução efetiva', !upscaled,
    upscaled
      ? `PSNR ${worst.toFixed(1)} dB ao reduzir para ${Math.round(PROBE_FACTOR * 100)}% — sem detalhe real acima de ~${Math.round(w * PROBE_FACTOR)}px de largura: a imagem está esticada`
      : `PSNR ${worst.toFixed(1)} dB — há detalhe real na resolução declarada`);
} else {
  check('resolução efetiva', false, 'não foi possível amostrar frames');
}

console.log(`\n${path.basename(file)}  ·  ${target.label}  ·  ${duration.toFixed(1)}s  ·  ${fps} fps\n`);
for (const r of results) {
  const tag = r.ok ? 'PASSA' : r.level === 'aviso' ? 'AVISO' : 'FALHA';
  console.log(`  ${tag.padEnd(6)} ${r.name.padEnd(22)} ${r.detail}`);
}
const failed = results.filter((r) => !r.ok && r.level === 'falha');
const warned = results.filter((r) => !r.ok && r.level === 'aviso');
const parts = [];
if (failed.length) parts.push(`${failed.length} falha(s)`);
if (warned.length) parts.push(`${warned.length} aviso(s)`);
console.log(`\n${parts.length ? `${parts.join(' e ')}.` : 'Todas as verificações passaram.'}\n`);
process.exit(failed.length ? 1 : 0);
