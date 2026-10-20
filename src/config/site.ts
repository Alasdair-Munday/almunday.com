/**
 * Granular Feature Flags ("Complete by default, minimalist on demand")
 *
 * All flags default to `true` when omitted.
 * Minimalist or purist technical writers can set any flag to `false`
 * to completely eliminate markup, styles, and scripts during SSG build.
 */
export interface SiteFeatures {
  /** Full-text search modal + Ctrl/Cmd+K shortcuts + header triggers */
  search?: boolean;
  /** Sticky sidebar table of contents in blog posts */
  tableOfContents?: boolean;
  /** "X min read" badge in post headers */
  readingTime?: boolean;
  /** Accessible text-to-speech audio reader in blog posts and project details */
  audioPlayer?: boolean;
  /** Tag badges in post headers, article cards, and tag clouds */
  tags?: boolean;
  /** Notion-style share modal and trigger bar in blog posts */
  socialShare?: boolean;
  /** Theme toggle dropdown (White, Cream, Slate, Midnight) */
  themeSwitcher?: boolean;
  /** Floating smooth-scroll back-to-top button */
  backToTop?: boolean;
  /** Medium-style smooth image zoom modal on click */
  imageZoom?: boolean;
}

export interface SiteConfig {
  title: string;
  tagline: string;
  description: string;
  author: string;
  siteUrl: string;
  defaultTheme: 'white' | 'cream' | 'slate' | 'midnight';
  features?: SiteFeatures;
  socialLinks: {
    github?: string;
    twitter?: string;
    bluesky?: string;
    linkedin?: string;
    email?: string;
  };
  navLinks: {
    title: string;
    href: string;
  }[];
}

export const siteConfig: SiteConfig = {
  title: 'Al Munday',
  tagline: 'Rev, dev, musician and overthinker.',
  description: 'Notes, reflections, songs, and projects from Rev Al Munday.',
  author: 'Rev Al Munday',
  // Can be overridden with SITE_URL in preview or production environments.
  siteUrl: (typeof process !== 'undefined' && process.env?.SITE_URL) || (import.meta as any).env?.SITE_URL || 'https://almunday.com',
  defaultTheme: 'white',
  // Granular Feature Flags — "Complete by default, minimalist on demand"
  // Toggle any feature to false to completely omit markup & scripts in static build
  features: {
    search: true,
    tableOfContents: true,
    readingTime: true,
    audioPlayer: true,
    tags: true,
    socialShare: false,
    themeSwitcher: false,
    backToTop: false,
    imageZoom: true
  },
  socialLinks: {
    github: 'https://github.com/Alasdair-Munday',
    bluesky: 'https://bsky.app/profile/almunday.com',
    email: 'hi@almunday.com'
  },
  navLinks: [
    { title: 'Home', href: '/' },
    { title: 'Tags', href: '/tags' },
    { title: 'About', href: '/about' }
  ]
};
