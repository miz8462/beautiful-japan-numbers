import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { DisposableIncomeRealVsNominalChart } from "./charts/DisposableIncomeRealVsNominal/DisposableIncomeRealVsNominalChart";
import { NonConsumptionBurdenRateChart } from "./charts/NonconsumptionBurdenRate/NonConsumptionBurdenRateChart";
import IncomeChart from "./charts/IncomeChart";
import styles from "./page.module.css";

export default function DisposableIncomePage() {
  const article = articles.find((a) => a.href === "/articles/disposable-income");
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事の共通ヘッダー */}
      <ArticleHeader article={article} />

      <div className={styles.charts}>
        {/* チャート①：実収入の推移 */}
        <ArticleChart
          title="勤労者世帯の実収入の推移（1989〜2024年）"
          source="総務省統計局「家計調査」二人以上の世帯のうち勤労者世帯（年報 第1-2表）"
          sourceUrl="https://www.stat.go.jp/data/kakei/longtime/index.html"
        >
          <IncomeChart />
        </ArticleChart>

        {/* チャート②：名目・実質可処分所得の比較 */}
        <ArticleChart
          title="可処分所得の名目・実質比較（1990〜2024年）"
          source="総務省統計局「家計調査」二人以上の世帯のうち勤労者世帯 ／ 総務省「消費者物価指数」（2020年基準）"
          sourceUrl="https://www.stat.go.jp/data/kakei/longtime/index.html"
        >
          <DisposableIncomeRealVsNominalChart />
        </ArticleChart>
      </div>

      {/* チャート③：非消費支出（税・社会保険料）負担率の推移 */}
      <ArticleChart
        title="非消費支出（税・社会保険料）の実収入比率（1989〜2024年）"
        source="総務省統計局「家計調査」二人以上の世帯のうち勤労者世帯（年報 第1-2表）"
        sourceUrl="https://www.stat.go.jp/data/kakei/longtime/index.html"
      >
        <NonConsumptionBurdenRateChart />
      </ArticleChart>
    </div>
  );
}
