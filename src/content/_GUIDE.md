# Al Munday — Obsidian Writing Guide

This folder is the Obsidian vault that directly powers almunday.com.

---

## ⚡ Instant Writing Workflow

When you open `src/content` as a vault in Obsidian:
- **New Article**: Press `Ctrl / Cmd + N` (or click **+ New** in the Blog view).
- **Pasting Images**: Press `Ctrl + V` inside any note. Screenshots and diagrams are automatically saved directly beside your post in the same folder.
- **Publishing**: Use the Git status bar icon (or `Ctrl / Cmd + P` → `Git: Push`) to send your changes to the site repository. Netlify then builds the update.

---

## 📁 The Page Bundle Architecture

Astro Modular uses the **Folder-Based (Page Bundle)** structure:

```text
src/content/posts/
└── my-awesome-post/
    ├── index.md           # The article content & frontmatter
    ├── architecture.png   # Pasted locally via Ctrl + V
    └── benchmark.svg      # Vector diagrams
```

### Why this is optimal:
1. **Self-Contained**: If you delete or move the post folder, all related media files move with it (zero orphaned images).
2. **Native Preview**: Markdown image links like `![Architecture](architecture.png)` work both inside Obsidian and on your live Astro site.
3. **Clean URLs**: Astro Modular generates the route `/posts/my-awesome-post/` automatically.

---

## 🛠️ Vault CMS Wizard Mapping (If Starting From Scratch)

If you ever run the **Vault CMS Setup Wizard** (`Ctrl / Cmd + P` → `Vault CMS: Open Wizard`), use these exact settings for Astro Modular:

| Wizard Field | Recommended Value for Astro Modular | Note |
| :--- | :--- | :--- |
| **Welcome / Preset** | `Get started` (Do not apply theme presets) | Preserves Astro Modular's custom design |
| **Project Root** | `../..` | Auto-detected relative to `src/content` |
| **Config File** | `../../astro.config.mjs` | Astro configuration file |
| **Content Type Name** | `Blog` | Name of your primary collection |
| **Folder** | `blog` | Directory inside `src/content/` |
| **File Organization** | `folder` (*Folder-based*) | Creates `blog/<slug>/index.md` |
| **Index File Name** | `index` | Entrypoint Markdown filename |
| **Link Base Path** | `/posts/` | Route prefix on your site |
| **Title Property** | `title` | Article headline |
| **Date Property** | `date` | Format: `YYYY-MM-DD` |
| **Description Property**| `description` | SEO & social sharing summary |
| **Tags Property** | `tags` | Array of topic tags (e.g. `['dev', 'tools']`) |
| **Draft Property** | `draft` | Logic: `true-draft` (`true` hides from production) |
| **Attachment Handling** | `Same folder as current file` | Ensures `Ctrl+V` pastes into post folder |

---

## 💡 Pro-Tips & Verification

1. **Obsidian Attachment Setting**:
   - Go to **Settings** (`Ctrl + ,`) → **Files and links** → **Default location for new attachments**.
   - Set it to: **"Same folder as current file"** (or in subfolder `./`).
2. **Astro Composer Creation Mode**:
   - In **Settings** → **Community plugins** → **Astro Composer** → **Blog**.
   - Confirm that **Creation mode** is set to `Folder-based (content-title/index.md)`.
3. **Frontmatter Template**:
   ```markdown
   ---
   title: "Your Article Title"
   description: "A concise summary for readers and search engines."
   date: 2026-09-16
   tags: ["engineering", "design"]
   draft: false
   audio: null # Or an attached filename, e.g. reflection.mp3
   ---
   ```
4. **Updating Community Plugins**:
   - Keep plugins up to date with 1 click: **Settings** (`Ctrl + ,`) → **Community plugins** → **Check for updates** → **Update all**. Your Astro Modular settings are preserved automatically.

---

## 🔗 External Resources & Walkthrough

- **Comprehensive Online Guide**: [minrock.vercel.app/posts/obsidian-vault-guide](https://minrock.vercel.app/posts/obsidian-vault-guide)
- **Vault CMS Official Website**: [vaultcms.org](https://vaultcms.org/)
- **David Kimball's Walkthrough Video**: [YouTube (55s setup demo)](https://www.youtube.com/watch?v=MnXoikTajfI&t=55s)


## Note maturity

Add `maturity` as a text property in a post's Properties panel or frontmatter:

```yaml
maturity: seed
```

Use `seed` for a title or a single sentence introducing an idea, `seedling` for a short note that begins exploring it, `growing` for a developing elaboration, and `established` for a developed piece. Maturity is an editorial choice, independent of length, link count or certainty. New post templates start at seed. Existing posts without this property render as established; no existing writing has been reclassified.

The graph uses more solid node marks for more developed notes. Node size reflects connections. Titles stay readable. Each node’s tooltip and accessible label include its maturity. `draft: true` still excludes a note from publication regardless of maturity. Missing or blank maturity means established; an unsupported value produces a build error listing the accepted stages.

The Garden graph starts with a minimum maturity of Evergreen (stored as `established`). Lower the Minimum maturity selector to Seedling or Seed to include earlier ideas. This only filters the graph; published notes remain available through search.

Every post list includes a minimum-maturity slider, defaulting to Evergreen (`established`). Lower it to include growing notes, seedlings and seeds. Maturity is independent of content type: Songs, Essays, Opinions, Comments and Software projects can each be browsed at any maturity. Filtering happens before pagination, and changing maturity returns to the first page. Content-type links preserve the selected maturity in the URL.

## Graph tags

Content tags appear as nodes connected to the notes that use them. Node size follows the number of unique connections in the displayed graph; note opacity still reflects maturity. The maturity slider filters notes and hides tags with no remaining notes. Tags such as `bible`, `culture`, `music` and `tech` work like any other subject tag; there are no special category hubs or mainCategory field.

Use tags for subject matter. Keep maturity in its own property. Housekeeping labels (`digital-garden`, `worldview`, `maturity-*`, standalone maturity stages, draft, blog/post/note, series) are excluded by `src/utils/graph-tags.mjs`. Existing notes have been cleaned accordingly.

## Reading and exploring

The front page features evergreen, established writing. The Garden page (`/garden/`) contains the full graph. Each post has a local graph in its right-hand sidebar (below the article on phones), showing notes and tags up to two connections away. Shared tags can therefore introduce another note in two steps. Select a note to read it, expand the local graph for more room, or follow the link to the whole garden.

## Note context and revisions

Every post displays its maturity and a short explanation. Connected reading beside the local graph lists up to five related notes, prioritising direct links, then shared tags. Homepage, archive, tag and content-type lists all default to Evergreen; their sliders can reveal earlier published work. The Garden remembers its minimum-maturity setting in this browser.

Keep `date` as the original publication date. When you substantially revise a note, set `lastModified` to the revision date, for example:

```yaml
date: 2026-10-01
lastModified: 2026-10-23
```

A later revision displays as Updated and is used in search-engine metadata, Atom and sitemap dates. Existing dates are not inferred from rebuilds. The vault Blog cards expose Updated as an optional property.
