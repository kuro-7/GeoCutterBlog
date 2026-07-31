import Link from 'next/link';
import styles from './index.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <nav aria-label="フッター">
        <Link href="/">GeoCutter</Link>
        <a href="/play">ゲームを遊ぶ</a>
        <a href="/legal/terms">利用規約</a>
        <a href="/legal/privacy">プライバシーポリシー</a>
      </nav>
      <p>© GeoCutter</p>
    </footer>
  );
}
