import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <p className={styles.eyebrow}>Public data, made readable</p>
          <h1>美しい日本の数字</h1>
          <p className={styles.lead}>
            日本に関する統計データを、流れと関係が見えるかたちで眺めます。
            非党派的で、出典に戻れる市民データメディアです。
          </p>
          <div className={styles.actions}>
            <a className="button-primary" href="/government-spending">
              政府支出を見る
            </a>
            <a className="button-secondary" href="/population">
              人口変化を見る
            </a>
          </div>
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
