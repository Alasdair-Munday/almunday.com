import test from 'node:test';
import assert from 'node:assert/strict';
import { graphMaturityStyle, normalizeMaturity, MATURITY_STAGES, meetsMinimumMaturity } from '../src/utils/note-maturity.mjs';

test('missing and blank maturity preserve established notes; stages accept case/spacing', () => {
  for (const value of [undefined, null, '', '  ']) assert.equal(normalizeMaturity(value), 'established');
  assert.equal(normalizeMaturity(' Growing '), 'growing');
  assert.equal(normalizeMaturity(' Seed '), 'seed');
  assert.throws(() => normalizeMaturity('finished'), /Use seed, seedling, growing, or established/);
  assert.throws(() => normalizeMaturity(1), /Unknown note maturity/);
});

test('maturity increases mark size/solidity independently of link count in both graphs', () => {
  for (const scale of ['global', 'local']) {
    const styles = MATURITY_STAGES.map(stage => graphMaturityStyle(stage, scale, true, 0));
    for (let i = 1; i < styles.length; i++) {
      assert.ok(styles[i - 1].radius < styles[i].radius);
      assert.ok(styles[i - 1].opacity < styles[i].opacity);
    }
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

test('minimum maturity includes the selected stage and all later stages', () => {
  for (const [index, minimum] of MATURITY_STAGES.entries()) {
    assert.deepEqual(MATURITY_STAGES.filter(stage => meetsMinimumMaturity(stage, minimum)), MATURITY_STAGES.slice(index));
  }
  assert.equal(meetsMinimumMaturity('seedling'), false);
  assert.equal(meetsMinimumMaturity('growing'), true);
  assert.equal(meetsMinimumMaturity(undefined), true);
});
