import test from 'node:test';
import assert from 'node:assert/strict';
import { graphMaturityStyle, normalizeMaturity, MATURITY_STAGES, meetsMinimumMaturity, isEssay } from '../src/utils/note-maturity.mjs';

test('missing and blank maturity preserve established notes; stages accept case/spacing', () => {
  for (const value of [undefined, null, '', '  ']) assert.equal(normalizeMaturity(value), 'established');
  assert.equal(normalizeMaturity(' Growing '), 'growing');
  assert.equal(normalizeMaturity(' Seed '), 'seed');
  assert.throws(() => normalizeMaturity('finished'), /Use seed, seedling, growing, or established/);
  assert.throws(() => normalizeMaturity(1), /Unknown note maturity/);
});

test('maturity changes opacity while connections determine size in both graphs', () => {
  for (const scale of ['global', 'local']) {
    const styles = MATURITY_STAGES.map(stage => graphMaturityStyle(stage, scale, true, 0));
    for (let i = 1; i < styles.length; i++) {
      assert.equal(styles[i - 1].radius, styles[i].radius);
      assert.ok(styles[i - 1].opacity < styles[i].opacity);
    }
    for (const stage of MATURITY_STAGES) {
      assert.ok(graphMaturityStyle(stage, scale, true, 100).radius > graphMaturityStyle(stage, scale, true, 0).radius);
      assert.equal(graphMaturityStyle(stage, scale, true, 100).opacity, graphMaturityStyle(stage, scale, true, 0).opacity);
    }
  }
});

test('disabling maturity changes opacity without changing connection-based sizes', () => {
  for (const scale of ['global', 'local']) {
    for (const stage of MATURITY_STAGES) {
      const enabled = graphMaturityStyle(stage, scale, true, 5);
      const disabled = graphMaturityStyle(stage, scale, false, 5);
      assert.equal(disabled.radius, enabled.radius);
      assert.equal(disabled.opacity, 1);
    }
  }
});

test('minimum maturity includes the selected stage and all later stages', () => {
  for (const [index, minimum] of MATURITY_STAGES.entries()) {
    assert.deepEqual(MATURITY_STAGES.filter(stage => meetsMinimumMaturity(stage, minimum)), MATURITY_STAGES.slice(index));
  }
  assert.equal(meetsMinimumMaturity('seedling'), false);
  assert.equal(meetsMinimumMaturity('growing'), true);
  assert.equal(meetsMinimumMaturity(undefined), true);
});

test('essay lists retain legacy blog posts and exclude developing notes', () => {
  for (const stage of ['seed', 'seedling', 'growing']) assert.equal(isEssay(stage), false);
  assert.equal(isEssay('established'), true);
  assert.equal(isEssay(undefined), true);
});
