import Link from 'next/link';
import { ARTICLE_LIMIT } from '@/constants';
import styles from './index.module.css';

type Props = {
  totalCount: number;
  current?: number;
  basePath?: string;
  q?: string;
};

export default function Pagination({ totalCount, current = 1, basePath = '', q }: Props) {
  const pageCount = Math.ceil(totalCount / ARTICLE_LIMIT);
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav aria-label="ページネーション">
      <ul className={styles.container}>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => {
          const query = q ? `?${new URLSearchParams({ q }).toString()}` : '';
          const href = `${basePath}/p/${page}${query}`;
          return (
            <li className={styles.list} key={page}>
              {current === page ? (
                <span className={`${styles.item} ${styles.current}`} aria-current="page">
                  {page}
                </span>
              ) : (
                <Link href={href} className={styles.item}>
                  {page}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
