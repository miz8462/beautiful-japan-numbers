import SankeyChart, { type GovernmentSpendingData } from "@/app/(main)/articles/government-spending/SankeyChart";
import { Page } from "@/components/layout/Page";
import { ArticleTags } from "@/components/ui/ArticleTag/ArticleTags";
import governmentSpendingData from "@/data/government-spending.json";
import styles from "./page.module.css";

export default function GovernmentSpendingPage() {
  const data = governmentSpendingData as GovernmentSpendingData;

  return (
    <Page>
      <div className="container">
        <header className={styles.header}>
          <ArticleTags tags={["governmentSpending"]} />
          <h1>政府支出の流れ</h1>
          <p className={styles.lead}>
            国の一般会計について、歳入から歳出までのつながりをサンキー図で確認します。
            項目に触れると、関連する流れと割合が強調されます。
          </p>
        </header>

        <section className={styles.visualization} aria-labelledby="government-spending-headline">
          <div>
            <div>
              <h2 className={styles.statHeadline} id="government-spending-headline">
                2024年度、一般会計の歳入と歳出の流れ
              </h2>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <p className={styles.sourceLabel}>出典:{' '} {/* スペースの書き方 */}
                  <a
                    href="https://www.mof.go.jp/policy/budget/reference/statistics/data.htm"
                    // クリックすると新しいタブが開く
                    target="_blank"
                    // フィッシングなどの対策。_blank を使うときは必ず指定する
                    rel="noopener noreferrer"
                  >
                    財務省「予算・決算 統計表一覧」
                  </a>
                </p>

                <a
                  href="/articles/government-spending/fullscreen"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 12, color: "#888888", textDecoration: "none" }}
                >
                  全画面で表示
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className={styles.chartBand}>
        <SankeyChart data={data} />
      </div>
    </Page>
  );
}
