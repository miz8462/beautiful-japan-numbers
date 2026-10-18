import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import TaxRevenueCharts from "./TaxRevenueCharts";

const SOURCE_LABEL = "出典: 財務省「税収に関する資料」";
const SOURCE_URL = "https://www.mof.go.jp/tax_policy/summary/condition/a03.htm";

export default function TaxRevenueStructurePage() {
  const article = articles.find(
    (a) => a.href === "/articles/tax-revenue-structure"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="税収の内訳と主要税目（2024年度）">
        <KPIPrimary
          label="消費税収（税目別最大）"
          value="25.0兆円"
          caption="2024年度一般会計税収 75.2兆円のうち約33%を占める"
        />
        <KPIGrid>
          <KPICard label="消費税減税" value="-4.3兆円" caption="2027年度見込" valueColor="var(--color-data-negative)" />
          <KPICard label="所得税" value="21.2兆円" caption="全体の約28.2%" />
          <KPICard label="法人税" value="17.9兆円" caption="全体の約23.8%" />
          <KPICard label="税収合計" value="75.2兆円" caption="過去最高水準を更新" />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          日本の国の税収（一般会計の国税収入）は、景気や税制改正の影響を受けながら、その中身を大きく変えてきました。
          かつて税収の柱だったのは、個人の所得にかかる<strong>所得税</strong>と、企業の利益にかかる<strong>法人税</strong>です。
          ところが、バブル崩壊後の長引く不況や企業利益の低迷、相次いだ減税の影響で、この2つの税収は1990年前後のピークを下回る水準にとどまってきました。
        </p>
      </ArticleText>

      <TaxRevenueCharts />

      <ArticleText>
        <p>
          一方、1989年度に導入された<strong>消費税</strong>は、税率が3%から5%（1997年度）、8%（2014年度）、10%（2019年度）へと段階的に引き上げられ、税収を大きく伸ばしました。
          さらに、消費は不況期でも急には減りにくいため、税収が景気に左右されにくい点も特徴です。
        </p>
        <p>
          2024年度の消費税収は約25.0兆円で、所得税（約21.2兆円）、法人税（約17.9兆円）を上回り、税目別で最大となりました。
          高齢化で社会保障費が膨らむなか、安定した財源として消費税への依存が高まった結果、日本の税収は「所得や利益にかかる税が中心」の姿から「消費にかかる税が中心」の姿へと移ってきたことが、推移から読み取れます。
        </p>
        <p>
          その消費税が、いま見直しの対象になっています。
          政府は、飲食料品にかかる消費税を8%から1%へ引き下げる方針を閣議決定しました。期間は2027年4月1日からの2年間で、酒類と外食は対象外です。
          この減税による税収減は、国と地方を合わせて年間約4.3兆円と見込こまれています。
          関連法案は国会へ提出されたものの、2026年10月17日時点で成立していません。
          飲食料品に限った減税とはいえ、最大の税収源である消費税の税率を下げる以上、その財源をどう手当てするかが、今後の税収構造を左右する論点になります。
        </p>
      </ArticleText>
    </div>
  );
}
