import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGraphForest } from '../src/utils/graph-forest.mjs';

test('branch layout retains cyclic, disconnected and isolated notes without inventing links', () => {
  const nodes = ['a', 'b', 'c', 'd', 'e', 'alone'].map(id => ({ id }));
  const links = [['a','b'], ['b','c'], ['c','a'], ['d','e'], ['a','a'], ['a','missing']].map(([source,target]) => ({source,target}));
  const { roots, branchEdges } = buildGraphForest(nodes, links);
  const flattened = [];
  const visit = node => { flattened.push(node.id); node.children.forEach(visit); };
  roots.forEach(visit);
  assert.deepEqual(flattened.toSorted(), nodes.map(n => n.id).toSorted());
  assert.equal(roots.length, 3);
  assert.equal(branchEdges.size, nodes.length - roots.length);
  for (const edge of branchEdges) assert.ok(links.some(l => [l.source,l.target].sort().join('\0') === edge));
  assert.equal(links.length, 6);
  assert.deepEqual(buildGraphForest([...nodes].reverse(), [...links].reverse()), {roots, branchEdges});
});

test('well-connected notes anchor branches; maturity breaks equal-degree ties', () => {
  const nodes = [{id:'seed', maturity:'seed'}, {id:'essay',maturity:'established'}, {id:'leaf',maturity:'seed'}];
  const links = [{source:'seed',target:'essay'},{source:'essay',target:'leaf'}];
  assert.equal(buildGraphForest(nodes,links).roots[0].id,'essay');
  assert.equal(buildGraphForest(nodes.slice(0,2),links.slice(0,1)).roots[0].id,'essay');
  assert.deepEqual(buildGraphForest([],[]),{roots:[],branchEdges:new Set()});
});
