import styles from './index.module.css';

export default function SearchField() {
  return (
    <form className={styles.form} method="get" action="/blog/search">
      <label className={styles.label} htmlFor="blog-search">
        記事を検索
      </label>
      <input
        id="blog-search"
        type="search"
        name="q"
        className={styles.search}
        placeholder="キーワードで検索"
        maxLength={100}
      />
      <button type="submit" className={styles.button}>
        検索
      </button>
    </form>
  );
}
