// Social preview images (1200x630) rendered at build time with satori + resvg.
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const font = (pkg: string, file: string) => fs.readFileSync(path.resolve('node_modules', pkg, 'files', file));
const FONTS = [
  { name: 'Inter', data: font('@fontsource/inter', 'inter-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: font('@fontsource/inter', 'inter-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
  { name: 'Plex', data: font('@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Plex', data: font('@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
];

const C = { canvas: '#f7f8f6', text: '#17201e', muted: '#5e6a67', border: '#cfd8d4', accent: '#087f6d', strong: '#056252', soft: '#eef2ef' };

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string | null | false)[]): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children: children.filter(Boolean) },
});

export interface OgInput {
  eyebrow: string;
  title: string;
  footerLeft: string;
  tags?: string[];
}

// Two shapes: 'og' (1200x630) for LinkedIn and link previews, 'devto' (1000x420) for dev.to covers,
// which dev.to displays at 1000x420 and would otherwise crop.
export type OgFormat = 'og' | 'devto';

const LAYOUT = {
  og: { w: 1200, h: 630, bar: 12, pad: '56px 72px 52px 64px', mono: 56, monoFont: 21, name: 26, tagline: 15, url: 18, eyebrow: 20, gap: 22, titles: [66, 58, 50], titleMax: 1000, footer: 18, tag: 16, footerPad: 22 },
  devto: { w: 1000, h: 420, bar: 10, pad: '32px 56px 28px 48px', mono: 44, monoFont: 17, name: 21, tagline: 12, url: 15, eyebrow: 15, gap: 12, titles: [50, 44, 38], titleMax: 860, footer: 14, tag: 13, footerPad: 16 },
} as const;

export async function renderOg({ eyebrow, title, footerLeft, tags = [] }: OgInput, format: OgFormat = 'og'): Promise<Uint8Array> {
  const L = LAYOUT[format];
  const size = title.length > 90 ? L.titles[2] : title.length > 60 ? L.titles[1] : L.titles[0];
  const tree = h('div', { width: L.w, height: L.h, background: C.canvas, fontFamily: 'Inter', color: C.text },
    h('div', { width: L.bar, height: '100%', background: C.accent }),
    h('div', { flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: L.pad },
      // header
      h('div', { alignItems: 'center', justifyContent: 'space-between' },
        h('div', { alignItems: 'center', gap: Math.round(L.mono * 0.29) },
          h('div', { width: L.mono, height: L.mono, borderRadius: 6, background: C.accent, color: '#fff', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plex', fontWeight: 600, fontSize: L.monoFont }, 'AS'),
          h('div', { flexDirection: 'column', gap: 2 },
            h('div', { fontSize: L.name, fontWeight: 700 }, 'Antonio Scotland'),
            h('div', { fontFamily: 'Plex', fontSize: L.tagline, color: C.muted }, 'AI SYSTEMS · WATERLOO, ON'),
          ),
        ),
        h('div', { fontFamily: 'Plex', fontSize: L.url, fontWeight: 600, color: C.strong }, 'blog.scenehere.ca'),
      ),
      // title
      h('div', { flexDirection: 'column', gap: L.gap },
        h('div', { fontFamily: 'Plex', fontWeight: 600, fontSize: L.eyebrow, color: C.strong, letterSpacing: 1 }, eyebrow),
        h('div', { fontSize: size, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: L.titleMax }, title),
      ),
      // footer
      h('div', { alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: L.footerPad },
        h('div', { fontFamily: 'Plex', fontSize: L.footer, color: C.muted }, footerLeft),
        h('div', { gap: 10 },
          ...tags.slice(0, 3).map((t) =>
            h('div', { fontFamily: 'Plex', fontSize: L.tag, padding: '5px 12px', borderRadius: 999, border: `1px solid ${C.border}`, background: C.soft }, t),
          ),
        ),
      ),
    ),
  );
  const svg = await satori(tree as any, { width: L.w, height: L.h, fonts: FONTS });
  return new Resvg(svg, { fitTo: { mode: 'width', value: L.w } }).render().asPng();
}
