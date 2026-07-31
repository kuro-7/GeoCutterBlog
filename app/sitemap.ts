import type { MetadataRoute } from 'next';
import { getList, type ArticleSummary } from '@/libs/microcms';
import { PRODUCTION_ORIGIN } from '@/constants';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getList<Pick<ArticleSummary, 'id' | 'publishedAt' | 'revisedAt'>>({
    limit: 100,
    fields: 'id,publishedAt,revisedAt',
  });

  // ponytail: fetch one page; paginate when published articles approach 100.
  const articles = data.contents
    .filter((article) => article.publishedAt)
    .map((article) => ({
      url: `${PRODUCTION_ORIGIN}/blog/articles/${article.id}`,
      lastModified: article.revisedAt || article.publishedAt,
    }));

  return [{ url: `${PRODUCTION_ORIGIN}/blog` }, ...articles];
}
