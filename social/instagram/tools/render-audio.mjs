/**
 * Builds the soundtrack for each Reel (original synthesised music + sound effects locked to the card
 * cuts), normalises it to -14 LUFS (Instagram's target), and mixes it into the video.
 *
 * Needs the silent video first:  reels/<name>-silent.mp4  (produced by render-reels.mjs)
 * Writes:  audio/<name>.wav  and  reels/<name>.mp4  (video with sound)
 *
 * Usage (project root):
 *   node social/instagram/tools/render-audio.mjs            # all reels
 *   node social/instagram/tools/render-audio.mjs reel-2     # one reel
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { reels } from "./reels.mjs";
import { renderAudio, wavBuffer } from "./audio.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const reelsDir = path.resolve(here, "../reels");
const audioDir = path.resolve(here, "../audio");
mkdirSync(audioDir, { recursive: true });

// One mood per Reel so they do not sound alike. Keys: bpm, root (MIDI note), scale, prog (chord per 2 bars),
// swing (0 to 0.2), seed, motif (scale degrees, 0..9, -1 = rest).
const moods = {
  "reel-1": { // the thesis: warm, steady, A minor
    bpm: 96, root: 57, scale: "minorPent", swing: 0.12, seed: 11,
    prog: [[0, "min"], [-4, "maj"], [3, "maj"], [-2, "maj"]],
    motif: [4, -1, 2, 4, 5, -1, 4, 2, 0, -1, 2, 3, 4, -1, 2, -1],
  },
  "reel-2": { // the numbers: a little brisker, D minor
    bpm: 104, root: 50, scale: "minorPent", swing: 0.08, seed: 23,
    prog: [[0, "min"], [-4, "maj"], [3, "maj"], [-2, "maj"]],
    motif: [5, 4, -1, 2, 4, -1, 5, 7, 4, -1, 2, 0, 2, -1, 4, -1],
  },
  "reel-3": { // the how-to: calm, spa-like, G major
    bpm: 88, root: 55, scale: "majorPent", swing: 0.1, seed: 37,
    prog: [[0, "maj"], [-3, "min"], [5, "maj"], [7, "maj"]],
    motif: [2, -1, 4, -1, 5, -1, 4, 2, 0, -1, 2, -1, 4, 5, -1, 2],
  },
};

function ff(args, opts = {}) {
  return spawnSync("ffmpeg", ["-hide_banner", "-y", ...args], { encoding: "utf8", ...opts });
}

function normalise(raw, out) {
  // Two-pass loudnorm: measure, then apply with the measured values for an accurate result on short clips.
  const target = "I=-14:TP=-1.5:LRA=7";
  const m = ff(["-i", raw, "-af", `loudnorm=${target}:print_format=json`, "-f", "null", "-"]);
  const json = JSON.parse(m.stderr.slice(m.stderr.lastIndexOf("{"), m.stderr.lastIndexOf("}") + 1));
  const r = ff([
    "-i", raw, "-af",
    `loudnorm=${target}:measured_I=${json.input_i}:measured_TP=${json.input_tp}:measured_LRA=${json.input_lra}:measured_thresh=${json.input_thresh}:offset=${json.target_offset}:linear=true`,
    "-ar", "44100", "-c:a", "pcm_s16le", out,
  ]);
  if (r.status !== 0) throw new Error(r.stderr);
  return json;
}

const only = process.argv[2];
for (const spec of reels.filter((r) => !only || r.id === only)) {
  const mood = moods[spec.id];
  const silent = path.join(reelsDir, `${spec.out}-silent.mp4`);
  if (!existsSync(silent)) throw new Error(`Missing ${silent}. Run render-reels.mjs first.`);
  console.log(`Composing ${spec.id}: ${mood.bpm} bpm ...`);
  const audio = renderAudio(spec, mood);
  const raw = path.join(audioDir, `${spec.out}.raw.wav`);
  const wav = path.join(audioDir, `${spec.out}.wav`);
  writeFileSync(raw, wavBuffer(audio));
  const stats = normalise(raw, wav);
  rmSync(raw);
  const out = path.join(reelsDir, `${spec.out}.mp4`);
  const mux = ff(["-i", silent, "-i", wav, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out]);
  if (mux.status !== 0) throw new Error(mux.stderr);
  console.log(`  input loudness ${stats.input_i} LUFS, true peak ${stats.input_tp} dBTP -> normalised to -14 LUFS`);
  console.log(`  wrote reels/${spec.out}.mp4 (with sound) and audio/${spec.out}.wav`);
}
