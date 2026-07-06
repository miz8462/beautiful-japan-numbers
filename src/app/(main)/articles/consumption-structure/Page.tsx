import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ExpenditureShareChart } from "./charts/ExpenditureShare/ExpenditureShareChart";
import { EngelCoefficientChart } from "./charts/EngelCoefficient/EngelCoefficientChart";
import styles from "./page.module.css";

export default function ConsumptionStructurePage() {
  const article = articles.find((a) => a.href === "/articles/consumption-structure");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <div className={styles.charts}>
        <ArticleChart title="費目別シェアの推移（2000〜2025年）">
          <ExpenditureShareChart />
        </ArticleChart>

        <ArticleChart title="エンゲル係数の推移（2000〜2025年）">
          <EngelCoefficientChart />
        </ArticleChart>
      </div>
    </div>
  );
}
