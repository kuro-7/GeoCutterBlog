import { getList } from '@/libs/microcms';
import { ARTICLE_LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import styles from './layout.module.css';

export default async function Page() {
  const data = await getList({ limit: ARTICLE_LIMIT });

  return (
    <>
      <header>
        <h1>GeoCutter 攻略・解説ブログ</h1>
        <p className={styles.lead}>
          人口で地図を切るゲーム「GeoCutter」の遊び方、攻略、地理・人口データの見方を、公式チームがわかりやすく紹介します。
        </p>
      </header>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} />
    </>
  );
}
