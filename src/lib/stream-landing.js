import { chunkForPagination } from './utils.js';

export const getStreamByKey = (streams, key) => streams.find(stream => stream.key === key) || null;

export const filterItemsByStreamMatches = (items, stream) => {
  if (!stream) {
    return items;
  }

  const normalizedMatches = (stream.matches || []).map(match => String(match).toLowerCase());

  return items.filter(item => {
    const tags = (item.tags || []).map(tag => String(tag).toLowerCase());
    return normalizedMatches.some(match => tags.includes(match));
  });
};

export const buildPaginatedStreamItems = ({
  items,
  pageSize,
  stream,
  filterByMatches = false
}) => {
  const filteredItems = filterByMatches ? filterItemsByStreamMatches(items, stream) : items;
  const pages = chunkForPagination(filteredItems, pageSize);

  return {
    filteredItems,
    pages,
    items: pages[0] || [],
    totalPages: pages.length
  };
};
