import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createImageKey } from './image-key.mjs';

const bytes = Buffer.from('hello');

test('creates a content-addressed key and public URL', () => {
  const image = createImageKey('r2-transfer-proof', 'image.png', bytes);

  assert.equal(image.key, 'blog/r2-transfer-proof/2cf24dba5fb0.png');
  assert.equal(image.url, `https://cdn.geocutter.com/${image.key}`);
  assert.match(image.key.split('/').at(-1).split('.')[0], /^[0-9a-f]{12}$/);
});

test('rejects invalid article IDs', () => {
  for (const articleId of ['../article', 'Article', 'article_name', 'article--name']) {
    assert.throws(() => createImageKey(articleId, 'image.png', bytes), /Invalid article ID/);
  }
});

test('normalizes extensions and maps MIME types', () => {
  const cases = [
    ['.png', 'png', 'image/png'],
    ['.jpg', 'jpg', 'image/jpeg'],
    ['.jpeg', 'jpg', 'image/jpeg'],
    ['.webp', 'webp', 'image/webp'],
  ];

  for (const [input, extension, mimeType] of cases) {
    const image = createImageKey('article', `image${input}`, bytes);
    assert.equal(image.key.endsWith(`.${extension}`), true);
    assert.equal(image.mimeType, mimeType);
  }
});

test('rejects unsupported image formats', () => {
  assert.throws(() => createImageKey('article', 'image.svg', bytes), /Unsupported image format/);
});

test('uses the same key for the same bytes', () => {
  assert.equal(
    createImageKey('article', 'image.png', bytes).key,
    createImageKey('article', 'image.png', Buffer.from('hello')).key,
  );
});

test('uses a different key for different bytes', () => {
  assert.notEqual(
    createImageKey('article', 'image.png', bytes).key,
    createImageKey('article', 'image.png', Buffer.from('world')).key,
  );
});
