import { createClient } from 'microcms-js-sdk';
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  MicroCMSContentId,
} from 'microcms-js-sdk';
import { notFound } from 'next/navigation';

// タグの型定義
export type Tag = {
  name?: string;
} & MicroCMSContentId &
  MicroCMSDate;

// ライターの型定義
export type Writer = {
  name?: string;
  profile?: string;
  image?: MicroCMSImage;
} & MicroCMSContentId &
  MicroCMSDate;

// ブログの型定義
export type Blog = {
  title?: string;
  description?: string;
  content?: string;
  thumbnail?: MicroCMSImage;
  tags: Tag[];
  writer: Writer | null;
};

export type Article = Blog & MicroCMSContentId & MicroCMSDate;

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

// ブログ一覧を取得
export const getList = async (queries?: MicroCMSQueries) => {
  const listData = await getClient()
    .getList<Blog>({
      endpoint: 'blog',
      queries,
    })
    .catch(notFound);
  return listData;
};

// ブログの詳細を取得
export const getDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await getClient()
    .getListDetail<Blog>({
      endpoint: 'blog',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};

// タグの一覧を取得
export const getTagList = async (queries?: MicroCMSQueries) => {
  const listData = await getClient()
    .getList<Tag>({
      endpoint: 'tags',
      queries,
    })
    .catch(notFound);

  return listData;
};

// タグの詳細を取得
export const getTag = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await getClient()
    .getListDetail<Tag>({
      endpoint: 'tags',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};
