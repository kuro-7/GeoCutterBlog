import { cache } from 'react';
import { notFound } from 'next/navigation.js';
import { createClient } from 'microcms-js-sdk';
import type { MicroCMSContentId, MicroCMSQueries } from 'microcms-js-sdk';
import { ARTICLE_LIMIT, TAG_LIMIT } from '../constants/index.ts';

type CMSDates = {
  createdAt: string;
  updatedAt: string;
};

type PublishedCMSDates = CMSDates & {
  publishedAt: string;
  revisedAt: string;
};

export type Tag = MicroCMSContentId & PublishedCMSDates & {
  name: string;
};

export type Writer = MicroCMSContentId & PublishedCMSDates & {
  name: string;
  profile: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type TagSummary = Pick<Tag, 'id' | 'name'>;

export type ArticleSummary = MicroCMSContentId & {
  title: string;
  description: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  tags: TagSummary[];
  writer: Pick<Writer, 'id' | 'name'>;
  createdAt: string;
  publishedAt: string;
  revisedAt: string;
};

export type Article = MicroCMSContentId & CMSDates & {
  title: string;
  description: string;
  body: string;
  thumbnailUrl: string;
  thumbnailAlt: string;
  tags: Tag[];
  writer: Writer;
  publishedAt?: string;
  revisedAt?: string;
};

const ARTICLE_LIST_FIELDS = 'id,title,description,thumbnailUrl,thumbnailAlt,tags.id,tags.name,writer.id,writer.name,publishedAt,revisedAt,createdAt';
const ARTICLE_DETAIL_FIELDS = `${ARTICLE_LIST_FIELDS},body,tags.createdAt,tags.updatedAt,tags.publishedAt,tags.revisedAt,writer.createdAt,writer.updatedAt,writer.publishedAt,writer.revisedAt,writer.profile,writer.imageUrl,writer.imageAlt,updatedAt`;
const TAG_FIELDS = 'id,name,createdAt,updatedAt,publishedAt,revisedAt';

type CMSListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function validateListResponse<T>(value: unknown): CMSListResponse<T> {
  if (
    !isRecord(value) ||
    !Array.isArray(value.contents) ||
    typeof value.totalCount !== 'number' ||
    !Number.isInteger(value.totalCount) ||
    value.totalCount < 0 ||
    typeof value.offset !== 'number' ||
    !Number.isInteger(value.offset) ||
    value.offset < 0 ||
    typeof value.limit !== 'number' ||
    !Number.isInteger(value.limit) ||
    value.limit < 0
  ) {
    throw new Error('Invalid microCMS list response');
  }

  return value as CMSListResponse<T>;
}

function validateDetailResponse<T>(value: unknown): T {
  if (!isRecord(value) || typeof value.id !== 'string' || value.id.length === 0) {
    throw new Error('Invalid microCMS detail response');
  }

  return value as T;
}

const getClient = () => {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;

  if (!serviceDomain) {
    throw new Error('MICROCMS_SERVICE_DOMAIN is required');
  }
  if (!apiKey) {
    throw new Error('MICROCMS_API_KEY is required');
  }

  return createClient({ serviceDomain, apiKey });
};

export const getList = async <T = ArticleSummary>(queries?: MicroCMSQueries) => {
  const data = await getClient()
    .getList<T>({
      endpoint: 'blog',
      queries: {
        ...queries,
        orders: queries?.orders || '-publishedAt',
        limit: queries?.limit || ARTICLE_LIMIT,
        fields: queries?.fields || ARTICLE_LIST_FIELDS,
      },
    })
    .catch(notFound);
  return validateListResponse<T>(data);
};

export const getDetail = cache(async (contentId: string, draftKey?: string) => {
  const data = await getClient()
    .getListDetail<Article>({
      endpoint: 'blog',
      contentId,
      queries: {
        fields: ARTICLE_DETAIL_FIELDS,
        ...(draftKey ? { draftKey } : {}),
      },
    })
    .catch(notFound);
  return validateDetailResponse<Article>(data);
});

export const getTagList = async (queries?: MicroCMSQueries) => {
  const data = await getClient()
    .getList<Tag>({
      endpoint: 'tags',
      queries: {
        ...queries,
        limit: queries?.limit || TAG_LIMIT,
        orders: queries?.orders || 'name',
        fields: queries?.fields || TAG_FIELDS,
      },
    })
    .catch(notFound);
  return validateListResponse<Tag>(data);
};

export const getTag = cache(async (contentId: string) => {
  const data = await getClient()
    .getListDetail<Tag>({
      endpoint: 'tags',
      contentId,
      queries: { fields: TAG_FIELDS },
    })
    .catch(notFound);
  return validateDetailResponse<Tag>(data);
});
