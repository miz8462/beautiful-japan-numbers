import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import data from "@/data/consumption-tax-issues.json";
import { IssueBarLoader } from "./charts/IssueBar";
import { IssuePartyTable } from "./charts/IssuePartyTable";
import styles from "./page.module.css";

const SOURCE_LABEL = "国会会議録検索システム(国立国会図書館)";
const SOURCE_URL = "https://kokkai.ndl.go.jp/";

export default function ConsumptionTaxIssuesPage() {
  const article = articles.find(
    (a) => a.href === "/articles/kokkai/consumption-tax-issues"
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
      <ArticleChart
        title="論点ごとの発言者数と政府の応答回数"
        subtitle="直近1年の本会議(議員は発言者数、政府は応答回数)"
        source={SOURCE_LABEL}
        sourceUrl={SOURCE_URL}
        note={`${data.source}。${data.note}`}
      >
        <IssueBarLoader />
      </ArticleChart>

      <ArticleChart
        title="論点ごとの政党別の発言者数"
        subtitle="直近1年の本会議(議員の発言者数、人)"
        source={SOURCE_LABEL}
        sourceUrl={SOURCE_URL}
        note="–は発言した議員がいなかったことを示す。人数は、その論点について発言した議員の数で、政党によって議員数が異なる。列の並びは、集計に使った政党名の対応表の順。"
      >
        <IssuePartyTable />
      </ArticleChart>

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
