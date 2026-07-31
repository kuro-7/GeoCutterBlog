export const ARTICLE_LIMIT = 10;
export const TAG_LIMIT = 100;
export const PRODUCTION_ORIGIN = 'https://geocutter.com';
export const DEFAULT_OG_IMAGE =
  'https://cdn.geocutter.com/blog/r2-transfer-proof/4095612547a0.png';

export const parsePage = (value: string) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : null;
};

export const normalizeSearchQuery = (value?: string) => value?.trim().slice(0, 100) || '';
