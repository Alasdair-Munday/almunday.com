import { cp, mkdir, readdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import yaml from 'js-yaml';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const FRONTMATTER_RE = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/;

function toAbsolute(inputPath) {
  return path.isAbsolute(inputPath) ? inputPath : path.resolve(root, inputPath);
}

function parseArgs(argv) {
  return {
    clean: argv.includes('--clean'),
    publishedOnly: argv.includes('--published-only')
  };
}

async function walkMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
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

async function directoryExists(directory) {
  try {
    const entries = await readdir(directory, { withFileTypes: true });
    return Array.isArray(entries);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}

function getFrontmatterData(markdown) {
  const match = markdown.match(FRONTMATTER_RE);
  if (!match) {
    return {};
  }

  try {
    return yaml.load(match[1]) || {};
  } catch {
    return {};
  }
}

async function shouldIncludeFile(filePath, publishedOnly) {
  if (!publishedOnly) {
    return true;
  }

  const markdown = await readFile(filePath, 'utf8');
  const frontmatter = getFrontmatterData(markdown);
  return frontmatter.draft !== true;
}

async function ensureDirectory(directory) {
  await mkdir(directory, { recursive: true });
}

async function removeAllMarkdown(directory) {
  try {
    const files = await walkMarkdownFiles(directory);
    await Promise.all(files.map(file => rm(file, { force: true })));
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}

async function copyFilteredMarkdown(sourceRoot, destRoot, options) {
  const { publishedOnly } = options;
  const sourceFiles = await walkMarkdownFiles(sourceRoot);
  let copied = 0;
  let skipped = 0;

  for (const filePath of sourceFiles) {
    const include = await shouldIncludeFile(filePath, publishedOnly);
    if (!include) {
      skipped += 1;
      continue;
    }

    const relativePath = path.relative(sourceRoot, filePath);
    const targetPath = path.join(destRoot, relativePath);
    await ensureDirectory(path.dirname(targetPath));
    await cp(filePath, targetPath, { force: true });
    copied += 1;
  }

  return { copied, skipped };
}

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const vaultPathInput = process.env.OBSIDIAN_VAULT_PATH?.trim();

  if (!vaultPathInput) {
    console.error('OBSIDIAN_VAULT_PATH is required. Set it in .env to sync content.');
    process.exit(1);
  }

  const postsDir = process.env.OBSIDIAN_POSTS_DIR?.trim() || 'Posts';
  const projectsDir = process.env.OBSIDIAN_PROJECTS_DIR?.trim() || 'Projects';

  const sourcePostsRoot = toAbsolute(path.join(vaultPathInput, postsDir));
  const sourceProjectsRoot = toAbsolute(path.join(vaultPathInput, projectsDir));
  const destPostsRoot = path.join(root, 'src', 'posts');
  const destProjectsRoot = path.join(root, 'src', 'projects');

  const [hasPostsSource, hasProjectsSource] = await Promise.all([
    directoryExists(sourcePostsRoot),
    directoryExists(sourceProjectsRoot)
  ]);

  if (!hasPostsSource || !hasProjectsSource) {
    const missing = [];
    if (!hasPostsSource) {
      missing.push(sourcePostsRoot);
    }
    if (!hasProjectsSource) {
      missing.push(sourceProjectsRoot);
    }

    console.error(`Missing source folder(s):\n- ${missing.join('\n- ')}`);
    process.exit(1);
  }

  await Promise.all([ensureDirectory(destPostsRoot), ensureDirectory(destProjectsRoot)]);

  if (args.clean) {
    await Promise.all([removeAllMarkdown(destPostsRoot), removeAllMarkdown(destProjectsRoot)]);
  }

  const [postsResult, projectsResult] = await Promise.all([
    copyFilteredMarkdown(sourcePostsRoot, destPostsRoot, args),
    copyFilteredMarkdown(sourceProjectsRoot, destProjectsRoot, args)
  ]);

  const mode = args.publishedOnly ? 'published-only' : 'all markdown';
  const cleanSuffix = args.clean ? ' with clean' : '';
  const summary = [
    `Synced ${mode}${cleanSuffix}:`,
    `- posts: ${postsResult.copied} copied, ${postsResult.skipped} skipped`,
    `- projects: ${projectsResult.copied} copied, ${projectsResult.skipped} skipped`
  ].join('\n');

  console.log(summary);
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
