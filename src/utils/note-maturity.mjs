/** Shared by the content schema, Node graph generator, and both browser graphs. */
/** @type {readonly ['seedling', 'growing', 'established']} */
export const MATURITY_STAGES = ['seedling', 'growing', 'established'];
export const DEFAULT_MATURITY = 'established';
export const NOTE_MATURITY = Object.freeze({
  seedling: Object.freeze({ label: 'Seedling', radius: 4, localRadius: 3, opacity: 0.4 }),
  growing: Object.freeze({ label: 'Growing', radius: 7, localRadius: 5, opacity: 0.7 }),
  established: Object.freeze({ label: 'Established', radius: 10, localRadius: 7, opacity: 1 }),
});

/** @param {unknown} value */
export function normalizeMaturity(value) {
  if (value == null || value === '') return DEFAULT_MATURITY;
  const stage = typeof value === 'string' ? value.trim().toLowerCase() : value;
  if (stage === '') return DEFAULT_MATURITY;
  if (!MATURITY_STAGES.includes(stage)) {
    throw new Error(`Unknown note maturity "${value}". Use seedling, growing, or established.`);
  }
  return /** @type {'seedling' | 'growing' | 'established'} */ (stage);
}

/**
 * Only node marks express maturity; labels always retain their readable opacity.
 * The disabled mode retains Astro Modular's original connection-based sizing.
 * @param {unknown} value
 * @param {'global' | 'local'} scale
 * @param {boolean} enabled
 * @param {number} connections
 */
export function graphMaturityStyle(value, scale = 'global', enabled = true, connections = 0) {
  const maturity = normalizeMaturity(value);
  const style = NOTE_MATURITY[maturity];
  const legacyRadius = scale === 'local'
    ? Math.max(3, Math.min(8, connections + 3))
    : Math.max(5, Math.min(15, connections + 5));
  return { maturity, label: style.label, radius: enabled ? (scale === 'local' ? style.localRadius : style.radius) : legacyRadius, opacity: enabled ? style.opacity : 1 };
}
