import { getAllPosts } from '../lib/content.js';
import { site } from '../lib/site.js';

export const prerender = true;

export async function GET() {
  const posts = await getAllPosts();

  const body = {
    version: 'https://jsonfeed.org/version/1.1',
    title: site.blog.name,
    language: site.lang,
    home_page_url: site.url,
    feed_url: new URL('/feed.json', site.url).toString(),
    description: site.blog.description,
    authors: [
      {
        name: site.author.name
      }
    ],
    items: posts.map(post => ({
      id: new URL(post.url, site.url).toString(),
      url: new URL(post.url, site.url).toString(),
      title: post.title,
      content_html: post.contentHtml,
      date_published: new Date(post.date).toISOString()
    }))
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/feed+json; charset=utf-8'
    }
  });
}
