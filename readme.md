# almunday.com

Personal site and blog built with Astro.

## Stack

- Astro 5 (static output)
- Tailwind integration (minimal usage)
- Markdown content with frontmatter
- Netlify deployment

## Requirements

- Node.js 20+
- npm

## Install

```bash
npm install
```

## Local development

```bash
npm start
```

This runs Astro dev server.

## Build

```bash
npm run build
```

Build pipeline:

1. Clean build artifacts
2. Sync static assets into `public/assets`
3. Build Astro static output into `dist/`

## Content model

- Blog posts: `src/posts/**/*.md`
- Projects: `src/projects/**/*.md`

The site reads Markdown recursively and renders routes for blog/project listings and detail pages.

## Obsidian workflow

You can author in Obsidian and sync Markdown into the repo before committing.

### Environment

Copy `.env-sample` to `.env` and set:

- `OBSIDIAN_VAULT_PATH` (required for sync commands)
- `OBSIDIAN_POSTS_DIR` (optional, default: `Posts`)
- `OBSIDIAN_PROJECTS_DIR` (optional, default: `Projects`)

### Sync commands

Sync all Markdown from vault folders:

```bash
npm run sync:content
```

Sync only notes not marked `draft: true`:

```bash
npm run sync:content:published
```

Both commands clean destination Markdown first, then copy into:

- `src/posts`
- `src/projects`

## Netlify publishing model

Netlify builds from committed files in this repository.

Recommended flow:

1. Write in Obsidian
2. Run a sync command
3. Review changes
4. Commit and push
5. Netlify builds from committed Markdown

This keeps production builds deterministic and independent of your local vault path.

## Scripts

- `npm start` / `npm run dev`: Astro dev server
- `npm run build`: production build
- `npm run preview`: preview built site
- `npm run check`: Astro type/content checks
- `npm run sync:assets`: copy `src/assets` to `public/assets`
- `npm run sync:content`: sync vault content (all Markdown)
- `npm run sync:content:published`: sync vault content excluding `draft: true`

## Notes

- `URL` in env sets the site URL used in build metadata.
- If Obsidian folders are missing, sync commands fail with explicit paths.
- If Obsidian env vars are not set, runtime content loading falls back to in-repo content directories.
