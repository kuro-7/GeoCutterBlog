import assert from 'node:assert/strict';
import { mock, test } from 'node:test';
import { NextRequest } from 'next/server.js';
import { middleware } from '../middleware.ts';

let moduleCounter = 0;

function installClient(client) {
  mock.module('microcms-js-sdk', {
    exports: {
      createClient: () => client,
    },
  });
}

async function importMicrocms(label) {
  moduleCounter += 1;
  return import(`../libs/microcms.ts?${label}-${moduleCounter}`);
}

function setCmsEnvironment({ domain = 'example', apiKey = 'test-key' } = {}) {
  process.env.MICROCMS_SERVICE_DOMAIN = domain;
  process.env.MICROCMS_API_KEY = apiKey;
}

async function expectNotFound(action) {
  await assert.rejects(action, (error) =>
    String(error?.digest ?? '').includes('NEXT_HTTP_ERROR_FALLBACK;404'),
  );
}

test('fails closed when the microCMS service domain is missing', async () => {
  setCmsEnvironment({ domain: '', apiKey: 'test-key' });
  installClient({});
  const { getList } = await importMicrocms('missing-domain');

  await assert.rejects(getList(), /MICROCMS_SERVICE_DOMAIN is required/);
  mock.restoreAll();
});

test('fails closed when the microCMS API key is missing', async () => {
  setCmsEnvironment({ domain: 'example', apiKey: '' });
  installClient({});
  const { getList } = await importMicrocms('missing-api-key');

  await assert.rejects(getList(), /MICROCMS_API_KEY is required/);
  mock.restoreAll();
});

test('maps an article list request failure to notFound', async () => {
  setCmsEnvironment();
  installClient({ getList: async () => { throw new Error('CMS unavailable'); } });
  const { getList } = await importMicrocms('list-failure');

  await expectNotFound(getList());
  mock.restoreAll();
});

test('maps an article detail request failure to notFound', async () => {
  setCmsEnvironment();
  installClient({ getListDetail: async () => { throw new Error('CMS unavailable'); } });
  const { getDetail } = await importMicrocms('detail-failure');

  await expectNotFound(getDetail('article-1'));
  mock.restoreAll();
});

test('maps a tag detail request failure to notFound', async () => {
  setCmsEnvironment();
  installClient({ getListDetail: async () => { throw new Error('CMS unavailable'); } });
  const { getTag } = await importMicrocms('tag-failure');

  await expectNotFound(getTag('tag-1'));
  mock.restoreAll();
});

test('accepts an empty list but rejects malformed CMS response shapes', async () => {
  setCmsEnvironment();
  installClient({
    getList: async () => ({ contents: [], totalCount: 0, offset: 0, limit: 10 }),
  });
  const emptyModule = await importMicrocms('empty-list');
  await assert.deepEqual(await emptyModule.getList(), {
    contents: [],
    totalCount: 0,
    offset: 0,
    limit: 10,
  });
  mock.restoreAll();

  setCmsEnvironment();
  installClient({
    getList: async () => ({ contents: 'not-an-array', totalCount: 1, offset: 0, limit: 10 }),
  });
  const malformedModule = await importMicrocms('malformed-list');
  await assert.rejects(malformedModule.getList(), /Invalid microCMS list response/);
  mock.restoreAll();
});

test('marks staging responses as noindex and nofollow', () => {
  const response = middleware(new NextRequest('https://staging.geocutter.com/blog/articles/chapter-1'));

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
});

test('redirects draft query URLs and stores the draft key privately', () => {
  const response = middleware(new NextRequest(
    'https://geocutter.com/blog/articles/chapter-1?dk=temporary-draft',
  ));

  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get('location')).search, '');
  assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, noarchive');
  assert.equal(response.headers.get('Cache-Control'), 'private, no-store, max-age=0');
  assert.match(response.headers.get('set-cookie') ?? '', /geocutter_draft_key=temporary-draft/);
});
