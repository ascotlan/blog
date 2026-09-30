import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkCallouts from './src/plugins/remark-callouts.mjs';
import scenehereTheme from './src/shiki-theme.mjs';

export default defineConfig({
  site: 'https://blog.scenehere.ca',
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkCallouts],
    shikiConfig: {
      theme: scenehereTheme,
      transformers: [
        {
          // ```python title="eval_case.py"  ->  shows "eval_case.py" in the code block toolbar
          pre(node) {
            const title = this.options.meta?.__raw?.match(/title="([^"]+)"/)?.[1];
            if (title) node.properties['data-title'] = title;
          },
        },
      ],
    },
  },
});
