import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fromHtml } from 'hast-util-from-html';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkChordPro from '../src/utils/remark-chordpro.mjs';

const processor = await createMarkdownProcessor({ remarkPlugins: [remarkChordPro] });
const render = (source, language = 'chopro') => processor.render(`\`\`\`${language}\n${source}\n\`\`\``);
for (const language of ['chopro', 'chordpro']) {
  test(`${language} renders chords above lyrics without code highlighting or extra headings`, async () => {
    const { code, metadata } = await render('{title: Example}\n{start_of_chorus: Chorus}\n[G]Hello [C]world\n{end_of_chorus}', language);
    assert.match(code, /class="chordpro"/);
    assert.match(code, /<div class="chord">G<\/div><div class="lyrics">Hello /);
    assert.match(code, /paragraph chorus/);
    assert.doesNotMatch(code, /<pre|<h[1-6]/);
    assert.deepEqual(metadata.headings, []);
  });
}
test('song text and metadata remain literal text', async () => {
  const { code } = await render('{title: <img src=x onerror=alert(1)>}\n[C]<script>alert(1)</script> & you');
  assert.doesNotMatch(code, /<script|<img|<iframe/);
  const text = node => node.type === 'text' ? node.value : (node.children ?? []).map(text).join('');
  const visible = text(fromHtml(code, { fragment: true }));
  assert.ok(visible.includes('<script>alert(1)</script> & you'));
  assert.ok(visible.includes('<img src=x onerror=alert(1)>'));
});
test('multiple sheets and ordinary code remain independent', async () => {
  const { code } = await processor.render('Intro\n\n```chopro\n[C]First\n```\n\n```js\nconst answer = 42;\n```\n\n```chordpro\n[D]Second\n```');
  assert.equal((code.match(/class="chordpro"/g) ?? []).length, 2);
  assert.match(code, /<pre/);
  assert.match(code, /First/);
  assert.match(code, /Second/);
});
test('blank chord sheets do not break publishing', async () => {
  const { code } = await render('');
  assert.match(code, /aria-label="Chord sheet"/);
});

test('Magnificat preserves the supplied chord chart, including slash chords and F#m', async () => {
  const { readFileSync } = await import('node:fs');
  const source = readFileSync(new URL('../src/content/posts/magnificat/index.md', import.meta.url), 'utf8');
  const { code } = await processor.render(source.replace(/^---[\s\S]*?---\s*/, ''));
  const chords = [...code.matchAll(/<div class="chord">([^<]*)<\/div>/g)].map(match => match[1]).filter(Boolean);
  assert.deepEqual(chords, [
    'E','A/E', 'E','A/E', 'E','A', 'E','A',
    'B','E','A', 'B','E','F#m',
    'A', 'E','B', 'A', 'E','B', 'A','B','E','A', 'A','B','E',
  ]);
  assert.match(code, /God is good all the time/);
});
