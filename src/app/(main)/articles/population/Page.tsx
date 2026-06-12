import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/ui/ArticleHeader/ArticleHeader";
import PopulationCharts from "./PopulationCharts";
import styles from "./page.module.css";

export default function PopulationPage() {
  const article = articles.find((a) => a.href === "/articles/population");
  if (!article) return null;
  return (
    <div>
      <div className="container">
        <ArticleHeader article={article} />
        <section className={styles.kpiSection} aria-labelledby="population-kpi">
          <div className={styles.kpiMain}>
            <h2 id="population-kpi">年間人口減少数（2024年）</h2>
            <p className={styles.kpiValue}>−58万人</p>
          </div>

          <div className={styles.kpiGrid}>
            <div className={styles.kpiCard}>
              <p>出生数</p>
              <strong>68万人</strong>
            </div>
            <div className={styles.kpiCard}>
              <p>死亡数</p>
              <strong>160万人</strong>
            </div>
            <div className={styles.kpiCard}>
              <p>社会増（国際移動）</p>
              <strong>+34万人</strong>
            </div>
          </div>
        </section>
        <PopulationCharts />
      </div>
    </div>
  );
}
