import test from 'node:test';
import assert from 'node:assert/strict';
import {graphNeighborhood} from '../src/utils/graph-neighborhood.mjs';

test('two steps includes incoming links and shared tags, and stops before a third step', () => {
  const graph={nodes:['post','direct','second','third','tag:bible','shared','isolated'].map(id=>({id})), connections:[{source:'direct',target:'post'},{source:'direct',target:'second'},{source:'second',target:'third'},{source:'post',target:'tag:bible'},{source:'shared',target:'tag:bible'},{source:'third',target:'missing'}]};
  const result=graphNeighborhood(graph,'post');
  assert.deepEqual(result.nodes.map(n=>n.id),['post','direct','second','tag:bible','shared']);
  assert.equal(result.connections.length,4);
  assert.deepEqual(graphNeighborhood(graph,'isolated').nodes,[{id:'isolated'}]);
  assert.deepEqual(graphNeighborhood(graph,'missing'),{nodes:[],connections:[]});
  assert.deepEqual(graphNeighborhood(graph,'post',0).nodes,[{id:'post'}]);
});
