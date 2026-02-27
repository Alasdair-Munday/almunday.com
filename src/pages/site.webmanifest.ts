import { site } from '../lib/site.js';

export const prerender = true;

export function GET() {
  const body = {
    name: `${site.siteName} - ${site.siteDescription}`,
    short_name: site.siteName,
    start_url: site.url,
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: '/maskable-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ],
    theme_color: site.themeColor,
    background_color: site.themeLight,
    display: 'standalone'
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8'
    }
  });
}
