import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="card-container">
          <p className={styles.headline}>
            偏見やイメージではなく、信頼できるデータから、日本の今を見つめよう。
          </p>

        </div>
      </section>

      <section className={styles.section} id="topics">
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.chip}>公開中</p>
            <h2>トピック</h2>
          </div>
          <div className={styles.grid}>
            <a className={styles.card} href="/government-spending">
              <p className={styles.cardLabel}>Government spending</p>
              <h3>政府支出</h3>
              <p>歳入から歳出までの流れを、主要項目ごとの関係で確認します。</p>
            </a>
            <a className={styles.card} href="/population">
              <p className={styles.cardLabel}>Population</p>
              <h3>人口変化</h3>
              <p>総人口、出生数、死亡数、国際移動の変化を並べて確認します。</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
