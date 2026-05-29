import SankeyChart, { type GovernmentSpendingData } from "@/components/SankeyChart";
import governmentSpendingData from "../../../public/data/government-spending.json";
import styles from "./page.module.css";

export const metadata = {
  title: "政府支出 | 美しい日本の数字",
};

export default function Page() {
  const data = governmentSpendingData as GovernmentSpendingData;

  return (
    <main className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <p className={styles.topic}>政府支出</p>
          <h1>政府支出の流れ</h1>
          <p className={styles.lead}>
            国の一般会計について、歳入から歳出までのつながりをサンキー図で確認します。
            項目に触れると、関連する流れと割合が強調されます。
          </p>
        </header>

        <section className={styles.visualization} aria-labelledby="government-spending-headline">
          <div className={styles.articleColumn}>
            <h2 className={styles.statHeadline} id="government-spending-headline">
              2024年度、一般会計の歳入と歳出の関係を主要項目ごとに可視化
            </h2>
            <p className={styles.sourceLabel}>Source: 財務省「予算・決算 統計表一覧」</p>
          </div>

          <div className={styles.chartBand}>
            <SankeyChart data={data} />
          </div>

          <p className={styles.sourceNote}>
            <a
              href="https://www.mof.go.jp/policy/budget/reference/statistics/data.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              財務省「予算・決算 統計表一覧」を開く
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
