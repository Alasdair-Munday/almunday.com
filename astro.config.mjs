import { defineConfig } from 'astro/config';

const site = process.env.URL || 'https://almunday.com';

import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: 'static',
  site,
  trailingSlash: 'always',
  integrations: [tailwind()]
});
