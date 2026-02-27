import { site } from '../lib/site.js';

export const prerender = true;

export function GET() {
  const body = `User-agent: *\nDisallow: /404.html\n\nUser-agent: GPTbot\nDisallow: /\n\nUser-agent: ChatGPT-User\nDisallow: /\n\nUser-agent: Google-Extended\nDisallow: /\n\nUser-agent: Omgilibot\nDisallow: /\n\nSitemap: ${site.url}/sitemap.xml\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
