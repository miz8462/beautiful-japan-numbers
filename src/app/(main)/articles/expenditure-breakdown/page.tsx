import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import ExpenditureCharts from "./ExpenditureCharts";

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
          value="社会保障関係費 35.8兆円"
          caption="2024年度予算案（または当初計画）における主要経費最大の支出額"
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
          日本の一般会計歳出（国家予算の支出）は、高度経済成長期から現在に至るまで、人口動態の変化や社会・経済情勢を反映してその規模と内訳を大きく変えてきました。
          1960年代後半には5兆円台であった歳出総額は、オイルショックやバブル期を経て、近年では100兆円を大幅に超える規模で推移しています。
        </p>
        <p>
          この膨張を主導してきたのが、年金、医療、介護、少子化対策などに充てられる<strong>社会保障関係費</strong>です。
          制度発足期や福祉元年の指定（1973年度）などによる保障の充実、さらには1990年代以降の急速な少子高齢化を背景に、社会保障のための歳出は一貫して増加傾向をたどってきました。
        </p>
      </ArticleText>

      <ExpenditureCharts
        sourceLabel={article.sourceLabel || "財務省「財政統計」第20表"}
        sourceUrl={article.sourceUrl}
      />

      <ArticleText>
        <p>
          主要経費の積み上げ構造を見ると、かつて一定のシェアを占めていた公共事業関係費や文教・科学振興費などの割合が抑え込まれているのに対し、社会保障関係費の領域が厚みを増しているのがわかります。
          また、歳入不足を補うために発行された国債の元利払いに充てられる<strong>国債費</strong>も、巨額の残高を背景に歳出全体の約2割を占める水準で固定化しています。
        </p>
      </ArticleText>

      <ArticleText>
        <p>
          社会保障関係費が歳出全体に占める割合の推移を見ると、1967年度の14.3%から段階的に上昇し、2020年代には約3割に達しています。
          高齢化にともなう自然増が毎年続く中で、社会保障給付費の急増は国債費と並び、財政の硬直化（自由に使える予算の余地が減少すること）を招く主な要因となっています。
        </p>
        <p>
          他の主要経費である公共事業費や教育関連費が抑制傾向にある中、増大し続ける社会保障関係費をどのように維持・管理し、現役世代と高齢世代の間でいかに負担を分かち合うかは、現在の日本財政が抱える最も大きな課題の一つです。
        </p>
      </ArticleText>
    </div>
  );
}

