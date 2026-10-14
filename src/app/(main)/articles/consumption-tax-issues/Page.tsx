import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import data from "@/data/consumption-tax-issues.json";
import { IssueBarLoader } from "./charts/IssueBar";
import styles from "./page.module.css";

const SOURCE_LABEL = "国会会議録検索システム(国立国会図書館)";
const SOURCE_URL = "https://kokkai.ndl.go.jp/";

export default function ConsumptionTaxIssuesPage() {
  const article = articles.find(
    (a) => a.href === "/articles/consumption-tax-issues"
  );
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事ヘッダー */}
      <ArticleHeader article={article} />

      {/* 導入本文 */}
      <ArticleText>
        <p>(本文は後で書く)</p>
      </ArticleText>

      {/* チャート */}
      <div className={styles.charts}>
        <ArticleChart
          title="論点ごとの発言者数と政府の応答回数"
          subtitle="直近1年の本会議(議員は発言者数、政府は応答回数)"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          note={`${data.source}。${data.note}`}
        >
          <IssueBarLoader />
        </ArticleChart>
      </div>

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
