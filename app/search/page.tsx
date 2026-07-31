import type { Metadata } from 'next';
import { getList } from '@/libs/microcms';
import { ARTICLE_LIMIT, normalizeSearchQuery, PRODUCTION_ORIGIN } from '@/constants';
import ArticleList from '@/components/ArticleList';
import Pagination from '@/components/Pagination';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const query = normalizeSearchQuery((await props.searchParams).q);
  return {
    title: query ? `「${query}」の検索結果` : '記事検索',
    alternates: {
      canonical: `${PRODUCTION_ORIGIN}/blog/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
    },
    robots: { index: false, follow: true },
  };
}

export default async function Page(props: Props) {
  const query = normalizeSearchQuery((await props.searchParams).q);
  const data = await getList({
    limit: ARTICLE_LIMIT,
    ...(query ? { q: query } : {}),
  });

  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} basePath="/search" q={query} />
    </>
  );
}
