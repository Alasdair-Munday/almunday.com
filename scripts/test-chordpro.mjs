import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { rehypeChordPro } from '../src/plugins/rehype-chordpro.mjs';
import { rehypeCallouts } from '../src/plugins/rehype-callouts.mjs';

const processor = await createSatteriMarkdownProcessor({
  syntaxHighlight: { type: 'shiki', excludeLangs: ['chopro', 'chordpro'] },
  hastPlugins: [rehypeCallouts(), rehypeChordPro()],
});
const render = async (source, language = 'chopro') => processor.render(`\`\`\`${language}\n${source}\n\`\`\``);

for (const language of ['chopro', 'chordpro']) {
  test(`${language} renders chords above lyrics through the site's Markdown processor`, async () => {
    const { code, metadata } = await render('{title: Example}\n{start_of_chorus: Chorus}\n[G]Hello [C]world\n{end_of_chorus}', language);
    assert.match(code, /class="chordpro"/);
    assert.match(code, /<div class="chord">G<\/div><div class="lyrics">Hello /);
    assert.match(code, /paragraph chorus/);
    assert.doesNotMatch(code, /<pre|<h[1-6]/);
    assert.deepEqual(metadata.headings, []);
  });
}

test('song text and metadata are displayed literally without executing HTML', async () => {
  const { code } = await render('{title: <img src=x onerror=alert(1)>}\n[C]<script>alert(1)</script> & you');
  assert.doesNotMatch(code, /<script|<img|<iframe/);
  assert.match(code, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(code, /&amp; you/);
});

test('multiple sheets, ordinary code and existing callouts remain independent', async () => {
  const { code } = await processor.render('> [!TIP]\n> A note\n\n```chopro\n[C]First\n```\n\n```js\nconst answer = 42;\n```\n\n```chordpro\n[D]Second\n```');
  assert.equal((code.match(/class="chordpro"/g) ?? []).length, 2);
  assert.match(code, /callout-tip/);
  assert.match(code, /<pre/);
  assert.match(code, /First/);
  assert.match(code, /Second/);
});

test('blank sheets do not break publishing', async () => {
  const { code } = await render('');
  assert.match(code, /aria-label="Chord sheet"/);
});
