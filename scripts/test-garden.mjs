import test from 'node:test';
import assert from 'node:assert/strict';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import { wikiLinks, resolveNote, gardenData } from '../src/utils/garden.mjs';
const notes = [
  { id: 'one', href: '/blog/one', file: 'one/index.md', title: 'First thought', aliases: ['Start'], tags: [] },
  { id: 'two', href: '/blog/two', file: 'two/index.md', title: 'Second thought', aliases: [], tags: [] },
];
const processor = await createSatteriMarkdownProcessor({ syntaxHighlight: false, mdastPlugins: [wikiLinks(notes, notes[0])] });
async function html(source) { return (await processor.render(source)).code; }
test('wiki titles, aliases and headings resolve to public routes', async () => {
  const result = await html('[[Second thought|Read more]] [[Start]] [[two#A heading]]');
  assert.match(result, /href="\/blog\/two">Read more/);
  assert.match(result, /href="\/blog\/one">First thought/);
  assert.match(result, /href="\/blog\/two#a-heading"/);
});
test('code, missing/private targets, and embeds remain literal', async () => {
  const result = await html('`[[two]]`\n\n```text\n[[two]]\n```\n\n[[private]] ![[two]]');
  assert.doesNotMatch(result, /href=/);
});
test('relative Markdown files resolve; external Markdown URLs stay external', async () => {
  const result = await html('[Other](../two/index.md#heading) [External](https://example.com/test.md)');
  assert.match(result, /href="\/blog\/two#heading"/);
  assert.match(result, /href="https:\/\/example.com\/test.md"/);
});
test('ambiguous aliases do not silently link to the wrong note', () => {
  assert.equal(resolveNote('Start', [...notes, { ...notes[1], aliases: ['Start'] }]), undefined);
});
test('graph contains published notes and valid edges only', async () => {
  const { notes, edges } = await gardenData();
  assert.ok(notes.length > 0);
  for (const edge of edges) {
    assert.ok(notes.some(note => note.id === edge.source));
    assert.ok(notes.some(note => note.id === edge.target));
    assert.notEqual(edge.source, edge.target);
  }
});

test('graph uses rendered links, ignores code, and deduplicates mentions', async () => {
  const { edges } = await gardenData([
    { ...notes[0], body: '[[two]] [[Second thought]] [ref][other]\\n\\n[other]: /blog/two' },
    { ...notes[1], body: '`[[one]]`' },
  ]);
  assert.deepEqual(edges, [{ source: 'one', target: 'two', kind: 'link' }]);
});
