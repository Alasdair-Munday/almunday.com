export const site = {
  url: process.env.URL || 'http://localhost:4321',
  siteName: 'Rev Al Munday',
  siteDescription: 'Rev, dev, musician and overthinker.',
  siteType: 'person',
  locale: 'en_EN',
  lang: 'en',
  skipContent: 'Skip to content',
  themeColor: '#2f6f95',
  themeLight: '#f2eee6',
  themeDark: '#213f51',
  opengraphDefault: '/assets/images/template/opengraph-default.jpg',
  opengraphDefaultAlt:
    "Visible content: The personal website of Rev Al Munday. A blog about Jesus, Technology and Life.",
  author: {
    name: 'Rev Al Munday',
    avatar: '/icon-512x512.png',
    email: 'hi@almunday.com',
    website: 'https://almunday.com'
  },
  creator: {
    name: 'Rev Al Munday',
    avatar: '/icon-512x512.png',
    email: 'hi@almunday.com',
    website: 'https://almunday.com'
  },
  blog: {
    name: "Al Munday's Blog",
    description: 'A blog about Jesus, Technology and Life.',
    feedLinks: [
      {
        title: 'Atom Feed',
        url: '/feed.xml',
        type: 'application/atom+xml'
      },
      {
        title: 'JSON Feed',
        url: '/feed.json',
        type: 'application/json'
      }
    ],
    tagSingle: 'Tag',
    tagPlural: 'Tags',
    tagMore: 'More tags:',
    paginationLabel: 'Blog',
    paginationPage: 'Page',
    paginationPrevious: 'Previous',
    paginationNext: 'Next',
    paginationNumbers: true
  },
  projects: {
    paginationLabel: 'Projects',
    paginationPage: 'Page',
    paginationPrevious: 'Previous',
    paginationNext: 'Next',
    paginationNumbers: true
  },
  navigation: {
    navLabel: 'Menu',
    ariaTop: 'Main',
    ariaBottom: 'Complementary',
    ariaPlatforms: 'Platforms',
    drawerNav: false
  },
  themeSwitch: {
    title: 'Theme',
    light: 'Light',
    dark: 'Dark'
  },
  greenweb: {
    disclosures: [
      {
        docType: 'sustainability-page',
        url: `${process.env.URL || 'http://localhost:4321'}/sustainability/`,
        domain: new URL(process.env.URL || 'http://localhost:4321').hostname
      }
    ],
    services: [{ domain: 'netlify.com', serviceType: 'cdn' }]
  },
  easteregg: false
};

export const navigation = {
  top: [
    {
      text: 'Jesus',
      url: '/blog/'
    },
    {
      text: 'Music',
      url: '/songwriting/'
    },
    {
      text: 'Computers',
      url: '/projects/'
    }
  ],
  bottom: [
  ]
};

export const personal = {
  email: 'hi@almunday.com',
  platforms: {
    github: 'https://github.com/Alasdair-Munday',
    bluesky: 'https://bsky.app/profile/almunday.com'
  }
};

export const contentStreams = [
  {
    key: 'dev',
    label: 'Computers',
    description: 'I love computers. You can take the nerd out of software development, but you can\'t take the software development out of the nerd. Here I report about projects I\'ve worked on. And some of the technical challenges that I faced along the way.',
    href: '/projects/',
    matches: ['project', 'projects', 'dev', 'development', 'code', 'engineering', 'software', '11ty', 'astro']
  },
  {
    key: 'songwriting',
    label: 'Music',
    description: 'I love music.I write songs to help me process my thoughts. I upload them here in case they help others process theirs.',
    href: '/songwriting/',
    matches: ['song', 'songs', 'songwriting', 'music', 'worship', 'bass']
  },
  {
    key: 'faith',
    label: 'Jesus',
    description: 'I love Jesus. I write here about the Bible and Theology. I genuinely believe that he is the answer, even when we, his followers, regularly miss the point. Blogs are usually ways to externally process without taking some poor listener hostage.',
    href: '/blog/',
    matches: [
      'faith',
      'theology',
      'reflections',
      'jesus',
      'bible',
      'church',
      'genesis',
      'creation',
      'diversity',
      'reconciliation'
    ]
  }
];
