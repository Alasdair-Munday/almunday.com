import { contentStreams } from './site.js';
import { chunkForPagination } from './utils.js';

export const STREAM_PAGE_SIZE = 8;

const toTagList = tags => {
  if (Array.isArray(tags)) {
    return tags.map(tag => String(tag).toLowerCase());
  }

  if (typeof tags === 'string' && tags.trim().length > 0) {
    return [tags.trim().toLowerCase()];
  }

  return [];
};

export const getContentStreamByKey = key => {
  return contentStreams.find(stream => stream.key === key) || null;
};

export const streamMatchesTags = (stream, tags) => {
  if (!stream || !Array.isArray(stream.matches) || stream.matches.length === 0) {
    return false;
  }

  const normalizedTags = toTagList(tags);
  return stream.matches.some(match => normalizedTags.includes(String(match).toLowerCase()));
};

export const itemMatchesStream = (item, stream) => {
  if (!item || !stream) {
    return false;
  }

  const url = String(item.url || '').toLowerCase();
  const sourcePath = String(item.sourcePath || '').toLowerCase();

  if (stream.key === 'dev' && (url.startsWith('/projects/') || sourcePath.includes('/src/projects/'))) {
    return true;
  }

  return streamMatchesTags(stream, item.tags);
};

export const filterItemsByStream = (items, streamOrKey) => {
  const stream = typeof streamOrKey === 'string' ? getContentStreamByKey(streamOrKey) : streamOrKey;

  if (!stream || !Array.isArray(items)) {
    return [];
  }

  return items.filter(item => itemMatchesStream(item, stream));
};

export const getStreamLandingData = ({ streamKey, items, pageSize = STREAM_PAGE_SIZE }) => {
  const stream = getContentStreamByKey(streamKey);
  const filteredItems = filterItemsByStream(items, stream);
  const pages = chunkForPagination(filteredItems, pageSize);

  return {
    stream,
    pageSize,
    items: filteredItems,
    pages,
    totalItems: filteredItems.length,
    totalPages: pages.length
  };
};
