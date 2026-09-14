import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import VoterTurnoutCharts from "./VoterTurnoutCharts";

const SOURCE_LABEL = "総務省 選挙関連資料「衆議院議員総選挙結果調」";
const SOURCE_URL = "https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html";

export default function VoterTurnoutPage() {
  const article = articles.find((a) => a.href === "/articles/voter-turnout");
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事ヘッダー */}
      <ArticleHeader article={article} />

      {/* KPIセクション */}
      <KPISection title="衆議院議員選挙の投票率と格差（2024年）">
        <KPIPrimary
          label="全体投票率（2024年）"
          value="53.85%"
          caption="1960〜80年代の70%台から大幅に低下"
        />
        <KPIGrid>
          <KPICard
            label="20代の投票率"
            value="34.62%"
            caption="若年層の約3人に1人のみ投票"
          />
          <KPICard
            label="60代の投票率"
            value="68.02%"
            caption="20代との間に約2倍の開き"
          />
          <KPICard
            label="小選挙区の死票率"
            value="48.0%"
            caption="投じられた票の約半分が落選者に"
          />
          <KPICard
            label="比例代表の死票率"
            value="5.3%"
            caption="94.7%の票が議席に反映"
          />
        </KPIGrid>
      </KPISection>

      {/* 導入解説 */}
      <ArticleText>
        <p>
          「若者の政治離れ」や「投票率の低下」が叫ばれて久しい日本。
          実際の投票率は過去半世紀でどのように推移し、世代間でどれほどの格差が生じているのでしょうか。
        </p>
        <p>
          1967年から2024年までの年代別投票率データと、2026年衆院選における「死票（議席に結びつかなかった票）」の検証を通じて、有権者の意思がどのように反映されているのかを数字でたどります。
        </p>
      </ArticleText>

      {/* チャート群 */}
      <VoterTurnoutCharts />

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
