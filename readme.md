# almunday.com

The personal site of Rev Al Munday: writing, songs, reflections, and software projects in one chronological feed.

The site is built with [Astro](https://astro.build) from the open-source [Minrock](https://github.com/rnt-rez/minrock) theme. Content lives in Markdown and can be edited in Obsidian.

## Development

Requires Node.js 22.12 or newer.

```bash
npm ci
npm run dev
```

The local site runs at `http://localhost:4321`.

## Validation

```bash
npm run check
npm run build
```

## Content

- Writing: `src/content/blog/<slug>/index.md`
- Projects: `src/content/projects/<slug>/index.md`
- Site details and feature flags: `src/config/site.ts`

The homepage combines writing and projects into one date-sorted feed. Existing detail pages remain under `/blog/` and `/projects/`, and the RSS feed includes both collections.

## Writing in Obsidian

Open `src/content` as an Obsidian vault. The included vault configuration provides the Minrock writing tools, folder-based article creation, frontmatter editing, image handling, search, tags, and optional Git publishing.

New articles live at `src/content/blog/<slug>/index.md`. Images pasted into an article stay beside that article, so they work in Obsidian and on the site. See `src/content/_GUIDE.md` for the vault workflow.

## Audio

Article and project pages include Minrock’s browser-based text-to-speech player. It reads the page using the visitor’s installed system voices, with play, pause, paragraph navigation, and speed controls. Add `audio: false` to an article’s frontmatter when a particular piece should not offer narration.

## Deployment

The production URL defaults to `https://almunday.com`. Set `SITE_URL` to override it in another environment.

Netlify can build the site with:

```text
Build command: npm run build
Publish directory: dist
```

## Credits

The underlying theme is Minrock by Renato Rezende, used under the MIT License. Site content and branding belong to Rev Al Munday.

## Digital garden

The homepage keeps the site's theme and displays published writing as a text-led graph, with the complete chronological list below it. Solid lines represent actual links; optional dotted lines represent shared tags. Focus or hover a title to emphasise its connections. The graph is a normal list of links without JavaScript; article navigation and the list remain available.

In the existing VaultCMS/Obsidian blog vault, use `[[Article title]]`, `[[article-folder]]` or `[[Article title|display text]]`. Optional frontmatter `aliases: [Short name]` also resolves. `[[Article title#Heading]]` supports ordinary heading anchors. Markdown links to relative `.md` files and public `/blog/...` routes also count. Code examples, embeds, drafts and unresolved/ambiguous wiki targets do not generate graph edges or public links. Obsidian embeds and block references are not implemented.

A small “Linked from” section appears automatically when another published piece links to an article. Add `updatedDate: YYYY-MM-DD` to show “Last tended” and move it up the homepage list. No writing is rewritten to manufacture connections; the current five pieces initially connect by their existing tags.

Run `npm run test:garden` for resolution/graph regression checks, and `npm run qa` for Astro validation and a complete static build.
