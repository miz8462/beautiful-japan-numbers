import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import DietMembersCharts from "./DietMembersCharts";

const SOURCE_LABEL = "総務省「衆議院議員総選挙結果調」";
const SOURCE_URL = "https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html";

export default function DietMembersPage() {
  const article = articles.find((a) => a.href === "/articles/diet-members");
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事ヘッダー */}
      <ArticleHeader article={article} />

      {/* KPIセクション */}
      <KPISection title="衆議院当選者の女性比率と年齢構成（2026年総選挙）">
        <KPIPrimary
          label="女性当選者の割合"
          value="14.6%"
          caption="2026年総選挙における全当選者に占める比率（過去最高）"
        />
        <KPIGrid>
          <KPICard
            label="女性候補者の割合"
            value="24.4%"
            caption="全候補者1,284名中313名"
          />
          <KPICard
            label="女性候補者の当選率"
            value="21.7%"
            caption="男性の当選率（40.9%）と約19pt差"
          />
          <KPICard
            label="60代以上の議員割合"
            value="40.1%"
            caption="国会議員の高齢化傾向が継続"
          />
          <KPICard
            label="20〜30代の議員割合"
            value="10.8%"
            caption="若手議員は全体の約1割にとどまる"
          />
        </KPIGrid>
      </KPISection>

      {/* 導入解説 */}
      <ArticleText>
        <p>
          国の法律や予算を決定する最高機関である国会（衆議院）。
          その構成メンバーである国会議員の「ジェンダー」と「年齢」は、戦後から現在に至る約80年間でどのように変化してきたのでしょうか。
        </p>
        <p>
          1946年の第22回衆院選から2026年の第51回衆院選までの公的統計をもとに、女性候補者数・議員数・当選率の推移と、当選議員の年代別構成比の変遷をデータから紐解きます。
        </p>
      </ArticleText>

      {/* チャート群 */}
      <DietMembersCharts />

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
