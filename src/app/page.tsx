import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.intro}>
          <p className={styles.eyebrow}>Public data, made readable</p>
          <h1>Beautiful Japan Numbers</h1>
          <p>
            日本の数字を、流れと関係が見えるかたちで眺めるための小さな可視化集です。
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
