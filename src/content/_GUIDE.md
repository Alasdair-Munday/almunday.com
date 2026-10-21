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

Minrock uses the **Folder-Based (Page Bundle)** structure:

```text
src/content/blog/
└── my-awesome-post/
    ├── index.md           # The article content & frontmatter
    ├── architecture.png   # Pasted locally via Ctrl + V
    └── benchmark.svg      # Vector diagrams
```

### Why this is optimal:
1. **Self-Contained**: If you delete or move the post folder, all related media files move with it (zero orphaned images).
2. **Native Preview**: Markdown image links like `![Architecture](architecture.png)` work both inside Obsidian and on your live Astro site.
3. **Clean URLs**: Minrock generates the route `/blog/my-awesome-post/` automatically.

---

## 🛠️ Vault CMS Wizard Mapping (If Starting From Scratch)

If you ever run the **Vault CMS Setup Wizard** (`Ctrl / Cmd + P` → `Vault CMS: Open Wizard`), use these exact settings for Minrock:

| Wizard Field | Recommended Value for Minrock | Note |
| :--- | :--- | :--- |
| **Welcome / Preset** | `Get started` (Do not apply theme presets) | Preserves Minrock's custom design |
| **Project Root** | `../..` | Auto-detected relative to `src/content` |
| **Config File** | `../../astro.config.mjs` | Astro configuration file |
| **Content Type Name** | `Blog` | Name of your primary collection |
| **Folder** | `blog` | Directory inside `src/content/` |
| **File Organization** | `folder` (*Folder-based*) | Creates `blog/<slug>/index.md` |
| **Index File Name** | `index` | Entrypoint Markdown filename |
| **Link Base Path** | `/blog/` | Route prefix on your site |
| **Title Property** | `title` | Article headline |
| **Date Property** | `pubDate` | Format: `YYYY-MM-DD` |
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
   pubDate: 2026-09-16
   tags: ["engineering", "design"]
   draft: false
   audio: true
   ---
   ```
4. **Updating Community Plugins**:
   - Keep plugins up to date with 1 click: **Settings** (`Ctrl + ,`) → **Community plugins** → **Check for updates** → **Update all**. Your Minrock settings are preserved automatically.

---

## Songs and ChordPro

ChordPro Viewer (ChoPro 0.9.4) is included and enabled in this vault. After
pulling these changes, restart Obsidian to load it. Use Reading View to preview
your song; source editing remains ordinary Markdown.

Put a fenced `chopro` block inside any blog post or project page:

````markdown
```chopro
{title: My song}
{key: G}

{start_of_verse: Verse 1}
[G]Here are the words of a [C]song
[Em]Chords sit above the [D]words
{end_of_verse}

{start_of_chorus: Chorus}
[C]Here is the [G]chorus
{end_of_chorus}
```
````

The same block previews in Obsidian and renders with chords above lyrics on
almunday.com. Keep website frontmatter (`title`, `pubDate`, etc.) outside the
block as usual. On the website, `chordpro` is also accepted as a fence alias;
use `chopro` for compatibility with the Obsidian plugin.

Use inline `[G]` chords and standard ChordPro directives. Website rendering uses
ChordSheetJS, so advanced directives may differ from ChoPro. Obsidian-specific
`[!chopro]` transclusions, song flows and setlists are not implemented on the
website. Transpose your source with Obsidian's **Transpose chords in current
file** command; the website displays the saved key and has no transpose control.
Long lines scroll horizontally on narrow screens to preserve chord alignment.
Browser printing uses a plain, ink-friendly chord sheet style.

ChoPro updates can be checked through Obsidian's community plugin settings.
The bundled files come from the upstream 0.9.4 release:
https://github.com/jheddings/obsidian-chopro/releases/tag/0.9.4

## 🔗 External Resources & Walkthrough

- **Comprehensive Online Guide**: [minrock.vercel.app/blog/obsidian-vault-guide](https://minrock.vercel.app/blog/obsidian-vault-guide)
- **Vault CMS Official Website**: [vaultcms.org](https://vaultcms.org/)
- **David Kimball's Walkthrough Video**: [YouTube (55s setup demo)](https://www.youtube.com/watch?v=MnXoikTajfI&t=55s)
