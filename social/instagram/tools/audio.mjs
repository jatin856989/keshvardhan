// Procedural audio for the Reels: an original music bed (tanpura-style drone, warm pad, plucked
// melody, bass, soft drums) plus sound effects locked to each card cut. Everything is synthesised
// here from scratch, so there is no sampled or licensed material. Deterministic: same spec, same audio.

export const SR = 44100;

// ---------- small utilities ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

function makeBus(seconds) {
  const n = Math.ceil(seconds * SR);
  return { L: new Float32Array(n), R: new Float32Array(n), n };
}

/** Add a mono signal into a stereo bus at time t (seconds) with gain and pan (-1..1). */
function addMono(bus, t, mono, gain = 1, pan = 0) {
  const start = Math.round(t * SR);
  const gl = gain * Math.cos(((pan + 1) * Math.PI) / 4);
  const gr = gain * Math.sin(((pan + 1) * Math.PI) / 4);
  for (let i = 0; i < mono.length; i++) {
    const j = start + i;
    if (j < 0 || j >= bus.n) continue;
    bus.L[j] += mono[i] * gl;
    bus.R[j] += mono[i] * gr;
  }
}

// ---------- instruments (each returns a mono Float32Array) ----------
function kick() {
  const n = Math.round(0.42 * SR), o = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const f = 46 + 110 * Math.exp(-t * 28);
    ph += (2 * Math.PI * f) / SR;
    o[i] = Math.sin(ph) * Math.exp(-t * 7.5) + (i < 90 ? (Math.random() - 0.5) * 0.15 * (1 - i / 90) : 0);
  }
  return o;
}

function clap(rand) {
  const n = Math.round(0.28 * SR), o = new Float32Array(n);
  let lp = 0, prev = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    // three quick bursts (hand clap flam) then a short tail
    const burst = t < 0.033 ? Math.exp(-((t % 0.011) * 160)) * 0.8 : 0;
    const env = burst + Math.exp(-t * 16);
    const x = rand() * 2 - 1;
    const hp = x - prev * 0.95; prev = x;      // remove low rumble
    lp += 0.55 * (hp - lp);                    // tame the top
    o[i] = lp * env * 0.6;
  }
  return o;
}

function hat(rand, open = false) {
  const len = open ? 0.22 : 0.05;
  const n = Math.round(len * SR), o = new Float32Array(n);
  let prev = 0;
  for (let i = 0; i < n; i++) {
    const x = rand() * 2 - 1;
    const hp = x - prev; prev = x; // first-difference high-pass
    o[i] = hp * Math.exp(-(i / SR) * (open ? 18 : 90)) * 0.5;
  }
  return o;
}

function bassNote(freq, dur) {
  const n = Math.round(dur * SR), o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.01) * Math.exp(-t * 2.8);
    o[i] = (Math.sin(2 * Math.PI * freq * t) + 0.28 * Math.sin(2 * Math.PI * freq * 2 * t)) * env;
  }
  return o;
}

/** Karplus-Strong plucked string: warm, slightly sitar-like. */
function pluck(freq, dur, rand, decay = 0.9965, damp = 0.5) {
  const N = Math.max(2, Math.round(SR / freq));
  const buf = new Float32Array(N);
  let lp = 0;
  for (let i = 0; i < N; i++) { lp += 0.5 * ((rand() * 2 - 1) - lp); buf[i] = lp * 1.8; }
  const n = Math.round(dur * SR), o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const k = i % N;
    const nx = (k + 1) % N;
    o[i] = buf[k];
    buf[k] = decay * ((1 - damp) * buf[k] + damp * buf[nx]);
  }
  // soft attack to avoid clicks
  const a = Math.round(0.002 * SR);
  for (let i = 0; i < a && i < n; i++) o[i] *= i / a;
  return o;
}

function padChord(freqs, dur) {
  const n = Math.round(dur * SR), o = new Float32Array(n);
  const att = 0.45, rel = 0.5;
  let l1 = 0, l2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;
    for (const f of freqs) {
      for (const d of [-1.003, 1, 1.004]) {
        const ph = f * d * t;
        // band-limited saw by additive harmonics
        s += Math.sin(2 * Math.PI * ph) + 0.5 * Math.sin(4 * Math.PI * ph) + 0.33 * Math.sin(6 * Math.PI * ph) + 0.2 * Math.sin(8 * Math.PI * ph);
      }
    }
    const env = Math.min(1, t / att) * Math.min(1, (dur - t) / rel);
    l1 += 0.06 * (s - l1); l2 += 0.12 * (l1 - l2); // two-pole low-pass, warm
    o[i] = l2 * env * 0.06;
  }
  return o;
}

