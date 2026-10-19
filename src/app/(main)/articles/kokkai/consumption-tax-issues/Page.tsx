import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import data from "@/data/consumption-tax-issues.json";
import { IssueBarLoader } from "./charts/IssueBar";
import { IssuePartyTable } from "./charts/IssuePartyTable";

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
        <p>
          2025年10月1日から2026年10月1日までの本会議で、「消費税」「消費減税」「給付つき(付き)税額控除」のいずれかを含む発言の段落は、294件ありました。この記事は、その294件を論点ごとに分け、発言した議員の数と、政府の応答の回数を数えたものです。
        </p>
        <p>論点は14に分けました。分類は、議論の中に出てきた語の組み合わせによるものです。14の論点を「根本問題」「影響」「やりかた」の3つのグループに並べたのは、筆者の整理で、国会の区分ではありません。</p>
      </ArticleText>

      {/* チャート */}
      <ArticleChart
        title="論点ごとの発言者数と政府の応答回数"
        subtitle="議員は発言者数、政府は応答回数"
        source={SOURCE_LABEL}
        sourceUrl={SOURCE_URL}
        note={`${data.source}。${data.note}`}
      >
        <IssueBarLoader />
      </ArticleChart>

      <ArticleText>
        <p>
          議員の発言者数が最も多いのは、物価高と景気の23人で、食料品ゼロの範囲の22人、給付つき税額控除との関係の20人が続きます。
        </p>
        <p>
          政府の応答回数が多いのは、食料品ゼロの範囲と給付つき税額控除との関係の各28回、財源と社会保障の26回、決め方(国民会議)の20回です。
        </p>
        <p>
          発言者数と応答回数が重ならない論点もあります。経済停滞・賃上げの原因かは15人に対して3回、一律減税・廃止は8人に対して2回、負担の公平は10人に対して3回でした。食料品ゼロの範囲は、22人に対して28回です。
        </p>
        <p>
          地方財政への影響(2人・1回)と医療機関の消費税負担(5人・2回)は、数が少ない論点です。
        </p>
      </ArticleText>


      <ArticleChart
        title="論点ごとの政党別の発言者数"
        subtitle="議員の発言者数、人"
        source={SOURCE_LABEL}
        sourceUrl={SOURCE_URL}
        note="–は発言した議員がいなかったことを示す。人数は、その論点について発言した議員の数で、政党によって議員数が異なる。列の並びは、集計に使った政党名の対応表の順。"
      >
        <IssuePartyTable />
      </ArticleChart>

      <ArticleText>
        <p>
          食料品ゼロの範囲では、表の10政党すべてに発言者がいました。一方、一律減税・廃止で発言したのは、参政党、れいわ新選組、日本共産党の3党です。
        </p>
      </ArticleText>

    </div>
  );
}
