import { Page } from "@/components/layout/Page";
import PopulationCharts from "./PopulationCharts";
import styles from "./page.module.css";

export const metadata = {
  title: "人口変化 | 美しい日本の数字",
};

export default function PopulationPage() {
  return (
    <Page>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.topic}>人口</p>
          <h1>日本の人口はどれくらいのペースで減っているか？</h1>
          <p className={styles.lead}>
            総人口、出生数、死亡数、国際移動の変化を並べて、人口減少の速度と内訳を確認します。
          </p>
          <p className={styles.sourceLabel}>出典: 総務省統計局、厚生労働省</p>
        </header>

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
    </Page>
  );
}
