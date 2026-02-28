import fs from 'node:fs/promises';
import path from 'node:path';

import yaml from 'js-yaml';

import { markdownRenderer } from './markdown.js';
import { normalizeAssetPath, slugifyString, stripHtml } from './utils.js';
import { contentStreams } from './site.js';

const DEFAULT_POSTS_ROOT = path.join(process.cwd(), 'src', 'posts');
const DEFAULT_PROJECTS_ROOT = path.join(process.cwd(), 'src', 'projects');
const DEFAULT_OBSIDIAN_POSTS_DIR = 'Posts';
const DEFAULT_OBSIDIAN_PROJECTS_DIR = 'Projects';

const FRONTMATTER_RE = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/;

const YOUTUBE_SHORTCODE_RE = /\{%\s*youtube\s+['"]([^'"]+)['"]\s*,\s*['"]([^'"]*)['"]\s*%\}/g;

let resolvedContentRootsPromise;

function resolveFromCwd(value) {
  if (!value) {
    return null;
  }

  return path.isAbsolute(value) ? value : path.resolve(process.cwd(), value);
}

async function directoryExists(directory) {
  if (!directory) {
    return false;
  }

  try {
    const stats = await fs.stat(directory);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

function pickObsidianCandidate(vaultRoot, configuredDir, defaultDir) {
  if (configuredDir) {
    if (path.isAbsolute(configuredDir)) {
      return configuredDir;
    }

    if (vaultRoot) {
      return path.join(vaultRoot, configuredDir);
    }

    return path.resolve(process.cwd(), configuredDir);
  }

  if (!vaultRoot) {
    return null;
  }

  return path.join(vaultRoot, defaultDir);
}

async function resolveRootDirectory(fallbackRoot, configuredDir, defaultVaultDir, vaultRoot) {
  const candidate = pickObsidianCandidate(vaultRoot, configuredDir, defaultVaultDir);

  if (await directoryExists(candidate)) {
    return candidate;
  }

  return fallbackRoot;
}

async function resolveContentRoots() {
  const vaultRoot = resolveFromCwd(process.env.OBSIDIAN_VAULT_PATH?.trim());
  const configuredPostsDir = process.env.OBSIDIAN_POSTS_DIR?.trim();
  const configuredProjectsDir = process.env.OBSIDIAN_PROJECTS_DIR?.trim();

  const [postsRoot, projectsRoot] = await Promise.all([
    resolveRootDirectory(
      DEFAULT_POSTS_ROOT,
      configuredPostsDir,
      DEFAULT_OBSIDIAN_POSTS_DIR,
      vaultRoot
    ),
    resolveRootDirectory(
      DEFAULT_PROJECTS_ROOT,
      configuredProjectsDir,
      DEFAULT_OBSIDIAN_PROJECTS_DIR,
      vaultRoot
    )
  ]);

  return { postsRoot, projectsRoot };
}

async function getContentRoots() {
  resolvedContentRootsPromise ??= resolveContentRoots();
  return resolvedContentRootsPromise;
}

async function walkMarkdownFiles(directory) {
  let entries;

  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkMarkdownFiles(fullPath)));
      continue;
    }

    if (entry.isFile() && fullPath.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function parseFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE);

  if (!match) {
    return {
      data: {},
      content: raw
    };
  }

  const data = yaml.load(match[1]) || {};
  const content = raw.slice(match[0].length);

  return {
    data,
    content
  };
}

function normalizeDate(value, fallbackDate) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed;
    }
  }

  return fallbackDate;
}

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags;
  }

  if (typeof tags === 'string' && tags.trim().length > 0) {
    return [tags.trim()];
  }

  return [];
}

function transformContent(content) {
  return content.replace(YOUTUBE_SHORTCODE_RE, (_, id, label) => {
    const safeLabel = label || 'YouTube video';

    return `
<div class="video-wrapper">
  <iframe
    src="https://www.youtube.com/embed/${id}"
    title="${safeLabel}"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>`;
  });
}

function buildExcerpt(contentHtml, fallback = '') {
  if (fallback) {
    return fallback;
  }

  const plain = stripHtml(contentHtml);
  if (plain.length <= 180) {
    return plain;
  }

  return `${plain.slice(0, 177).trim()}...`;
}

