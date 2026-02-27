import { getAllPosts, getAllProjects, getTagList, getPostsByTag } from '../lib/content.js';
import { site } from '../lib/site.js';
import { escapeXml } from '../lib/utils.js';

export const prerender = true;

const xmlDate = value => new Date(value).toISOString();

const basePages = [
  { url: '/', changefreq: 'weekly' },
  { url: '/blog/', changefreq: 'weekly' },
  { url: '/projects/', changefreq: 'monthly' },
  { url: '/songwriting/', changefreq: 'monthly' },
  { url: '/styleguide/', changefreq: 'monthly' },
  { url: '/imprint/', changefreq: 'yearly' },
  { url: '/privacy/', changefreq: 'yearly' }
];

export async function GET() {
  const [posts, projects, tags] = await Promise.all([getAllPosts(), getAllProjects(), getTagList()]);
  const now = new Date();

  const blogPageCount = Math.ceil(posts.length / 8);
  const projectPageCount = Math.ceil(projects.length / 8);

  const paginatedBlogPages = Array.from({ length: Math.max(blogPageCount - 1, 0) }, (_, idx) => ({
    url: `/blog/page-${idx + 2}/`,
    changefreq: 'weekly'
  }));

  const paginatedProjectPages = Array.from({ length: Math.max(projectPageCount - 1, 0) }, (_, idx) => ({
    url: `/projects/page-${idx + 2}/`,
    changefreq: 'monthly'
  }));

  const tagEntries = await Promise.all(
    tags.map(async tag => {
      const postsForTag = await getPostsByTag(tag);
      const lastmod = postsForTag[0]?.lastUpdated || now;

      return {
        url: `/tags/${encodeURIComponent(tag)}/`,
        changefreq: 'weekly',
        lastmod
      };
    })
  );

  const entries = [
    ...basePages.map(page => ({ ...page, lastmod: now })),
    ...paginatedBlogPages.map(page => ({ ...page, lastmod: now })),
    ...paginatedProjectPages.map(page => ({ ...page, lastmod: now })),
    ...posts.map(post => ({ url: post.url, changefreq: 'monthly', lastmod: post.lastUpdated })),
    ...projects.map(project => ({ url: project.url, changefreq: 'monthly', lastmod: project.lastUpdated })),
    ...tagEntries
  ];

  const urls = entries
    .map(
      entry => `
  <url>
    <loc>${escapeXml(new URL(entry.url, site.url).toString())}</loc>
    <lastmod>${xmlDate(entry.lastmod)}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
  </url>`
    )
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
}
