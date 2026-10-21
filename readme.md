# Al Munday — Astro Modular digital garden

Based on Astro Modular 1.1.8; see ASTRO-MODULAR.md for the upstream revision and ASTRO-MODULAR-LICENSE for attribution.

## Writing and publishing

Open `src/content` as your existing Obsidian vault. Articles live in `posts/<slug>/index.md`; projects in `projects/`. Vault CMS and Astro Composer are configured to create articles there with `date: YYYY-MM-DD`. Existing blog posts were moved without changing their bodies, dates or draft states. `draft: true` stays unpublished.

Use normal Markdown links or Obsidian `[[wikilinks]]` between posts. The homepage uses Astro Modular's D3 GraphModal renderer in an inline container, including drag, zoom, clickable titles and keyboard-accessible article nodes. It uses actual article links; unconnected pieces remain visible. “Writing” and “All writing” provide plain-list browsing.

Search opens from the header or Ctrl/Cmd+K. It searches published posts, pages and projects, including body text. Drafts are excluded from published search data and the graph. Existing `/blog/...` and `/tags/...` URLs redirect to Modular's native routes on Netlify.

## Development

Node 24 and pnpm 10.29.3:

```
pnpm install --frozen-lockfile
pnpm run check
pnpm run build
pnpm run dev
```

The site uses a single fixed light theme: `src/themes/custom/almunday.ts` and `src/styles/almunday.css`. Theme and mode switching are disabled. Existing tree/logo, wallpaper and public image URLs are retained. The framework is Astro Modular; local adaptations are documented in ASTRO-MODULAR.md. Review upstream upgrades before applying them because the header, homepage and graph embedding are site-specific.
