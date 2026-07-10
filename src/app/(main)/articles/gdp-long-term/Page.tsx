import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { GdpCompositionChart } from "./charts/GdpCompositionChart/GdpCompositionChart";
import { GdpTrendChart } from "./charts/GdpTrendChart/GdpTrendChart";
import styles from "./page.module.css";

export default function GdpLongTermPage() {
  const article = articles.find((a) => a.href === "/articles/gdp-long-term");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <div className={styles.charts}>
        <ArticleChart title="名目GDP・実質GDPの推移（1980〜2024年度）">
          <GdpTrendChart />
        </ArticleChart>

        <ArticleChart title="支出項目別構成比の推移（1980〜2024年度）">
          <GdpCompositionChart />
        </ArticleChart>
      </div>
    </div>
  );
}
