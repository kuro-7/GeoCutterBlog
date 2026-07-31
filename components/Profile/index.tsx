import { Writer } from '@/libs/microcms';
import R2Image from '../R2Image';
import styles from './index.module.css';

type Props = {
  writer: Writer;
};

export default function Profile({ writer }: Props) {
  return (
    <section className={styles.wrapper} aria-label="著者プロフィール">
      {writer.imageUrl && writer.imageAlt && (
        <R2Image
          src={writer.imageUrl}
          alt={writer.imageAlt}
          className={styles.icon}
          sizes="96px"
          fallbackWidth={480}
        />
      )}
      <div className={styles.content}>
        <p className={styles.name}>{writer.name}</p>
        <p className={styles.profile}>{writer.profile}</p>
      </div>
    </section>
  );
}
