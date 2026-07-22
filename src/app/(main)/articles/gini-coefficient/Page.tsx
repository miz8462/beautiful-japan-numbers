import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { GiniTrendChart } from "./chart/gini-trend/GiniTrendChart";
import { GiniImprovementChart } from "./chart/gini-improvement/GiniImprovementChart";
import styles from "./page.module.css";
import { ArticleText } from "@/components/article/article-intro/ArticleIntro";

export default function GiniCoefficientPage() {
  const article = articles.find((a) => a.href === "/articles/gini-coefficient");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />
      <ArticleText>
        ジニ係数とは、社会の中で、所得(収入)がどれくらい均等に分かれているかを表す指標です。
        0〜1の数字で表され、全員の所得が同じなら0、一人が独占していれば1に近づきます。
        0に近いほど格差が小さく、1に近いほど格差が大きい、という数字です。
      </ArticleText>
      <div className={styles.charts}>
        <ArticleChart title="当初所得と再分配所得のジニ係数推移（1962〜2023年度）">
          <GiniTrendChart />
        </ArticleChart>

        <ArticleChart title="所得再分配による改善度の推移（1962〜2023年度）">
          <GiniImprovementChart />
        </ArticleChart>
      </div>
    </div>
  );
}
