import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { CpiIndexChart } from "@/app/(main)/articles/inflation-overview/charts/CpiIndexChart";
import { CpiYoyChart } from "@/app/(main)/articles/inflation-overview/charts/CpiYoyChart";
import cpiData from "@/data/cpi-japan.json";
import type { CpiJson } from "@/types/cpi";
import styles from "./page.module.css";

const data = cpiData as CpiJson;

export default function InflationOverviewPage() {
  const article = articles.find((a) => a.href === "/articles/inflation-overview");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />
      <div className={styles.charts}>
        <ArticleChart
          title="物価水準の推移（1990〜2025年）"
          source={data.meta.source}
          sourceUrl={data.meta.sourceUrl}
        >
          <CpiIndexChart data={data.index} />
          <dl className={styles.seriesNotes}>
            <div>
              <dt>総合</dt>
              <dd>家計が購入する幅広い商品・サービス全体の物価動向。</dd>
            </div>
            <div>
              <dt>コア</dt>
              <dd>総合から天候要因で変動しやすい生鮮食品を除いた指数。</dd>
            </div>
            <div>
              <dt>コアコア</dt>
              <dd>食料とエネルギーを除き、基調的な物価変化を見やすくした指数。</dd>
            </div>
          </dl>
        </ArticleChart>
        <ArticleChart
          title="インフレ率の推移（前年比、1990〜2025年）"
          source={data.meta.source}
          sourceUrl={data.meta.sourceUrl}
        >
          <CpiYoyChart data={data.yoy} />
        </ArticleChart>
      </div>
    </div>
  );
}
