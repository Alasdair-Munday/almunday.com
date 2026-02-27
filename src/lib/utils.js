import dayjs from 'dayjs';
import markdownIt from 'markdown-it';
import slugify from 'slugify';
import { contentStreams } from './site.js';

const markdown = markdownIt();

export const slugifyString = str => {
  return slugify(String(str || ''), {
    replacement: '-',
    remove: /[#,&,+()$~%.'":*¿?¡!<>{}]/g,
    lower: true
  });
};

export const toISOString = dateString => dayjs(dateString).toISOString();

export const formatDate = (date, format = 'MMMM D, YYYY') => dayjs(date).format(format);

export const markdownFormat = string => {
  if (typeof string !== 'string') {
    return string || '';
  }

  return markdown.render(string);
};

export const normalizePath = path => {
  if (!path) {
    return '/';
  }

  return path.endsWith('/') ? path : `${path}/`;
};

export const getLinkActiveState = (itemUrl, pageUrl) => {
  const normalizedItem = normalizePath(itemUrl);
  const normalizedPage = normalizePath(pageUrl);

  const isCurrent = normalizedItem === normalizedPage;
  const isActiveParent = normalizedItem.length > 1 && normalizedPage.startsWith(normalizedItem);

  return {
    ariaCurrent: isCurrent ? 'page' : undefined,
    dataState: isActiveParent ? 'active' : undefined
  };
};

export const normalizeAssetPath = value => {
  if (!value || typeof value !== 'string') {
    return value;
  }

  if (value.startsWith('./src/')) {
    return value.replace('./src', '');
  }

  if (value.startsWith('src/')) {
    return `/${value.replace(/^src\//, '')}`;
  }

  if (value.startsWith('/')) {
    return value;
  }

  return `/${value}`;
};

export const escapeXml = value =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const stripHtml = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export const chunkForPagination = (items, pageSize) => {
  const chunks = [];

  for (let index = 0; index < items.length; index += pageSize) {
    chunks.push(items.slice(index, index + pageSize));
  }

  return chunks;
};

export const estimateReadingTime = (text, wordsPerMinute = 220) => {
  const words = String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.round(words / wordsPerMinute));
};

export const getContentStream = item => {
  if (!item) {
    return null;
  }

  const tags = (item.tags || []).map(tag => String(tag).toLowerCase());
  const sourcePath = String(item.sourcePath || '').toLowerCase();
  const url = String(item.url || '').toLowerCase();

  if (sourcePath.includes('/src/projects/') || url.startsWith('/projects/')) {
    return contentStreams.find(stream => stream.key === 'dev') || null;
  }

  for (const stream of contentStreams) {
    if (stream.key === 'dev') {
      continue;
    }

    if (stream.matches.some(match => tags.includes(match.toLowerCase()))) {
      return stream;
    }
  }

  return null;
};
