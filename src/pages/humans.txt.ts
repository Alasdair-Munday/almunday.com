import { site } from '../lib/site.js';

export const prerender = true;

export function GET() {
  const body = `/* TEAM */ Developer: ${site.creator.name} Contact: ${site.creator.email} Site: ${site.creator.website}\n/* SITE */ Doctype: HTML5\n`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
