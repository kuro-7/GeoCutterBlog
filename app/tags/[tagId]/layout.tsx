import { getTag } from '@/libs/microcms';
import TagListItem from '@/components/TagListItem';
import styles from './layout.module.css';

type Props = {
  children: React.ReactNode;
  params: Promise<{ tagId: string }>;
};

export default async function TagsLayout({ children, params }: Props) {
  const tag = await getTag((await params).tagId);

  return (
    <div>
      <p className={styles.title}>
        <TagListItem tag={tag} hasLink={false} /> の記事一覧
      </p>
      {children}
    </div>
  );
}
