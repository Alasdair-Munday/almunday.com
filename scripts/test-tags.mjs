import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {parse} from 'yaml';
import test from 'node:test';
import assert from 'node:assert/strict';
import {contentTags, addTagNodes, connectionCounts, connectionRadius} from '../src/utils/graph-tags.mjs';

test('content tags exclude housekeeping and deduplicate tags without losing subjects', () => {
  assert.deepEqual(contentTags(['Bible','bible','digital-garden','maturity-seed','seedling','worldview','music','series']), ['bible','worldview','music']);
  assert.deepEqual(contentTags('["tech", "maturity-growing"]'), ['tech']);
});
test('tag nodes join notes, preserve note links, and size by unique neighbours', () => {
  const graph = addTagNodes([{id:'a',tags:['bible','bible','maturity-seed']},{id:'b',tags:['bible','music']},{id:'c',tags:[]}], [{source:'a',target:'b',type:'link'},{source:'b',target:'a',type:'link'}]);
  assert.equal(graph.nodes.length, 5);
  assert.equal(graph.connections.filter(e => e.type === 'tag').length,3);
  const counts=connectionCounts(graph.nodes,graph.connections);
  assert.equal(counts.get('a'),2);
  assert.equal(counts.get('b'),3);
  assert.equal(counts.get('tag:bible'),2);
  assert.equal(counts.get('c'),0);
  assert.ok(connectionRadius(3)>connectionRadius(1));
  assert.ok(connectionRadius(10000)<=32);
  const subset=graph.nodes.filter(n=>['a','tag:bible'].includes(n.id));
  assert.equal(connectionCounts(subset,graph.connections).get('tag:bible'),1);
});

test('vault frontmatter has no retired category field or housekeeping tags', () => {
  const visit = dir => {
    for (const entry of readdirSync(dir,{withFileTypes:true})) {
      const path=join(dir,entry.name);
      if(entry.isDirectory()) visit(path);
      else if(/\.mdx?$/.test(entry.name)) {
        const data=parse(readFileSync(path,'utf8').split('---')[1]);
        assert.equal(data.mainCategory,undefined,path);
        assert.deepEqual(data.tags || [],contentTags(data.tags),path);
      }
    }
  };
  visit('src/content/posts');
});