async function parseMarkdownFile(filePath) {
  const [raw, stats] = await Promise.all([fs.readFile(filePath, 'utf8'), fs.stat(filePath)]);
  const { data, content } = parseFrontmatter(raw);
  const transformedContent = transformContent(content);
  const contentHtml = markdownRenderer.render(transformedContent);

  return {
    filePath,
    stats,
    frontmatter: data,
    markdown: content,
    transformedMarkdown: transformedContent,
    contentHtml
  };
}

function normalizePostRecord(record) {
  const { filePath, stats, frontmatter, markdown, contentHtml } = record;
  const title = frontmatter.title || path.basename(filePath, '.md');
  const slug = slugifyString(title);

  const tagsList = normalizeTags(frontmatter.tags).map(t => typeof t === 'string' ? t.toLowerCase() : '');
  const songwritingStream = contentStreams.find(s => s.key === 'songwriting');
  let basePath = '/blog';
  if (songwritingStream && songwritingStream.matches.some(m => tagsList.includes(m.toLowerCase()))) {
    basePath = '/songwriting';
  }
  const url = `${basePath}/${slug}/`;

  const date = normalizeDate(frontmatter.date, stats.mtime);

  return {
    ...frontmatter,
    title,
    slug,
    url,
    date,
    markdown,
    contentHtml,
    description: frontmatter.description || '',
    excerpt: buildExcerpt(contentHtml, frontmatter.description),
    image: normalizeAssetPath(frontmatter.image),
    tags: normalizeTags(frontmatter.tags),
    sourcePath: filePath,
    lastUpdated: stats.mtime
  };
}

function normalizeProjectRecord(record) {
  const { filePath, stats, frontmatter, markdown, contentHtml } = record;
  const title = frontmatter.title || path.basename(filePath, '.md');
  const slug = slugifyString(path.basename(filePath, '.md'));
  const url = `/projects/${slug}/`;
  const date = normalizeDate(frontmatter.date, stats.mtime);

  return {
    ...frontmatter,
    title,
    slug,
    url,
    date,
    markdown,
    contentHtml,
    description: frontmatter.description || '',
    excerpt: buildExcerpt(contentHtml, frontmatter.description),
    image: normalizeAssetPath(frontmatter.image),
    tags: normalizeTags(frontmatter.tags),
    sourcePath: filePath,
    lastUpdated: stats.mtime
  };
}

export async function getAllPosts() {
  const { postsRoot } = await getContentRoots();
  const files = await walkMarkdownFiles(postsRoot);
  const records = await Promise.all(files.map(parseMarkdownFile));

  return records
    .map(normalizePostRecord)
    .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
}

export async function getAllProjects() {
  const { projectsRoot } = await getContentRoots();
  const files = await walkMarkdownFiles(projectsRoot);
  const records = await Promise.all(files.map(parseMarkdownFile));

  return records
    .map(normalizeProjectRecord)
    .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
}

export async function getPostBySlug(slug) {
  const posts = await getAllPosts();
  return posts.find(post => post.slug === slug);
}

export async function getProjectBySlug(slug) {
  const projects = await getAllProjects();
  return projects.find(project => project.slug === slug);
}

export async function getTagList() {
  const posts = await getAllPosts();
  const tags = new Set();

  for (const post of posts) {
    for (const tag of post.tags) {
      if (!['posts', 'docs', 'all'].includes(tag)) {
        tags.add(tag);
      }
    }
  }

  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

export async function getPostsByTag(tag) {
  const posts = await getAllPosts();
  return posts.filter(post => post.tags.includes(tag));
}

export async function getBacklinks() {
  const posts = await getAllPosts();
  const backlinks = {};

  for (const post of posts) {
    const regex = /\[\[(.*?)\]\]/g;
    let match;

    while ((match = regex.exec(post.markdown)) !== null) {
      const linkText = match[1];
      const linkSlug = slugifyString(linkText);

      const targetPost = posts.find(p => p.slug === linkSlug);
      const targetUrl = targetPost ? targetPost.url : `/blog/${linkSlug}/`;

      if (!backlinks[targetUrl]) {
        backlinks[targetUrl] = [];
      }

      if (!backlinks[targetUrl].find(item => item.url === post.url)) {
        backlinks[targetUrl].push({
          title: post.title,
          url: post.url
        });
      }
    }
  }

  return backlinks;
}
