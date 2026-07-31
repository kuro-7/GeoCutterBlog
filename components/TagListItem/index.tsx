import Link from 'next/link';
import { TagSummary } from '@/libs/microcms';
import styles from './index.module.css';

type Props = {
  tag: TagSummary;
  hasLink?: boolean;
};

export default function TagListItem({ tag, hasLink = true }: Props) {
  const content = `#${tag.name}`;
  if (!hasLink) {
    return <span className={styles.tag}>{content}</span>;
  }
  return (
    <Link href={`/tags/${tag.id}`} className={styles.tag}>
      {content}
    </Link>
  );
}
