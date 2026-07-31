import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getList } from '@/libs/microcms';
import { ARTICLE_LIMIT, parsePage, PRODUCTION_ORIGIN } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';

type Props = {
  params: Promise<{ current: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { current } = await props.params;
  return {
    alternates: {
      canonical: `${PRODUCTION_ORIGIN}/blog/p/${current}`,
    },
    robots: { index: false, follow: true },
  };
}

export default async function Page(props: Props) {
  const { current: rawCurrent } = await props.params;
  const current = parsePage(rawCurrent);
  if (!current) {
    notFound();
  }

  const data = await getList({
    limit: ARTICLE_LIMIT,
    offset: ARTICLE_LIMIT * (current - 1),
  });
  if (current > Math.max(1, Math.ceil(data.totalCount / ARTICLE_LIMIT))) {
    notFound();
  }

  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} current={current} />
    </>
  );
}
