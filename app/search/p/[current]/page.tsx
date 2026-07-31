import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getList } from '@/libs/microcms';
import { ARTICLE_LIMIT, normalizeSearchQuery, parsePage, PRODUCTION_ORIGIN } from '@/constants';
import ArticleList from '@/components/ArticleList';
import Pagination from '@/components/Pagination';

type Props = {
  params: Promise<{ current: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { current } = await props.params;
  const query = normalizeSearchQuery((await props.searchParams).q);
  return {
    title: query ? `「${query}」の検索結果` : '記事検索',
    alternates: {
      canonical: `${PRODUCTION_ORIGIN}/blog/search/p/${current}${query ? `?q=${encodeURIComponent(query)}` : ''}`,
    },
    robots: { index: false, follow: true },
  };
}

export default async function Page(props: Props) {
  const { current: rawCurrent } = await props.params;
  const query = normalizeSearchQuery((await props.searchParams).q);
  const current = parsePage(rawCurrent);
  if (!current) {
    notFound();
  }

  const data = await getList({
    limit: ARTICLE_LIMIT,
    offset: ARTICLE_LIMIT * (current - 1),
    ...(query ? { q: query } : {}),
  });
  if (current > Math.max(1, Math.ceil(data.totalCount / ARTICLE_LIMIT))) {
    notFound();
  }

  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} current={current} basePath="/search" q={query} />
    </>
  );
}
