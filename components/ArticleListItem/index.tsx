import Link from 'next/link';
import { ArticleSummary } from '@/libs/microcms';
import R2Image from '../R2Image';
import TagList from '../TagList';
import Date from '../Date';
import styles from './index.module.css';

type Props = {
  article: ArticleSummary;
};

export default function ArticleListItem({ article }: Props) {
  return (
    <li className={styles.list}>
      <Link href={`/articles/${article.id}`} className={styles.link}>
        <R2Image
          src={article.thumbnailUrl}
          alt={article.thumbnailAlt}
          className={styles.image}
          sizes="(max-width: 640px) calc(100vw - 32px), 240px"
          fallbackWidth={480}
        />
        <div className={styles.content}>
          <h2 className={styles.title}>{article.title}</h2>
          <p className={styles.description}>{article.description}</p>
          <TagList tags={article.tags} hasLink={false} />
          <Date date={article.publishedAt} label="公開日" />
          <p className={styles.writer}>著者: {article.writer.name}</p>
        </div>
      </Link>
    </li>
  );
}
