import Link from 'next/link';
import styles from './index.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" aria-label="GeoCutter Blogトップ">
            <img src="/blog/geocutter-logo.png" alt="GeoCutter" className={styles.logo} />
          </Link>
          <span className={styles.name}>GeoCutter Blog</span>
        </div>
        <nav className={styles.links} aria-label="メイン">
          <Link href="/">ブログ</Link>
          <a href="/play">ゲームを遊ぶ</a>
        </nav>
      </div>
    </header>
  );
}
