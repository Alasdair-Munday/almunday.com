import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';

const base = join(process.cwd(), 'src/content/blog');
const normalize = value => decodeURIComponent(value).normalize('NFC').toLowerCase().replace(/\\/g, '/').replace(/\.mdx?$/i, '').replace(/\/index$/i, '').replace(/^\.\//, '').replace(/^blog\//, '').replace(/\/$/, '');
export function publishedNotes() {
  const files = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (/\.md$/.test(entry.name)) files.push(path);
    }
  }
  walk(base);
  return files.flatMap(path => {
    const source = readFileSync(path, 'utf8');
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!match) return [];
    const data = parse(match[1]);
    if (data.draft) return [];
    const file = relative(base, path).replaceAll('\\', '/');
    const id = file.replace(/\.md$/, '').replace(/\/index$/, '');
    return [{ id, file, title: data.title, aliases: data.aliases ?? [], tags: data.tags ?? [], body: source.slice(match[0].length), href: `/blog/${id}` }];
  });
}
export function resolveNote(target, notes) {
  let key;
  try { key = normalize(target); } catch { return undefined; }
  const matches = notes.filter(note => [note.id, note.file, note.title, basename(note.id), ...note.aliases].some(value => normalize(String(value)) === key));
  return matches.length === 1 ? matches[0] : undefined;
}
export function wikiLinks(notes = publishedNotes(), current) {
  function sourceNote(ctx) {
    if (current) return current;
    if (!ctx.fileURL) return undefined;
    const file = relative(base, fileURLToPath(ctx.fileURL)).replaceAll('\\', '/');
    return notes.find(note => note.file === file);
  }
  return {
    name: 'garden-wikilinks',
    link(node, ctx) {
      if (!/\.md(?:#|$)/i.test(node.url) || /^(?:[a-z]+:|\/\/)/i.test(node.url)) return;
      const [path, hash] = node.url.split('#');
      const source = sourceNote(ctx);
      let decoded;
      try { decoded = decodeURIComponent(path); } catch { return; }
      const relativePath = source ? join(dirname(source.file), decoded).replaceAll('\\', '/') : decoded;
      const note = resolveNote(relativePath, notes) ?? resolveNote(decoded, notes);
      if (note) ctx.setProperty(node, 'url', note.href + (hash ? '#' + hash : ''));
    },
    text(node, ctx) {
      if (ctx.parent(node)?.type === 'link') return;
      const pattern = /(?<!!)\[\[([^\]\n]+)\]\]/g;
      const children = [];
      let last = 0;
      for (const match of node.value.matchAll(pattern)) {
        const [destination, label] = match[1].split('|');
        const [target, heading] = destination.split('#');
        const note = resolveNote(target, notes);
        if (!note) continue;
        children.push({ type: 'text', value: node.value.slice(last, match.index) });
        const hash = heading ? '#' + heading.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-') : '';
        children.push({ type: 'link', url: note.href + hash, children: [{ type: 'text', value: label || note.title }] });
        last = match.index + match[0].length;
      }
      if (children.length) {
        children.push({ type: 'text', value: node.value.slice(last) });
        ctx.replaceNode(node, children);
      }
    }
  };
}
export async function gardenData(notes = publishedNotes()) {
  const edges = [];
  for (const note of notes) {
    const targets = new Set();
    const processor = await createSatteriMarkdownProcessor({ syntaxHighlight: false, mdastPlugins: [wikiLinks(notes, note)], hastPlugins: [{
      name: 'garden-links',
      element: { filter: ['a'], visit(node) {
        const href = node.properties?.href;
        if (typeof href !== 'string') return;
        let url;
        try { url = new URL(href, `https://almunday.com${note.href}/`); } catch { return; }
        if (!['almunday.com', 'www.almunday.com'].includes(url.hostname)) return;
        const target = notes.find(item => item.href === decodeURI(url.pathname).replace(/\/$/, ''));
        if (target && target.id !== note.id) targets.add(target.id);
      } }
    }] });
    await processor.render(note.body);
    for (const target of targets) edges.push({ source: note.id, target, kind: 'link' });
  }
  return { notes, edges };
}
