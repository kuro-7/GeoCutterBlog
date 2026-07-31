import type { Metadata } from 'next';
import { getDetail } from '@/libs/microcms';
import { DEFAULT_OG_IMAGE, PRODUCTION_ORIGIN } from '@/constants';
import { getAllowedImageUrl } from '@/libs/image';
import Article from '@/components/Article';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ dk?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { dk } = await props.searchParams;
  const data = await getDetail(params.slug, dk);
  const isDraft = !data.publishedAt;
  const thumbnailUrl = getAllowedImageUrl(data.thumbnailUrl) || DEFAULT_OG_IMAGE;
  const canonical = `${PRODUCTION_ORIGIN}/blog/articles/${params.slug}`;

  return {
    title: data.title,
    description: data.description,
    openGraph: {
      title: data.title,
      description: data.description,
      url: canonical,
      type: 'article',
      images: [thumbnailUrl],
      ...(data.publishedAt ? { publishedTime: data.publishedAt } : {}),
      ...(data.revisedAt ? { modifiedTime: data.revisedAt } : {}),
    },
    alternates: { canonical },
    robots: isDraft
      ? { index: false, follow: true, noarchive: true }
      : { index: true, follow: true },
  };
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { dk } = await props.searchParams;
  const data = await getDetail(params.slug, dk);

  return <Article data={data} slug={params.slug} />;
}
