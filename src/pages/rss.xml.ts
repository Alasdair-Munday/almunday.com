import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig } from '../config/site';

export async function GET(context: any) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const projects = await getCollection('projects');
  const items = [
    ...posts.map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`
    })),
    ...projects.map(project => ({
      title: project.data.title,
      pubDate: project.data.date,
      description: project.data.description,
      link: `/projects/${project.id}/`
    }))
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site || siteConfig.siteUrl,
    items,
    customData: `<language>en-gb</language>`
  });
}
