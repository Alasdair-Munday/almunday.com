export const GRAPH_CATEGORIES = Object.freeze([
  { id: 'bible', label: 'Bible', tags: ['bible', 'biblical-studies', 'bible-and-hermeneutics', 'hermeneutics', 'biblical-interpretation', 'old-testament', 'new-testament', 'genesis', 'proverbs', 'john', 'judges', 'leviticus', 'hebrew', 'gospel-of-mark', 'wisdom'] },
  { id: 'culture', label: 'Culture', tags: ['culture', 'creativity', 'society', 'politics', 'philosophy'] },
  { id: 'theology', label: 'Theology', tags: ['theology', 'doctrine-of-god', 'soteriology', 'ecclesiology', 'christology', 'eschatology', 'missiology', 'spirituality-and-practice', 'discipleship', 'kingdom-of-god', 'holy-spirit', 'creation', 'worship', 'mission'] },
  { id: 'music', label: 'Music', tags: ['music', 'songwriting', 'songs', 'chordpro', 'audio', 'production'] },
  { id: 'tech', label: 'Tech', tags: ['tech', 'technology', 'coding', 'programming', 'web-development', 'astro', 'ai'] },
]);

/** Choose one explicit tag-based topic; specific subjects precede broad theology.
 * @param {unknown} value
 */
export function getGraphCategory(value) {
  const tags = (Array.isArray(value) ? value : typeof value === 'string' ? value.replace(/^\[|\]$/g, '').split(',') : [])
    .map(tag => String(tag).trim().replace(/^['"]|['"]$/g, '').toLowerCase());
  for (const id of ['music', 'tech', 'bible', 'culture', 'theology']) {
    const category = GRAPH_CATEGORIES.find(category => category.id === id);
    if (category.tags.some(tag => tags.includes(tag))) return id;
  }
  return null;
}
