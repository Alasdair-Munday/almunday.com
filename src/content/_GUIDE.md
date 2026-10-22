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
   audio: true
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

The graph uses larger, more solid node marks for more developed notes. Titles stay readable. Each node’s tooltip and accessible label include its maturity. `draft: true` still excludes a note from publication regardless of maturity. Missing or blank maturity means established; an unsupported value produces a build error listing the accepted stages.

The front-page graph starts with a minimum maturity of Growing, showing growing and established notes. Lower the Minimum maturity selector to Seedling or Seed to include earlier ideas. This only filters the graph; published notes remain available through search.

Writing and tag lists show established essays only. Existing blog posts without maturity remain included. Set `maturity: established` when a garden note is ready to appear as an essay.

## Garden topics

The graph has five large topic hubs: Bible, Culture, Theology, Music and Tech. Tag notes with the corresponding lowercase name to associate them; related subject tags are mapped in `src/utils/graph-categories.mjs`. Each note gets one main hub to limit clutter, with Music/Tech first, then Bible, Culture, Theology when tags overlap. Untagged or unmatched notes stay ungrouped. Hubs remain visible at every maturity level, while their note connections follow the filter. These topic nodes are navigation landmarks, not essays or maturity levels.
