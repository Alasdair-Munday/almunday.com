import { getAllPosts } from '../lib/content.js';
import { site } from '../lib/site.js';
import { escapeXml } from '../lib/utils.js';

export const prerender = true;

const xmlDate = value => new Date(value).toISOString();

const cdata = value => `<![CDATA[${String(value || '').replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;

export async function GET() {
  const posts = await getAllPosts();
  const feedUpdated = posts.length > 0 ? xmlDate(posts[0].date) : xmlDate(new Date());

  const entries = posts
    .map(post => {
      const absoluteUrl = new URL(post.url, site.url).toString();

      return `
    <entry>
      <title>${escapeXml(post.title)}</title>
      <link href="${escapeXml(absoluteUrl)}" />
      <updated>${xmlDate(post.date)}</updated>
      <id>${escapeXml(absoluteUrl)}</id>
      <content type="html">${cdata(post.contentHtml)}</content>
    </entry>`;
    })
    .join('');

  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${escapeXml(site.lang)}" xml:base="${escapeXml(site.url)}/">
  <title>${escapeXml(site.blog.name)}</title>
  <subtitle>${escapeXml(site.blog.description)}</subtitle>
  <link href="${escapeXml(new URL('/feed.xml', site.url).toString())}" rel="self" />
  <link href="${escapeXml(site.url)}" />
  <updated>${feedUpdated}</updated>
  <id>${escapeXml(site.url)}</id>
  <author>
    <name>${escapeXml(site.author.name)}</name>
  </author>${entries}
</feed>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8'
    }
  });
}
