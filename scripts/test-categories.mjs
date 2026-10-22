import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { GRAPH_CATEGORIES, getGraphCategory } from '../src/utils/graph-categories.mjs';
test('five stable topics use explicit tags and at most one main topic per note', () => {
  assert.deepEqual(GRAPH_CATEGORIES.map(c => c.label), ['Bible','Culture','Theology','Music','Tech']);
  for (const category of GRAPH_CATEGORIES) assert.equal(getGraphCategory([category.id]), category.id);
  assert.equal(getGraphCategory(['theology','genesis']), 'bible');
  assert.equal(getGraphCategory(['theology','culture']), 'culture');
  assert.equal(getGraphCategory('["Music", "theology"]'), 'music');
  assert.equal(getGraphCategory(['worldview','maturity-seed']), null);
  assert.equal(getGraphCategory(undefined), null);
});

test('explicit editorial category takes priority and rejects misspellings', () => {
  assert.equal(getGraphCategory(['theology'], 'music'), 'music');
  assert.throws(() => getGraphCategory(['bible'], 'religion'), /Unknown mainCategory/);
});

test('every vault note has one valid explicit main category', () => {
  const visit = dir => {
    for (const entry of readdirSync(dir, {withFileTypes: true})) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (/\.mdx?$/.test(entry.name)) {
        const frontmatter = readFileSync(path, 'utf8').split('---')[1];
        const matches = [...frontmatter.matchAll(/^mainCategory: (.+)$/gm)];
        assert.equal(matches.length, 1, path);
        assert.ok(GRAPH_CATEGORIES.some(category => category.id === matches[0][1]), path);
      }
    }
  };
  visit('src/content/posts');
});
