/** Undirected breadth-first neighbourhood; tags count as one step too.
 * @template {{id: string}} N
 * @template {{source: string, target: string}} E
 * @param {{nodes: N[], connections: E[]}} graph
 * @param {string} currentId
 * @param {number} depth
 */
export function graphNeighborhood(graph, currentId, depth = 2) {
  const ids = new Set(graph.nodes.map(node => node.id));
  if (!ids.has(currentId)) return {nodes: [], connections: []};
  const adjacency = new Map([...ids].map(id => [id, new Set()]));
  for (const edge of graph.connections) {
    if (!ids.has(edge.source) || !ids.has(edge.target)) continue;
    adjacency.get(edge.source).add(edge.target);
    adjacency.get(edge.target).add(edge.source);
  }
  const visited = new Set([currentId]);
  let frontier = [currentId];
  for (let step = 0; step < depth; step++) {
    const next = [];
    for (const id of frontier) for (const neighbor of adjacency.get(id)) {
      if (!visited.has(neighbor)) {visited.add(neighbor);next.push(neighbor);}
    }
    frontier = next;
  }
  return {nodes: graph.nodes.filter(node => visited.has(node.id)), connections: graph.connections.filter(edge => visited.has(edge.source) && visited.has(edge.target))};
}
