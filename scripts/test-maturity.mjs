import test from 'node:test';
import assert from 'node:assert/strict';
import { graphMaturityStyle, normalizeMaturity, MATURITY_STAGES } from '../src/utils/note-maturity.mjs';

test('missing and blank maturity preserve established notes; stages accept case/spacing', () => {
  for (const value of [undefined, null, '', '  ']) assert.equal(normalizeMaturity(value), 'established');
  assert.equal(normalizeMaturity(' Growing '), 'growing');
  assert.throws(() => normalizeMaturity('finished'), /Use seedling, growing, or established/);
  assert.throws(() => normalizeMaturity(1), /Unknown note maturity/);
});

test('maturity increases mark size/solidity independently of link count in both graphs', () => {
  for (const scale of ['global', 'local']) {
    const styles = MATURITY_STAGES.map(stage => graphMaturityStyle(stage, scale, true, 0));
    assert.ok(styles[0].radius < styles[1].radius && styles[1].radius < styles[2].radius);
    assert.ok(styles[0].opacity < styles[1].opacity && styles[1].opacity < styles[2].opacity);
    for (const stage of MATURITY_STAGES) {
      assert.deepEqual(graphMaturityStyle(stage, scale, true, 100), graphMaturityStyle(stage, scale, true, 0));
    }
  }
});

test('disabling maturity styling restores upstream connection-based sizing', () => {
  assert.equal(graphMaturityStyle('seedling', 'global', false, 0).radius, 5);
  assert.equal(graphMaturityStyle('seedling', 'global', false, 100).radius, 15);
  assert.equal(graphMaturityStyle('growing', 'local', false, 0).radius, 3);
  assert.equal(graphMaturityStyle('growing', 'local', false, 100).radius, 8);
  assert.equal(graphMaturityStyle('seedling', 'global', false, 0).opacity, 1);
});
