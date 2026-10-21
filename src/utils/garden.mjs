import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const normalise = (s) => decodeURIComponent(s).replace(/\\/g, '/').replace(/^\/+|\/+$/g, '').replace(/\.(md|mdx)$/i, '').replace(/\/index$/i, '').toLowerCase();
export function gardenEntries() {
  const entries = [];
  for (const collection of ['blog', 'projects']) {
    const root = path.resolve('src/content', collection);
    function walk(dir) {
      for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
        if (file.name.startsWith('_') || file.name.startsWith('.')) continue;
        const full = path.join(dir, file.name);
        if (file.isDirectory()) { walk(full); continue; }
        if (!/\.mdx?$/.test(file.name)) continue;
        const source = fs.readFileSync(full, 'utf8');
        const front = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        const data = front ? parse(front[1]) : {};
        if (!data?.title || data.draft === true) continue;
        const relative = path.relative(root, full).replace(/\\/g, '/');
        const slug = relative.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');
        entries.push({ title: data.title, href: `/${collection}/${slug}`, source: `${collection}/${relative}`, slug, body: source.slice(front?.[0].length ?? 0), tags: data.tags ?? [] });
      }
    }
    walk(root);
  }
  return entries;
}
export function resolveNote(target, entries, from) {
  const [raw, fragment] = target.split('#');
  if (!raw) return fragment ? `#${fragment}` : undefined;
  let key;
  try { key = normalise(raw); } catch { return undefined; }
  const relative = from ? normalise(path.posix.join(path.posix.dirname(from.source), raw)) : '';
  const candidates = entries.filter(e => [normalise(e.href), normalise(e.source), normalise(e.slug), normalise(e.title)].includes(key) || normalise(e.source) === relative);
  const matches = candidates.length ? candidates : entries.filter(e => normalise(e.slug.split('/').at(-1)) === key);
  if (matches.length !== 1) return undefined;
  return matches[0].href + (fragment ? '#' + fragment.toLowerCase().replace(/\s+/g, '-') : '');
}
export function noteLinks(entry, entries) {
  const body = entry.body.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`]*`|<!--[\s\S]*?-->/g, '');
  const urls = [];
  for (const m of body.matchAll(/(?<!!)\[\[([^\]]+)\]\]/g)) urls.push(resolveNote(m[1].split('|')[0], entries, entry));
  for (const m of body.matchAll(/(?<!!)\[[^\]]+\]\(([^\s)]+)(?:\s+[^)]*)?\)/g)) {
    let target = m[1];
    if (/^https?:/.test(target)) {
      try { const u = new URL(target); if (!['almunday.com','www.almunday.com'].includes(u.hostname)) continue; target = u.pathname + u.hash; } catch { continue; }
    }
    urls.push(resolveNote(target, entries, entry));
  }
  return [...new Set(urls.filter(Boolean).map(u => u.split('#')[0]))].filter(u => u !== entry.href && entries.some(e => e.href === u));
}
