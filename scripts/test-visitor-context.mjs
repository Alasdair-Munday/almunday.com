import test from 'node:test';
import assert from 'node:assert/strict';
import {connectedReading} from '../src/utils/connected-reading.mjs';
import {revisionDate} from '../src/utils/post-dates.mjs';

test('connected reading prioritises direct links, then shared tags, excluding current/tag/third-step nodes', () => {
  const nodes=['current','direct','shared','second','third'].map(id=>({id,type:'post',slug:id,title:id}));
  nodes.push({id:'tag:one',type:'tag',title:'#one'});
  const graph={nodes,connections:[{source:'direct',target:'current'},{source:'current',target:'tag:one'},{source:'shared',target:'tag:one'},{source:'direct',target:'second'},{source:'second',target:'third'}]};
  assert.deepEqual(connectedReading(graph,'current').map(n=>n.id),['direct','shared','second']);
  assert.deepEqual(connectedReading(graph,'current',1).map(n=>n.id),['direct']);
  assert.deepEqual(connectedReading(graph,'missing'),[]);
  assert.deepEqual(connectedReading(graph,'current',0),[]);
});

test('revision dates require an explicitly later calendar date', () => {
  const published=new Date('2026-10-01');
  for(const modified of [undefined,'invalid','2026-09-30','2026-10-01T13:00:00Z']) assert.equal(revisionDate(published,modified),null);
  assert.equal(revisionDate(published,'2026-10-23').toISOString(),'2026-10-23T00:00:00.000Z');
});
