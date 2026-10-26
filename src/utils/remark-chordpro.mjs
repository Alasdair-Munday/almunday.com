import { visit } from 'unist-util-visit';
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

/** Render before syntax highlighting, using HAST data compatible with Markdown and MDX. */
export default function remarkChordPro() {
  return (tree, file) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!languages.has(node.lang) || !parent || typeof index !== 'number') return;
      try {
        const rendered = renderChordPro(node.value);
        parent.children[index] = {
          type: 'paragraph',
          children: [],
          data: {
            hName: rendered.tagName,
            hProperties: rendered.properties,
            hChildren: rendered.children,
          },
        };
      } catch (error) {
        file.fail(`Unable to render ${node.lang} chord sheet: ${error.message}`, node);
      }
    });
  };
}
