/** Content tags only; maturity belongs in frontmatter, not the tag graph. */
export function contentTags(value) {
  const raw = Array.isArray(value) ? value : typeof value === 'string' ? value.replace(/^\[|\]$/g, '').split(',') : [];
  return [...new Set(raw.map(tag => String(tag).trim().replace(/^['"]|['"]$/g, '').replace(/^#/, '').toLowerCase())
    .filter(tag => tag && !/^(digital[- ]garden|maturity(?:[-/].*)?|seed|seedling|growing|established|draft|blog|posts?|notes?|series)$/.test(tag)))];
}

/** Count unique neighbours, treating reciprocal note links as one connection.
 * @param {{id: string}[]} nodes
 * @param {{source: string | {id: string}, target: string | {id: string}}[]} links
 */
export function connectionCounts(nodes, links) {
  const neighbors = new Map(nodes.map(node => [node.id, new Set()]));
  for (const link of links) {
    const a = typeof link.source === 'string' ? link.source : link.source.id;
    const b = typeof link.target === 'string' ? link.target : link.target.id;
    if (a !== b && neighbors.has(a) && neighbors.has(b)) {
      neighbors.get(a).add(b);
      neighbors.get(b).add(a);
    }
  }
  return new Map([...neighbors].map(([id, ids]) => [id, ids.size]));
}

/** Sublinear growth keeps highly connected tags useful without dwarfing notes. */
export function connectionRadius(count, scale = 'global') {
  return scale === 'local' ? Math.min(20, 3 + Math.sqrt(Math.max(0, count)) * 1.5) : Math.min(32, 4 + Math.sqrt(Math.max(0, count)) * 2);
}

/** Add one tag node per distinct content tag after the post limit is applied. */
export function addTagNodes(posts, noteLinks) {
  const tags = new Map();
  const links = [...noteLinks];
  for (const post of posts) {
    for (const tag of contentTags(post.tags)) {
      const id = `tag:${tag}`;
      if (!tags.has(id)) tags.set(id, {id, type: 'tag', title: `#${tag}`, tag});
      links.push({source: post.id, target: id, type: 'tag'});
    }
  }
  const nodes = [...posts, ...tags.values()];
  const counts = connectionCounts(nodes, links);
  return {nodes: nodes.map(node => ({...node, connections: counts.get(node.id)})), connections: links};
}
