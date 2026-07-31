import type { Metadata } from 'next';
import { getTagList } from '@/libs/microcms';
import { DEFAULT_OG_IMAGE, PRODUCTION_ORIGIN, TAG_LIMIT } from '@/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import './globals.css';
import styles from './layout.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(PRODUCTION_ORIGIN),
  title: {
    template: '%s | GeoCutter 攻略・解説ブログ',
    default: 'GeoCutter 攻略・解説ブログ',
  },
  description: '人口で地図を切るゲーム「GeoCutter」の遊び方、攻略、地理・人口データを紹介する公式ブログです。',
  openGraph: {
    title: 'GeoCutter 攻略・解説ブログ',
    description: '人口で地図を切るゲーム「GeoCutter」の遊び方、攻略、地理・人口データを紹介する公式ブログです。',
    url: `${PRODUCTION_ORIGIN}/blog`,
    siteName: 'GeoCutter 攻略・解説ブログ',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    canonical: `${PRODUCTION_ORIGIN}/blog`,
  },
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const tags = await getTagList({ limit: TAG_LIMIT });

  return (
    <html lang="ja">
      <body>
        <Header />
        <Nav tags={tags.contents} />
        <main className={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
