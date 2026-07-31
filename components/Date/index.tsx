import styles from './index.module.css';

const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
  timeZone: 'Asia/Tokyo',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

export const formatDate = (value: string) => dateFormatter.format(new globalThis.Date(value));

type Props = {
  date: string;
  label?: string;
};

export default function Date({ date, label }: Props) {
  return (
    <time className={styles.date} dateTime={date}>
      {label ? `${label}: ` : ''}
      {formatDate(date)}
    </time>
  );
}
