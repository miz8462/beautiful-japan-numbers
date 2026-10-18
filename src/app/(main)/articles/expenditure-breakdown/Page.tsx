import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import ExpenditureCharts from "./ExpenditureCharts";

const SOURCE_LABEL = "出典: 財務省「財政統計」第20表";
const SOURCE_URL = "https://www.mof.go.jp/policy/budget/reference/statistics/data.htm";

export default function ExpenditureBreakdownPage() {
  const article = articles.find(
    (a) => a.href === "/articles/expenditure-breakdown"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="社会保障関係費のインパクト（1967年度 vs 2024年度）">
        <KPIPrimary
          label="社会保障関係費（2024年度）"
          value="35.8兆円"
          caption="当初予算における主要経費最大の支出額（歳出全体の29.1%）"
        />
        <KPIGrid>
          <KPICard label="1967年度の規模" value="0.73兆円" caption="歳出全体の 14.3%" />
          <KPICard label="2024年度の規模" value="35.8兆円" caption="歳出全体の 29.1%" />
          <KPICard label="約57年間での倍率" value="約49倍" caption="名目額ベースでの拡大規模" />
          <KPICard label="歳出に占める割合" value="2.0倍" caption="14.3% から 29.1% へ上昇" />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          日本の一般会計歳出(国の予算のうち、毎年の支出)は、人口の変化や経済・社会情勢に合わせて、規模も中身も大きく変わってきました。
          1967年度に5兆円台だった歳出総額は、オイルショックやバブル期を経て拡大を続け、近年は100兆円を大きく上回っています。        </p>
        <p>
          この拡大を最も押し上げてきたのが、年金・医療・介護・少子化対策などに充てられる<strong>社会保障関係費</strong>です。
          1973年度の「福祉元年」で給付が手厚くなり、1990年代以降は少子高齢化が急速に進んだことで、社会保障関係費は一貫して増え続けてきました。        </p>
      </ArticleText>

      <ExpenditureCharts
        sourceLabel={article.sourceLabel || SOURCE_LABEL}
        sourceUrl={article.sourceUrl || SOURCE_URL}
      />

      <ArticleText>
        <p>
          積み上げグラフを見ると、公共事業関係費や文教・科学振興費は、かつてのシェアから大きく広がってはいません。一方で、社会保障関係費の占める部分は年々厚くなっています。<strong>国債費</strong>(過去に発行した国債の元本返済と利払いの費用)も、巨額の残高を背景に、歳出全体の約2割を占める水準が続いています。        </p>
        <p>
          社会保障関係費が歳出全体に占める割合は、1967年度の14.3%から段階的に上昇し、2020年代には約3割に達しました。高齢化にともなう自然増が毎年生じるため、社会保障関係費は国債費とともに、財政の硬直化(自由に使える予算の余地が狭まること)を招く大きな要因となっています。
        </p>
        <p>
          増え続ける社会保障関係費をどう支え、現役世代と高齢世代がどう負担を分かち合うのか。この問いは、日本の財政が直面する最大級の課題の一つです。
        </p>
      </ArticleText>
    </div>
  );
}
