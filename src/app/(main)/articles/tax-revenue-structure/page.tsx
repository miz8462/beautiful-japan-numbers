import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import TaxRevenueCharts from "./TaxRevenueCharts";

export default function TaxRevenueStructurePage() {
  const article = articles.find(
    (a) => a.href === "/articles/tax-revenue-structure"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="税収の内訳と主要税目（2024年度）">
        <KPIPrimary value="消費税収 25.0兆円" caption="2024年度は消費税収25.0兆円が税目最大" />
        <KPIGrid>
          <KPICard label="所得税" value="21.2兆円" />
          <KPICard label="法人税" value="17.9兆円" />
          <KPICard label="その他" value="11.1兆円" />
          <KPICard label="税収合計" value="75.2兆円" />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          日本の国の税金（一般会計国税）の収入額は、経済情勢や税制改正を反映して大きく変化してきました。
          かつて国の税収の柱であったのは、個人の所得に対して課される<strong>所得税</strong>と、企業の利益に対して課される<strong>法人税</strong>でした。
          しかし、バブル崩壊後の長引く不況や企業利益の低迷、また累次の減税などによって、所得税と法人税の税収は1990年前後をピークに減少、または停滞を続けてきました。
        </p>
      </ArticleText>

      <TaxRevenueCharts />

      <ArticleText>
        <p>
          これに対して、1989年度に導入された<strong>消費税</strong>は、税率が3%から5%（1997年度）、8%（2014年度）、そして10%（2019年度）へと段階的に引き上げられたことに加え、税収が景気動向に左右されにくい安定的な性質を持つことから、着実に税収額を伸ばしてきました。
        </p>
        <p>
          2024年度の決算（または予算見込み）では、消費税の税収が<strong>約25.0兆円</strong>に達し、所得税（約21.2兆円）や法人税（約17.9兆円）を抑えて最も規模の大きい税目となっています。
          少子高齢化に伴う社会保障費の増大にともない、安定財源としての消費税への依存が強まった結果、日本の歳入構造は「直間比率（直接税と間接税の比率）」の見直しを経て、消費課税を中心とする構造へ移行したことが推移から確認できます。
        </p>
      </ArticleText>
    </div>
  );
}
