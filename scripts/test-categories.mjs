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
