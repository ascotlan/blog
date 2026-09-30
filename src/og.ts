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

export async function renderOg({ eyebrow, title, footerLeft, tags = [] }: OgInput): Promise<Uint8Array> {
  const size = title.length > 90 ? 50 : title.length > 60 ? 58 : 66;
  const tree = h('div', { width: 1200, height: 630, background: C.canvas, fontFamily: 'Inter', color: C.text },
    h('div', { width: 12, height: '100%', background: C.accent }),
    h('div', { flex: 1, flexDirection: 'column', justifyContent: 'space-between', padding: '56px 72px 52px 64px' },
      // header
      h('div', { alignItems: 'center', justifyContent: 'space-between' },
        h('div', { alignItems: 'center', gap: 16 },
          h('div', { width: 56, height: 56, borderRadius: 6, background: C.accent, color: '#fff', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plex', fontWeight: 600, fontSize: 21 }, 'AS'),
          h('div', { flexDirection: 'column', gap: 2 },
            h('div', { fontSize: 26, fontWeight: 700 }, 'Antonio Scotland'),
            h('div', { fontFamily: 'Plex', fontSize: 15, color: C.muted }, 'AI SYSTEMS · WATERLOO, ON'),
          ),
        ),
        h('div', { fontFamily: 'Plex', fontSize: 18, fontWeight: 600, color: C.strong }, 'blog.scenehere.ca'),
      ),
      // title
      h('div', { flexDirection: 'column', gap: 22 },
        h('div', { fontFamily: 'Plex', fontWeight: 600, fontSize: 20, color: C.strong, letterSpacing: 1 }, eyebrow),
        h('div', { fontSize: size, lineHeight: 1.08, letterSpacing: -1.5, maxWidth: 1000 }, title),
      ),
      // footer
      h('div', { alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.border}`, paddingTop: 22 },
        h('div', { fontFamily: 'Plex', fontSize: 18, color: C.muted }, footerLeft),
        h('div', { gap: 10 },
          ...tags.slice(0, 3).map((t) =>
            h('div', { fontFamily: 'Plex', fontSize: 16, padding: '6px 14px', borderRadius: 999, border: `1px solid ${C.border}`, background: C.soft }, t),
          ),
        ),
      ),
    ),
  );
  const svg = await satori(tree as any, { width: 1200, height: 630, fonts: FONTS });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
