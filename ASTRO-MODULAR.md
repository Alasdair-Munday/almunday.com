Based on Astro Modular 1.1.8 by David V. Kimball.
Upstream commit: 19dddda8a2eadd2ed35e81811a261d717a487d45
https://github.com/davidvkimball/astro-modular

Site changes: fixed Al Munday theme; embedded upstream D3 graph as homepage; body search; legacy blog URL redirects; migrated vault blog collection to posts and pubDate to date. Existing writing and draft states are retained.

Additional fixes: upstream pagination typing and special-page entry IDs; graph resolution by display title, duplicate edges and code exclusions; body text in search; no draft names in file-name endpoint. Existing upstream unused-code hints remain; Astro type checking has zero errors.

## Note maturity extension

`src/utils/note-maturity.mjs` owns the allowed stages, default, labels and visual mapping, shared by the content schema, graph generator, legend and both graph renderers. `postOptions.graphView.noteMaturity.enabled` in `src/config.ts` toggles maturity styling; disabling it restores upstream link-count sizing. Existing config markers and graph/Swup initializers are retained. No separate graph renderer, global browser state or Obsidian plugin fork is added. The graph JSON adds a validated `maturity` field. Existing posts default to established; only new-post templates default to seed.

The global graph keeps a circular force-directed layout. Stronger repulsion, longer link distances and title-sized collision spacing prevent crowding. Links stay faint until hovered. Dense graphs start at readable scale with pan/zoom and a Show whole garden overview control.
