import { MATURITY_STAGES, normalizeMaturity } from './note-maturity.mjs';

/** @typedef {{ id: string, children: Branch[] }} Branch */
/** A spanning forest is a layout aid, not an editorial parent/child hierarchy.
 * Every note and original link remains available, including cycles and cross-links.
 * @param {{id: string, maturity?: string}[]} nodes
 * @param {{source: string | {id: string}, target: string | {id: string}}[]} links
 */
export function buildGraphForest(nodes, links) {
  const byId = new Map(nodes.map(node => [node.id, node]));
  const neighbors = new Map(nodes.map(node => [node.id, new Set()]));
  for (const link of links) {
    const source = typeof link.source === 'string' ? link.source : link.source.id;
    const target = typeof link.target === 'string' ? link.target : link.target.id;
    if (source !== target && neighbors.has(source) && neighbors.has(target)) {
      neighbors.get(source).add(target);
      neighbors.get(target).add(source);
    }
  }
  const rank = (a, b) => neighbors.get(b).size - neighbors.get(a).size
    || MATURITY_STAGES.indexOf(normalizeMaturity(byId.get(b).maturity)) - MATURITY_STAGES.indexOf(normalizeMaturity(byId.get(a).maturity))
    || a.localeCompare(b);
  const visited = new Set();
  /** @type {Branch[]} */
  const roots = [];
  const branchEdges = new Set();
  for (const id of [...byId.keys()].sort(rank)) {
    if (visited.has(id)) continue;
    const root = { id, children: [] };
    roots.push(root);
    visited.add(id);
    const queue = [root];
    for (let i = 0; i < queue.length; i++) {
      const parent = queue[i];
      for (const childId of [...neighbors.get(parent.id)].sort(rank)) {
        if (visited.has(childId)) continue;
        visited.add(childId);
        const child = { id: childId, children: [] };
        parent.children.push(child);
        queue.push(child);
        branchEdges.add([parent.id, childId].sort().join('\0'));
      }
    }
  }
  return { roots, branchEdges };
}
