// Generative abstract art for cover images. Deterministic: the same seed (the post slug)
// always produces the same artwork, and every post gets its own composition.

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function rng(seed: string) {
  let a = hashSeed(seed);
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Brand teal family plus two supporting hues so the art has depth without leaving the palette's mood.
const PALETTES = [
  ['#087f6d', '#55d6b8', '#83e7d2', '#1f4fd1', '#f2b880'],
  ['#056252', '#2fbf9f', '#a8f0dd', '#6b4bd8', '#ffd08a'],
  ['#0a6f7f', '#3fd0c9', '#b8f2e6', '#2a62e8', '#ff9f7a'],
];

const f = (n: number) => n.toFixed(1);

export interface ArtOptions { width: number; height: number; seed: string; textSide?: number }

/** Returns SVG markup (defs + shapes) to place behind the cover text. */
export function abstractArt({ width: W, height: H, seed, textSide = 0.55 }: ArtOptions): string {
  const r = rng(seed);
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)];
  const pal = pick(PALETTES);
  const between = (a: number, b: number) => a + r() * (b - a);
  const artX = W * (textSide - 0.07); // art lives mostly on the right, text on the left

  const parts: string[] = [];
  const defs: string[] = [
    `<linearGradient id="art-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1311"/><stop offset="1" stop-color="#132622"/></linearGradient>`,
    `<filter id="art-blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${f(H * 0.085)}"/></filter>`,
    `<filter id="art-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${f(H * 0.012)}"/></filter>`,
    `<linearGradient id="art-scrim" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0b1311" stop-opacity="0.96"/><stop offset="${textSide - 0.08}" stop-color="#0b1311" stop-opacity="0.78"/><stop offset="${textSide + 0.18}" stop-color="#0b1311" stop-opacity="0"/></linearGradient>`,
  ];
  parts.push(`<rect width="${W}" height="${H}" fill="url(#art-bg)"/>`);

  // 1. Colour fields: large blurred blobs.
  const blobs = 4 + Math.floor(r() * 3);
  for (let i = 0; i < blobs; i++) {
    const cx = between(artX, W * 1.05);
    const cy = between(-H * 0.1, H * 1.1);
    const rad = between(H * 0.28, H * 0.62);
    const col = pal[i % pal.length];
    parts.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rad)}" fill="${col}" fill-opacity="${between(0.6, 0.95).toFixed(2)}" filter="url(#art-blur)"/>`);
  }

  // 2. Flow lines: a bundle of near-parallel curves, like contour lines on a map.
  const bundles = 1 + Math.floor(r() * 2);
  for (let b = 0; b < bundles; b++) {
    const lines = 10 + Math.floor(r() * 10);
    const y0 = between(H * 0.1, H * 0.9);
    const amp = between(H * 0.15, H * 0.45);
    const tilt = between(-H * 0.4, H * 0.4);
    const gap = between(H * 0.012, H * 0.03);
    const col = pick(['#e9fff8', pal[2], pal[4]]);
    for (let i = 0; i < lines; i++) {
      const o = i * gap;
      const x0 = artX - W * 0.05, x3 = W * 1.05;
      const c1x = between(artX, W * 0.8), c2x = between(W * 0.6, W);
      const d = `M${f(x0)} ${f(y0 + o)} C${f(c1x)} ${f(y0 - amp + o)} ${f(c2x)} ${f(y0 + amp + tilt + o)} ${f(x3)} ${f(y0 + tilt * 0.5 + o)}`;
      const op = (0.18 + 0.5 * Math.sin((i / lines) * Math.PI)).toFixed(2);
      parts.push(`<path d="${d}" fill="none" stroke="${col}" stroke-opacity="${op}" stroke-width="${f(between(0.8, 1.6))}"/>`);
    }
  }

  // 3. Geometric accents: a ring and a solid disc with a soft edge.
  const ringX = between(W * 0.68, W * 0.9), ringY = between(H * 0.2, H * 0.8), ringR = between(H * 0.14, H * 0.3);
  parts.push(`<circle cx="${f(ringX)}" cy="${f(ringY)}" r="${f(ringR)}" fill="none" stroke="${pal[2]}" stroke-opacity="0.55" stroke-width="${f(H * 0.006)}"/>`);
  parts.push(`<circle cx="${f(ringX + ringR * between(-0.6, 0.6))}" cy="${f(ringY + ringR * between(-0.6, 0.6))}" r="${f(ringR * between(0.18, 0.35))}" fill="${pal[4]}" fill-opacity="0.9" filter="url(#art-soft)"/>`);

  // 4. Dot grid: a quiet nod to structure and measurement.
  const cols = 7 + Math.floor(r() * 5), rows = 4 + Math.floor(r() * 3);
  const step = H * 0.045, gx = between(W * 0.66, W * 0.9 - cols * step), gy = between(H * 0.08, H * 0.92 - rows * step);
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    parts.push(`<circle cx="${f(gx + i * step)}" cy="${f(gy + j * step)}" r="${f(H * 0.0045)}" fill="#e9fff8" fill-opacity="0.45"/>`);
  }

  // 5. Scrim so the text on the left always reads clearly.
  parts.push(`<rect width="${W}" height="${H}" fill="url(#art-scrim)"/>`);

  return `<defs>${defs.join('')}</defs>${parts.join('')}`;
}
