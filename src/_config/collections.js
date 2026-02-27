import { slugifyString } from './filters/slugify.js';
import fs from 'fs';

export const getAllPosts = collection => {
  return collection.getFilteredByGlob('./src/posts/**/*.md').reverse();
};

export const getBacklinks = collection => {
  const backlinks = {};
  // Process all posts
  collection.getFilteredByGlob('./src/posts/**/*.md').forEach(post => {
    // Read file synchronously to get raw content
    const content = fs.readFileSync(post.inputPath, 'utf8');

    // Regex for [[wikilinks]]
    // Simple regex: /\[\[(.*?)\]\]/g
    const regex = /\[\[(.*?)\]\]/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const linkText = match[1];
      // Configure slugify to match markdown-it-wikilinks (remove query/hash if needed)
      // Usually slugify(linkText)
      const slug = slugifyString(linkText);
      const targetUrl = `/blog/${slug}/`;

      if (!backlinks[targetUrl]) {
        backlinks[targetUrl] = [];
      }

      // Add source post info
      if (!backlinks[targetUrl].find(p => p.url === post.url)) {
        backlinks[targetUrl].push({
          url: post.url,
          title: post.data.title
        });
      }
    }
  });
  return backlinks;
};

/** All projects as a collection. */
export const getProjects = collection => {
  return collection.getFilteredByGlob('./src/projects/**/*.md').reverse();
};

/** All relevant pages as a collection for sitemap.xml */
export const showInSitemap = collection => {
  return collection.getFilteredByGlob('./src/**/*.{md,njk}');
};

/** All tags from all posts as a collection - excluding custom collections */
export const tagList = collection => {
  const tagsSet = new Set();
  collection.getAll().forEach(item => {
    if (!item.data.tags) return;
    item.data.tags.filter(tag => !['posts', 'docs', 'all'].includes(tag)).forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};
