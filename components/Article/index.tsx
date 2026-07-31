import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type Article } from '@/libs/microcms';
import { DEFAULT_OG_IMAGE, PRODUCTION_ORIGIN } from '@/constants';
import { getAllowedImageUrl } from '@/libs/image';
import Date, { formatDate } from '../Date';
import Profile from '../Profile';
import R2Image from '../R2Image';
import TagList from '../TagList';
import styles from './index.module.css';

type Props = {
  data: Article;
  slug: string;
};

export default function Article({ data, slug }: Props) {
  const thumbnailUrl = getAllowedImageUrl(data.thumbnailUrl) || DEFAULT_OG_IMAGE;
  const canonicalUrl = `${PRODUCTION_ORIGIN}/blog/articles/${slug}`;
  const showRevisedDate = Boolean(data.publishedAt && data.revisedAt && formatDate(data.publishedAt) !== formatDate(data.revisedAt));
  const jsonLd = data.publishedAt
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: data.title,
        description: data.description,
        image: thumbnailUrl,
        datePublished: data.publishedAt,
        dateModified: data.revisedAt || data.publishedAt,
        author: {
          '@type': 'Person',
          name: data.writer.name,
        },
        publisher: {
          '@type': 'Organization',
          name: 'GeoCutter',
        },
        mainEntityOfPage: canonicalUrl,
      }
    : null;

  return (
    <article className={styles.main}>
      <h1 className={styles.title}>{data.title}</h1>
      <p className={styles.description}>{data.description}</p>
      <TagList tags={data.tags} />
      <div className={styles.meta}>
        <p>著者: {data.writer.name}</p>
        {data.publishedAt ? (
          <Date date={data.publishedAt} label="公開日" />
        ) : (
          <>
            <span className={styles.draft}>下書き</span>
            <Date date={data.createdAt} label="作成日" />
          </>
        )}
        {showRevisedDate && data.revisedAt && (
          <Date date={data.revisedAt} label="更新日" />
        )}
      </div>
      <R2Image
        src={data.thumbnailUrl}
        alt={data.thumbnailAlt}
        className={styles.thumbnail}
        sizes="(max-width: 960px) calc(100vw - 32px), 960px"
        loading="eager"
        fetchPriority="high"
      />
      <div className={styles.content}>
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt }) => (
              <R2Image
                src={typeof src === 'string' ? src : undefined}
                alt={alt || '本文画像'}
                className={styles.markdownImage}
                sizes="(max-width: 760px) calc(100vw - 32px), 760px"
              />
            ),
          }}
        >
          {data.body}
        </Markdown>
      </div>
      <Profile writer={data.writer} />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}
    </article>
  );
}
