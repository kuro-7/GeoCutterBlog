import { ArticleSummary } from '@/libs/microcms';
import ArticleListItem from '../ArticleListItem';

type Props = {
  articles: ArticleSummary[];
};

export default function ArticleList({ articles }: Props) {
  if (articles.length === 0) {
    return <p>記事を準備中です。公開まで少しお待ちください。</p>;
  }

  return (
    <ul>
      {articles.map((article) => (
        <ArticleListItem key={article.id} article={article} />
      ))}
    </ul>
  );
}
