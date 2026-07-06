import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { SavingsRateChart } from "./chart/SavingsRate/SavingsRateChart";
import { SavingsDebtByAgeChart } from "./chart/SavingsDebtByAge/SavingsDebtByAgeChart";
import { DebtByAgeTrendChart } from "./chart/DebtByAgeTrend/DebtByAgeTrendChart";
import styles from "./page.module.css";

export default function SavingsPage() {
  // 記事の一覧から該当する記事メタデータを取得する
  const article = articles.find((a) => a.href === "/articles/savings");
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事の共通ヘッダー */}
      <ArticleHeader article={article} />

      <div className={styles.charts}>
        {/* チャート①：貯蓄率の推移 */}
        <ArticleChart
          title="家計の貯蓄率の推移（1994〜2024年度）"
          source="内閣府「国民経済計算 家計貯蓄率」"
          sourceUrl="https://www.esri.cao.go.jp/jp/sna/menu.html"
        >
          <SavingsRateChart />
        </ArticleChart>

        {/* チャート②：年齢階級別の貯蓄と負債 */}
        <ArticleChart
          title="年齢階級別の貯蓄と負債"
          source="総務省「家計調査報告（貯蓄・負債編）」"
          sourceUrl="https://www.stat.go.jp/data/sav/sokuhou/nen/index.html"
        >
          <SavingsDebtByAgeChart />
        </ArticleChart>

        {/* チャート③：年齢階級別 負債額の推移 */}
        <ArticleChart
          title="年齢階級別 負債額の推移（2002〜2025年）"
          source="総務省「家計調査報告（貯蓄・負債編）」"
          sourceUrl="https://www.stat.go.jp/data/sav/sokuhou/nen/index.html"
        >
          <DebtByAgeTrendChart />
        </ArticleChart>
      </div>
    </div>
  );
}
