import markdownIt from 'markdown-it';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItPrism from 'markdown-it-prism';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItClass from '@toycode/markdown-it-class';
import markdownItLinkAttributes from 'markdown-it-link-attributes';
import { full as markdownItEmoji } from 'markdown-it-emoji';
import markdownItFootnote from 'markdown-it-footnote';
import markdownitMark from 'markdown-it-mark';
import markdownitAbbr from 'markdown-it-abbr';
import markdownItWikilinks from 'markdown-it-wikilinks';

import { slugifyString } from './utils.js';

export const markdownRenderer = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true
})
  .disable('code')
  .use(md => {
    const defaultFence =
      md.renderer.rules.fence ||
      ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const info = (token.info || '').trim().toLowerCase();
      if (info === 'mermaid') {
        const escaped = md.utils.escapeHtml(token.content);
        return `<pre class="mermaid">${escaped}</pre>\n`;
      }
      return defaultFence(tokens, idx, options, env, self);
    };
  })
  .use(markdownItAttrs)
  .use(markdownItPrism, {
    defaultLanguage: 'plaintext'
  })
  .use(markdownItAnchor, {
    slugify: slugifyString,
    tabIndex: false,
    permalink: markdownItAnchor.permalink.headerLink({
      class: 'heading-anchor'
    })
  })
  .use(markdownItClass, {})
  .use(markdownItLinkAttributes, [
    {
      matcher(href) {
        return href.match(/^https?:\/\//);
      },
      attrs: {
        rel: 'noopener'
      }
    }
  ])
  .use(markdownItEmoji)
  .use(markdownItFootnote)
  .use(markdownitMark)
  .use(markdownitAbbr)
  .use(md => {
    md.renderer.rules.image = (tokens, idx) => {
      const token = tokens[idx];
      const src = token.attrGet('src') || '';
      const alt = token.content || '';
      const caption = token.attrGet('title');
      const attrs = (token.attrs || []).filter(([key]) => !['src', 'alt', 'title'].includes(key));
      const attributesString = attrs.map(([key, value]) => `${key}="${value}"`).join(' ');
      const extraAttributes = attributesString.length > 0 ? ` ${attributesString}` : '';
      const imgTag = `<img src="${src}" alt="${alt}"${extraAttributes}>`;

      return caption ? `<figure>${imgTag}<figcaption>${caption}</figcaption></figure>` : imgTag;
    };
  })
  .use(markdownItWikilinks, {
    baseURL: '/blog/',
    makeAllLinksAbsolute: true,
    uriSuffix: '',
    slugify: slugifyString
  });
