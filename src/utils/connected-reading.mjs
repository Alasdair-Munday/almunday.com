import { graphNeighborhood } from './graph-neighborhood.mjs';

/** Prefer actual links, then shared tags, within the same two-step local graph.
 * @param {{nodes: {id: string, type?: string, title?: string, slug?: string}[], connections: {source: string, target: string}[]}} graph
 * @param {string} currentId
 * @param {number} limit
 */
export function connectedReading(graph, currentId, limit = 5) {
  const direct = new Set();
  const neighbors = new Map(graph.nodes.map(node => [node.id, new Set()]));
  for (const edge of graph.connections) {
    if (!neighbors.has(edge.source) || !neighbors.has(edge.target)) continue;
    neighbors.get(edge.source).add(edge.target);
    neighbors.get(edge.target).add(edge.source);
    if (edge.source === currentId) direct.add(edge.target);
    if (edge.target === currentId) direct.add(edge.source);
  }
  const tags = new Set(graph.nodes.filter(node => node.type === 'tag' && direct.has(node.id)).map(node => node.id));
  return graphNeighborhood(graph, currentId, 2).nodes
    .filter(node => node.type === 'post' && node.id !== currentId && node.slug)
    .map(node => {
      const shared = [...tags].filter(tag => neighbors.get(node.id).has(tag)).length;
      return {...node, direct: direct.has(node.id), shared, reason: direct.has(node.id) ? 'Linked note' : shared ? 'Shared tags' : 'Two steps away'};
    })
    .sort((a, b) => Number(b.direct) - Number(a.direct) || b.shared - a.shared || String(a.title).localeCompare(String(b.title)))
    .slice(0, Math.max(0, limit));
}
