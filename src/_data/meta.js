export const url = process.env.URL || 'http://localhost:8080';
// Extract domain from `url`
export const domain = new URL(url).hostname;
export const siteName = 'Rev Al Munday';
export const siteDescription = 'Rev, dev, musician and overthinker.';
export const siteType = 'person'; // website, blog, article, book, etc.
export const locale = 'en_EN';
export const lang = 'en';
export const skipContent = 'Skip to content';
export const author = {
  name: 'Rev Al Munday', // i.e. Lene Saile - page / blog author's name. Must be set.
  avatar: '/icon-512x512.png', // path to the author's avatar. In this case just using a favicon.
  email: 'hi@almunday.com', // i.e. hola@lenesaile.com - email of the author
  website: 'https://almunday.com', // i.e. https.://www.lenesaile.com - the personal site of the author
};
export const creator = {
  name: 'Rev Al Munday', // i.e. Lene Saile - page / blog author's name. Must be set.
  avatar: '/icon-512x512.png', // path to the author's avatar. In this case just using a favicon.
  email: 'hi@almunday.com', // i.e. hola@lenesaile.com - email of the author
  website: 'https://almunday.com', // i.e. https.://www.lenesaile.com - the personal site of the author
};
export const pathToSvgLogo = 'src/assets/svg/misc/tree-transparent.svg'; // used for favicon generation
export const themeColor = '#5ca8c1'; // used in manifest, for example primary color value
export const themeLight = '#cedfda'; // used for meta tag theme-color, if light colors are prefered. best use value set for light bg
export const themeDark = '#374c56'; // used for meta tag theme-color, if dark colors are prefered. best use value set for dark bg
export const ph_default = '/assets/images/template/opengraph-default.jpg'; // fallback/default meta image
export const opengraph_default_alt =
  "Visible content: The personal website of Rev Al Munday. A blog about Jesus, Technology and Life."; // alt text for default meta image"
export const blog = {
  // RSS feed
  name: 'Jesus', // name of the blog,
  description: 'Reflections on following Jesus in the modern world.', // description of the blog
  // feed links are looped over in the head. You may add more to the array.
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
  // Tags
  tagSingle: 'Tag',
  tagPlural: 'Tags',
  tagMore: 'More tags:',
  // pagination
  paginationLabel: 'Jesus',
  paginationPage: 'Page',
  paginationPrevious: 'Previous',
  paginationNext: 'Next',
  paginationNumbers: true
};
export const details = {
  aria: 'section controls',
  expand: 'expand all',
  collapse: 'collapse all'
};
export const dialog = {
  close: 'Close'
};
export const navigation = {
  navLabel: 'Menu',
  ariaTop: 'Main',
  ariaBottom: 'Complementary',
  ariaPlatforms: 'Platforms',
  drawerNav: false
};
export const themeSwitch = {
  title: 'Theme',
  light: 'Light',
  dark: 'Dark'
};
export const greenweb = {
  // https://carbontxt.org/
  disclosures: [
    {
      docType: 'sustainability-page',
      url: `${url}/sustainability/`,
      domain: domain
    }
  ],
  services: [{ domain: 'netlify.com', serviceType: 'cdn' }]
};
export const viewRepo = {
  // this is for the view/edit on github link. The value in the package.json will be pulled in.
  allow: false,
  infoText: 'View this page on GitHub'
};
export const easteregg = true;