function drone(freq, dur, rand) {
  // tanpura-ish: a long plucked string with a gentle buzz
  const p = pluck(freq, dur, rand, 0.99985, 0.35);
  const h = pluck(freq * 2, dur, rand, 0.9997, 0.4);
  for (let i = 0; i < p.length; i++) p[i] = p[i] * 0.8 + h[i] * 0.25;
  return p;
}

// ---------- sound effects ----------
function whoosh(rand, dur = 0.34, up = true) {
  const n = Math.round(dur * SR), o = new Float32Array(n);
  let z1 = 0, z2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const fc = up ? 350 + 5200 * t * t : 5200 - 4850 * t;
    const q = 1.1;
    const w = (2 * Math.PI * fc) / SR;
    const alpha = Math.sin(w) / (2 * q);
    const a0 = 1 + alpha;
    const b0 = alpha / a0, b2 = -alpha / a0, a1 = (-2 * Math.cos(w)) / a0, a2 = (1 - alpha) / a0;
    const x = rand() * 2 - 1;
    const y = b0 * x + z1;                     // transposed direct form II band-pass biquad
    z1 = -a1 * y + z2;
    z2 = b2 * x - a2 * y;
    const env = Math.pow(Math.sin(Math.PI * Math.pow(t, up ? 1.6 : 0.6)), 1.4);
    o[i] = y * env * 3.2;
  }
  return o;
}

function pop(freq = 760, dur = 0.09) {
  const n = Math.round(dur * SR), o = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (freq * (1 - 0.55 * t / dur))) / SR;
    o[i] = Math.sin(ph) * Math.exp(-t * 48);
  }
  return o;
}

function bell(freq, dur = 1.4) {
  const n = Math.round(dur * SR), o = new Float32Array(n);
  const partials = [[1, 1, 3.2], [2.76, 0.45, 4.5], [5.4, 0.22, 7], [8.93, 0.1, 10]];
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let s = 0;
    for (const [m, a, d] of partials) s += a * Math.sin(2 * Math.PI * freq * m * t) * Math.exp(-t * d);
    o[i] = s * Math.min(1, t / 0.003);
  }
  return o;
}

function thud() {
  const n = Math.round(0.6 * SR), o = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    o[i] = Math.sin(2 * Math.PI * (52 - 18 * t) * t) * Math.exp(-t * 6);
  }
  return o;
}

// ---------- reverb (Schroeder) ----------
function reverbChannel(x, delaysMs, fb = 0.78) {
  const out = new Float32Array(x.length);
  for (const d of delaysMs) {
    const D = Math.round((d / 1000) * SR);
    const line = new Float32Array(D);
    let idx = 0, lp = 0;
    for (let i = 0; i < x.length; i++) {
      const y = line[idx];
      lp += 0.35 * (y - lp); // damping
      line[idx] = x[i] + lp * fb;
      out[i] += y * 0.25;
      idx = (idx + 1) % D;
    }
  }
  // two all-pass stages
  for (const d of [5, 1.7]) {
    const D = Math.round((d / 1000) * SR);
    const line = new Float32Array(D);
    let idx = 0;
    for (let i = 0; i < out.length; i++) {
      const bufOut = line[idx];
      const v = out[i] + bufOut * 0.5;
      line[idx] = v;
      out[i] = bufOut - v * 0.5;
      idx = (idx + 1) % D;
    }
  }
  return out;
}

// ---------- the track ----------
const SCALES = {
  minorPent: [0, 3, 5, 7, 10],
  majorPent: [0, 2, 4, 7, 9],
};

/**
 * mood: { bpm, root (midi), scale, prog: [[rootOffset, "min"|"maj"], ...] (one chord per 2 bars), swing, seed, motif }
 * cards: the reel's card list (used for section changes and sound effects).
 */
