import SankeyChart, { type GovernmentSpendingData } from "@/app/(main)/articles/government-spending/SankeyChart";
import { ArticleHeader } from "@/components/ui/ArticleHeader/ArticleHeader";
import governmentSpendingData from "@/data/government-spending.json";
import { articles } from "../articles";
import styles from "./page.module.css";

export default function GovernmentSpendingPage() {
  const data = governmentSpendingData as GovernmentSpendingData;

  const article = articles.find((a) => a.href === "/articles/government-spending");
  if (!article) return null;

  return (
    <div>
      <div className="container">
        <ArticleHeader article={article} />
        <section className={styles.visualization} aria-labelledby="government-spending-headline">
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <h2 className={styles.statHeadline} id="government-spending-headline">
                2024年度、一般会計の歳入と歳出の流れ
              </h2>
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
        </section>
      </div>

      <div className={styles.chartBand}>
        <SankeyChart data={data} />
      </div>
    </div>
  );
}
