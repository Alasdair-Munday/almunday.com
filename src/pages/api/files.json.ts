import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
export const GET: APIRoute = async () => {
  const collections = await Promise.all([getCollection('posts'), getCollection('pages'), getCollection('projects')]);
  const names = collections.flat().filter(entry => !entry.data.draft).map(entry => entry.data.title);
  return Response.json(names);
};
