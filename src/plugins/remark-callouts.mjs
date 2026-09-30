// Turns GitHub-style alerts into the design's callout boxes:
//   > [!NOTE]
//   > Notes explain context without interrupting the reading flow.
// Supported: NOTE, TIP (rendered as note), WARNING, CAUTION (rendered as warning).
const ICONS = {
  note: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  warning: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
};
const KINDS = { NOTE: 'note', TIP: 'note', IMPORTANT: 'note', WARNING: 'warning', CAUTION: 'warning' };

function walk(node, fn) {
  if (!node.children) return;
  for (let i = 0; i < node.children.length; i++) {
    const replaced = fn(node.children[i]);
    if (replaced) node.children.splice(i, 1, ...replaced), (i += replaced.length - 1);
    else walk(node.children[i], fn);
  }
}

export default function remarkCallouts() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== 'blockquote') return null;
      const first = node.children?.[0];
      const text = first?.type === 'paragraph' && first.children?.[0]?.type === 'text' ? first.children[0] : null;
      const m = text?.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/);
      if (!m) return null;
      const kind = KINDS[m[1]];
      text.value = text.value.slice(m[0].length);
      if (!text.value) first.children.shift();
      if (first.children.length === 0) node.children.shift();
      const label = m[1] === 'CAUTION' ? 'Warning' : m[1].charAt(0) + m[1].slice(1).toLowerCase();
      return [
        { type: 'html', value: `<aside class="callout callout--${kind}">${ICONS[kind]}<div class="callout-body"><p class="callout-label">${label}</p>` },
        ...node.children,
        { type: 'html', value: '</div></aside>' },
      ];
    });
  };
}
