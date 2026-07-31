import type { Metadata } from 'next';
import { getList, getTag } from '@/libs/microcms';
import { ARTICLE_LIMIT, PRODUCTION_ORIGIN } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';

type Props = {
  params: Promise<{ tagId: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { tagId } = await props.params;
  const tag = await getTag(tagId);
  return {
    title: tag.name,
    openGraph: { title: tag.name },
    alternates: { canonical: `${PRODUCTION_ORIGIN}/blog/tags/${tagId}` },
    robots: { index: false, follow: true },
  };
}

export default async function Page({ params }: Props) {
  const { tagId } = await params;
  const data = await getList({
    limit: ARTICLE_LIMIT,
    filters: `tags[contains]${tagId}`,
  });

  return (
    <>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} basePath={`/tags/${tagId}`} />
    </>
  );
}