export function renderAudio(spec, mood, part = "all") {
  const total = spec.cards.at(-1).e; // ends exactly with the video; the fade-out lands on the last frame
  const rand = rng(mood.seed);
  const music = makeBus(total + 1);
  const rev = makeBus(total + 1); // reverb send
  const sfx = makeBus(total + 1);

  const beat = 60 / mood.bpm;
  const bar = beat * 4;
  const step = beat / 4;
  const hookEnd = spec.cards[0].e;
  const outroStart = spec.cards.at(-1).s;
  const scale = SCALES[mood.scale];
  const kickAt = [];

  const chordFor = (barIdx) => mood.prog[Math.floor(barIdx / 2) % mood.prog.length];
  const chordFreqs = ([off, q]) => {
    const r = mood.root + off;
    const third = q === "min" ? 3 : 4;
    return [r, r + third, r + 7, r + 12].map((m) => midiToHz(m));
  };

  // 1) Tanpura drone, whole track
  for (let t = 0, k = 0; t < total; t += beat * 2, k++) {
    const f = midiToHz(mood.root - 12 + (k % 3 === 2 ? 7 : 0));
    addMono(music, t, drone(f, beat * 4.5, rand), 0.22, k % 2 ? 0.25 : -0.25);
  }

  // 2) Pad chords, two bars each
  for (let b = 0; b * bar < total; b += 2) {
    const ch = chordFor(b);
    addMono(music, b * bar, padChord(chordFreqs(ch), bar * 2 + 0.25), 1.0, 0);
  }

  // 3) Drums, bass and melody by section
  const bars = Math.ceil(total / bar);
  for (let b = 0; b < bars; b++) {
    const t0 = b * bar;
    const [off] = chordFor(b);
    const root = midiToHz(mood.root + off - 12);
    const inHook = t0 < hookEnd - 0.01;
    const inOutro = t0 >= outroStart - bar * 0.5;
    for (let s = 0; s < 16; s++) {
      const swing = s % 2 === 1 ? mood.swing * step : 0;
      const t = t0 + s * step + swing;
      if (t >= total) break;
      const groove = !inHook && !(t >= outroStart);
      // kick
      if ((s === 0 || (groove && (s === 10 || s === 7))) && !(t >= outroStart && s !== 0)) {
        addMono(music, t, kick(), s === 0 ? 0.72 : 0.5, 0);
        kickAt.push(t);
      }
      if (groove) {
        if (s === 4 || s === 12) addMono(music, t, clap(rand), 0.5, 0.05);
        if (s % 2 === 0) addMono(music, t, hat(rand, false), s % 4 === 0 ? 0.18 : 0.11, s % 4 === 0 ? -0.2 : 0.2);
        if (s === 14) addMono(music, t, hat(rand, true), 0.2, 0.25);
      } else if (inHook && s % 4 === 2) {
        addMono(music, t, hat(rand, false), 0.1, 0.2); // sparse intro
      }
      // bass
      if (groove && (s === 0 || s === 6 || s === 10)) addMono(music, t, bassNote(root, step * 5), 0.4, 0);
      // melody (plucked), 8th notes with rests from the motif
      const motif = mood.motif[(b * 8 + Math.floor(s / 2)) % mood.motif.length];
      if (s % 2 === 0 && !inHook && !inOutro && motif >= 0) {
        const deg = motif % scale.length;
        const oct = 12 * (1 + Math.floor(motif / scale.length));
        const m = mood.root + off + 12 + scale[deg] + oct - 12;
        const p = pluck(midiToHz(m), 1.3, rand, 0.9958, 0.5);
        const pan = ((motif * 7) % 5 - 2) * 0.18;
        addMono(music, t, p, 0.42, pan);
        addMono(rev, t, p, 0.55, -pan);
      }
    }
    // outro: slow plucked chord arpeggio under the final card
    if (inOutro) {
      const fr = chordFreqs(chordFor(b));
      fr.forEach((f, i) => {
        const t = Math.max(outroStart, t0) + i * 0.09;
        const p = pluck(f * 2, 2.4, rand, 0.9975, 0.45);
        addMono(music, t, p, 0.3, (i - 1.5) * 0.3);
        addMono(rev, t, p, 0.6, -(i - 1.5) * 0.3);
      });
    }
  }

  // 4) Sound effects locked to each cut
  spec.cards.forEach((c, i) => {
    const t = c.s;
    const first = i === 0;
    const last = i === spec.cards.length - 1;
    const cta = c.theme === "terracotta";
    if (first) {
      addMono(sfx, t, thud(), 0.7, 0);
      if (c.layout === "bignum") addMono(sfx, t + 0.02, bell(1318.5, 1.6), 0.2, 0.1);
    } else {
      addMono(sfx, Math.max(0, t - 0.06), whoosh(rand, 0.3, i % 2 === 0), 0.2, i % 2 ? -0.35 : 0.35);
      if (c.layout === "image") addMono(sfx, t + 0.16, pop(620 + (i % 3) * 90), 0.4, 0);
      if (c.layout === "bignum") {
        addMono(sfx, t + 0.04, thud(), 0.35, 0);
        addMono(sfx, t + 0.12, bell(1568, 1.6), 0.22, 0.15);
      }
      if (c.layout === "list") {
        c.rows.forEach((_, r) => addMono(sfx, t + 0.12 + r * 0.18, pop(880 + r * 110, 0.08), 0.42, (r - 1) * 0.2));
      }
      if (cta) {
        addMono(sfx, t + 0.15, bell(1046.5, 1.8), 0.3, 0);
        addMono(sfx, t + 0.15, bell(1568, 1.8), 0.16, 0.1);
      }
      if (last) {
        addMono(sfx, t + 0.1, bell(880, 2.6), 0.3, 0);
        addMono(sfx, t + 0.1, bell(1318.5, 2.6), 0.2, 0.1);
      }
    }
  });

  // 5) reverb send (stereo, slightly different delays per side)
  const wetL = reverbChannel(rev.L, [29.7, 37.1, 41.1, 43.7]);
  const wetR = reverbChannel(rev.R, [31.1, 35.3, 42.3, 45.1]);

  // 6) sidechain-style duck: music dips briefly after every kick so the beat breathes
  const duck = new Float32Array(music.n).fill(1);
  for (const kt of kickAt) {
    const s0 = Math.round(kt * SR);
    for (let i = 0; i < 0.2 * SR && s0 + i < music.n; i++) {
      duck[s0 + i] = Math.min(duck[s0 + i], 1 - 0.28 * Math.exp(-(i / SR) / 0.07));
    }
  }

  // 7) final mix with fades
  const n = Math.round(total * SR);
  const L = new Float32Array(n), R = new Float32Array(n);
  const fadeIn = Math.round(0.04 * SR), fadeOut = Math.round(1.1 * SR);
  // gentle high-frequency roll-off (two cascaded one-pole low-passes near 8 kHz) so hats and whooshes never sound hissy
  const lpA = 1 - Math.exp((-2 * Math.PI * 8000) / SR);
  let l1a = 0, l1b = 0, r1a = 0, r1b = 0;
  for (let i = 0; i < n; i++) {
    const g = Math.min(1, i / fadeIn) * Math.min(1, (n - i) / fadeOut);
    const mg = part === "sfx" ? 0 : 1, sg = part === "music" ? 0 : 1;
    L[i] = (music.L[i] * duck[i] * 0.9 * mg + wetL[i] * 0.5 * mg + sfx.L[i] * sg) * g;
    R[i] = (music.R[i] * duck[i] * 0.9 * mg + wetR[i] * 0.5 * mg + sfx.R[i] * sg) * g;
  }
  for (let i = 0; i < n; i++) {
    l1a += lpA * (L[i] - l1a); l1b += lpA * (l1a - l1b); L[i] = l1b;
    r1a += lpA * (R[i] - r1a); r1b += lpA * (r1a - r1b); R[i] = r1b;
  }
  // soft clip safety
  for (let i = 0; i < n; i++) { L[i] = Math.tanh(L[i] * 1.1); R[i] = Math.tanh(R[i] * 1.1); }
  return { L, R, seconds: total };
}

/** Encode a stereo float signal as a 16-bit PCM WAV buffer. */
export function wavBuffer({ L, R }) {
  const n = L.length, data = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    data.writeInt16LE(Math.round(clamp(L[i], -1, 1) * 32767), i * 4);
    data.writeInt16LE(Math.round(clamp(R[i], -1, 1) * 32767), i * 4 + 2);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVE", 8); h.write("fmt ", 12);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24);
  h.writeUInt32LE(SR * 4, 28); h.writeUInt16LE(4, 32); h.writeUInt16LE(16, 34); h.write("data", 36);
  h.writeUInt32LE(data.length, 40);
  return Buffer.concat([h, data]);
}
