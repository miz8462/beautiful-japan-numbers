import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { articles } from "../articles";
import { ArticleChart } from "@/components/article/article-chart";
import SmdGapVsPrGapChart from "./chart/SmdGapVsPrGapChart/SmdGapVsPrGapChart";
import GapChart from "./chart/SmdPrGapChart/SmdPrGapChart";
import SmdVsPrChart from "./chart/SmdPrGapChart/SmdVsPrChart/SmdVsPrChart";
import styles from "./page.module.css";

export default function ElectionSmdVsPrPage() {
  const article = articles.find(
    (a) => a.href === "/articles/election-smd-vs-pr"
  );
  if (!article) return null;

  return (
    <div>
      <div className="container">
        <ArticleHeader article={article} />
        <div className={styles.charts}>
          <ArticleChart
            title="小選挙区の獲得議席割合は比例得票率と大きく乖離する"
            source="総務省「衆議院議員総選挙結果調」"
            sourceUrl="https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html"
          >
            <SmdVsPrChart />
          </ArticleChart>

          <ArticleChart
            title="(小選挙区獲得議席割合) − (比例得票率)"
            source="総務省「衆議院議員総選挙結果調」"
            sourceUrl="https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html"
          >
            <GapChart />
          </ArticleChart>

          <ArticleChart
            title="小選挙区獲得議席割合の差、比例得票率の差"
            source="総務省「衆議院議員総選挙結果調」"
            sourceUrl="https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html"
          >
            <SmdGapVsPrGapChart />
          </ArticleChart>
        </div>
      </div>
    </div>
  );
}
