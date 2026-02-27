import { getAllPosts, getAllProjects } from '../lib/content.js';

export const prerender = true;

function normalizeRedirects(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return [value.trim()];
  }

  return [];
}

export async function GET() {
  const [posts, projects] = await Promise.all([getAllPosts(), getAllProjects()]);
  const entries = [...posts, ...projects];

  const redirects = entries.flatMap(entry => {
    const redirectFrom = normalizeRedirects(entry.redirectFrom);
    return redirectFrom.map(fromUrl => `${fromUrl} ${entry.url}`);
  });

  return new Response(`${redirects.join('\n')}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
}
