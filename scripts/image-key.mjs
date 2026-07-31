import { createHash } from 'node:crypto';
import { extname } from 'node:path';

const ARTICLE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_TYPES = {
  '.png': { extension: 'png', mimeType: 'image/png' },
  '.jpg': { extension: 'jpg', mimeType: 'image/jpeg' },
  '.jpeg': { extension: 'jpg', mimeType: 'image/jpeg' },
  '.webp': { extension: 'webp', mimeType: 'image/webp' },
};
const PUBLIC_ORIGIN = 'https://cdn.geocutter.com';

export function createImageKey(articleId, filePath, bytes) {
  if (typeof articleId !== 'string' || !ARTICLE_ID_PATTERN.test(articleId)) {
    throw new Error('Invalid article ID');
  }

  const imageType = IMAGE_TYPES[extname(filePath).toLowerCase()];
  if (!imageType) {
    throw new Error('Unsupported image format');
  }
  if (!Buffer.isBuffer(bytes)) {
    throw new TypeError('Image bytes are required');
  }

  const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
  const key = `blog/${articleId}/${hash}.${imageType.extension}`;
  return {
    key,
    url: `${PUBLIC_ORIGIN}/${key}`,
    mimeType: imageType.mimeType,
  };
}
