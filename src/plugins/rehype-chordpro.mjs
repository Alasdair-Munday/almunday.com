import ChordSheetJS from 'chordsheetjs';
import { fromHtml } from 'hast-util-from-html';
import { sanitize } from 'hast-util-sanitize';

const languages = new Set(['chopro', 'chordpro']);
// ChordSheetJS interpolates song text into HTML. Escape it before parsing,
// then restrict the resulting tree to the elements required by the formatter.
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const schema = {
  tagNames: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'br', 'strong', 'em', 'pre', 'code'],
  attributes: { '*': ['className'] },
};

export function renderChordPro(source) {
  const song = new ChordSheetJS.ChordProParser().parse(escapeHtml(source));
  const html = new ChordSheetJS.HtmlDivFormatter().format(song);
  const tree = sanitize(fromHtml(html, { fragment: true }), schema);
  // Song titles should not add a second page heading or enter the article TOC.
  function flattenHeadings(node) {
    if (node.type === 'element' && /^h[123]$/.test(node.tagName)) node.tagName = 'p';
    node.children?.forEach(flattenHeadings);
  }
  flattenHeadings(tree);
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['chordpro'], tabIndex: 0, role: 'region', ariaLabel: 'Chord sheet' },
    children: tree.children,
  };
}

/** Sätteri HAST plugin: render fenced ChordPro blocks during the Astro build. */
export function rehypeChordPro() {
  return {
    name: 'rehype-chordpro',
    element: {
      filter: ['pre'],
      visit(node, ctx) {
        const code = node.children?.find((child) => child.type === 'element' && child.tagName === 'code');
        if (!code) return;
        const classes = code.properties?.className ?? [];
        const lang = code.data?.lang ?? (Array.isArray(classes) ? classes : classes.split(/\s+/))
          .find((name) => name.startsWith('language-'))?.slice(9);
        if (!languages.has(lang)) return;
        try {
          ctx.replaceNode(node, renderChordPro(ctx.textContent(code).replace(/\n$/, '')));
        } catch (error) {
          throw new Error(`Unable to render ${lang} chord sheet: ${error.message}`, { cause: error });
        }
      },
    },
  };
}
