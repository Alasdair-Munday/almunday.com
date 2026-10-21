import { gardenEntries, resolveNote } from '../utils/garden.mjs';
export function rehypeWikilinks() {
  return (tree, file) => {
    const entries = gardenEntries();
    const sourcePath = String(file?.path ?? '').replace(/\\/g, '/');
    const from = entries.find(e => sourcePath.endsWith('/' + e.source));
    function visit(node) {
      if (!node.children || ['code', 'pre', 'a', 'script', 'style'].includes(node.tagName)) return;
      node.children = node.children.flatMap(child => {
        if (child.type !== 'text') { visit(child); return [child]; }
        const result = []; let offset = 0;
        for (const match of child.value.matchAll(/(?<!!)\[\[([^\]]+)\]\]/g)) {
          result.push({type:'text', value:child.value.slice(offset, match.index)});
          const [target, alias] = match[1].split('|');
          const href = resolveNote(target, entries, from);
          const label = alias || target;
          result.push(href ? {type:'element', tagName:'a', properties:{href}, children:[{type:'text',value:label}]} : {type:'element', tagName:'span', properties:{className:['unresolved-note'], title:'This note is not published'}, children:[{type:'text', value:label}]});
          offset = match.index + match[0].length;
        }
        result.push({type:'text',value:child.value.slice(offset)});
        return result;
      });
    }
    visit(tree);
  };
}
