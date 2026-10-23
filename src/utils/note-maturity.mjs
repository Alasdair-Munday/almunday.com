import { connectionRadius } from './graph-tags.mjs';
/** Shared by the content schema, Node graph generator, and both browser graphs. */
/** @type {readonly ['seed', 'seedling', 'growing', 'established']} */
export const MATURITY_STAGES = ['seed', 'seedling', 'growing', 'established'];
export const DEFAULT_MATURITY = 'established';
export const NOTE_MATURITY = Object.freeze({
  seed: Object.freeze({ label: 'Seed', description: 'an idea to develop', opacity: 0.25 }),
  seedling: Object.freeze({ label: 'Seedling', description: 'an early exploration', opacity: 0.4 }),
  growing: Object.freeze({ label: 'Growing', description: 'a developing reflection', opacity: 0.7 }),
  established: Object.freeze({ label: 'Established', description: 'a developed piece', opacity: 1 }),
});

/** @param {unknown} value */
export function normalizeMaturity(value) {
  if (value == null || value === '') return DEFAULT_MATURITY;
  const stage = typeof value === 'string' ? value.trim().toLowerCase() : value;
  if (stage === '') return DEFAULT_MATURITY;
  if (!MATURITY_STAGES.includes(stage)) {
    throw new Error(`Unknown note maturity "${value}". Use seed, seedling, growing, or established.`);
  }
  return /** @type {'seed' | 'seedling' | 'growing' | 'established'} */ (stage);
}

/**
 * Opacity expresses maturity; mark size expresses connections. Labels stay readable.
 * Disabling maturity styling leaves all node marks fully opaque.
 * @param {unknown} value
 * @param {'global' | 'local'} scale
 * @param {boolean} enabled
 * @param {number} connections
 */
export function graphMaturityStyle(value, scale = 'global', enabled = true, connections = 0) {
  const maturity = normalizeMaturity(value);
  const style = NOTE_MATURITY[maturity];
  return { maturity, label: style.label, radius: connectionRadius(connections, scale), opacity: enabled ? style.opacity : 1 };
}

/** @param {unknown} value @param {unknown} minimum */
export function meetsMinimumMaturity(value, minimum = 'growing') {
  return MATURITY_STAGES.indexOf(normalizeMaturity(value)) >= MATURITY_STAGES.indexOf(normalizeMaturity(minimum));
}

/** @param {unknown} maturity */
export function isEssay(maturity) {
  return normalizeMaturity(maturity) === 'established';
}
