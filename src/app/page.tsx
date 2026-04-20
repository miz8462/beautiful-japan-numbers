import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.intro}>
          <p className={styles.eyebrow}>Public data, made readable</p>
          <h1>美しい日本の数字</h1>
          <p>
            日本に関する統計データを、流れと関係が見えるかたちで眺めます
          </p>
        </section>

        <nav className={styles.links} aria-label="Available visualizations">
          <a className={styles.primary} href="/government-spending">
            政府支出を見る
          </a>
        </nav>
      </main>
    </div>
  );
}
