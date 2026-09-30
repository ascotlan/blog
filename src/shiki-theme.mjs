// Code theme matching the Figma code block: dark green-black surface, mint keywords.
export default {
  name: 'scenehere',
  type: 'dark',
  colors: { 'editor.background': '#111b19', 'editor.foreground': '#e7f5f1' },
  tokenColors: [
    { settings: { foreground: '#e7f5f1' } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#7f918b', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.operator.new', 'keyword.control'], settings: { foreground: '#7dd3b0' } },
    { scope: ['string', 'string.quoted', 'markup.inline.raw'], settings: { foreground: '#f2d38a' } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: '#f4a88a' } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: '#9fd8f5' } },
    { scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'], settings: { foreground: '#c9b8f5' } },
    { scope: ['variable.parameter'], settings: { foreground: '#e7f5f1', fontStyle: 'italic' } },
    { scope: ['entity.name.tag', 'meta.tag'], settings: { foreground: '#7dd3b0' } },
    { scope: ['entity.other.attribute-name', 'support.type.property-name'], settings: { foreground: '#9fd8f5' } },
  ],
};
