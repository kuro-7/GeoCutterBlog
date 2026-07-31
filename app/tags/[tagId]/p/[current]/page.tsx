import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getList, getTag } from '@/libs/microcms';
import { ARTICLE_LIMIT, parsePage, PRODUCTION_ORIGIN } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';

type Props = {
  params: Promise<{ tagId: string; current: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { tagId, current } = await props.params;
  const tag = await getTag(tagId);
  return {
    title: tag.name,
    openGraph: { title: tag.name },
    alternates: { canonical: `${PRODUCTION_ORIGIN}/blog/tags/${tagId}/p/${current}` },
    robots: { index: false, follow: true },
  };
}

export default async function Page({ params }: Props) {
  const { tagId, current: rawCurrent } = await params;
  const current = parsePage(rawCurrent);
  if (!current) {
    notFound();
  }

  const data = await getList({
    limit: ARTICLE_LIMIT,
    offset: ARTICLE_LIMIT * (current - 1),
    filters: `tags[contains]${tagId}`,
  });
  if (current > Math.max(1, Math.ceil(data.totalCount / ARTICLE_LIMIT))) {
    notFound();
  }

  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} current={current} basePath={`/tags/${tagId}`} />
    </>
  );
}
