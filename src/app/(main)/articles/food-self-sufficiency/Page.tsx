import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import FoodSelfSufficiencyCharts from "./FoodSelfSufficiencyCharts";

const SOURCE_LABEL = "出典: 農林水産省「食料需給表」";
const SOURCE_URL = "https://www.maff.go.jp/j/zyukyu/zikyu_ritu/012.html";

export default function FoodSelfSufficiencyPage() {
  const article = articles.find(
    (a) => a.href === "/articles/food-self-sufficiency"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="2025年度 食料自給率（主要指標）">
        <KPIPrimary
          label="カロリーベース自給率"
          value="37%"
          caption="食料のカロリー全体のうち、国産でまかなえている割合"
        />
        <KPIGrid>
          <KPICard
            label="生産額ベース自給率"
            value="66%"
            caption="食料の金額全体のうち、国産でまかなえている割合"
          />
          <KPICard
            label="主食用米の自給率"
            value="99%"
            caption="主食はほぼ国内自給を維持"
          />
          <KPICard
            label="小麦の自給率"
            value="16%"
            caption="パパン・麺類・菓子などの原料"
          />
          <KPICard
            label="大豆の自給率"
            value="6%"
            caption="食豆腐・みそ・食用油などの原料"
          />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          <strong>食料自給率</strong>は、国内で消費された食料のうち、国産でまかなえた割合です。物差しは2つあります。熱量で測る<strong>カロリーベース</strong>と、金額で測る<strong>生産額ベース</strong>です。
        </p>
        <p>
          カロリーベースは、国民の栄養をどれだけ確保できているかを示す指標で、食料安全保障の物差しとして重視されます。生産額ベースは、農業の経済規模や付加価値を映しやすい指標です。野菜や果物は熱量が低くても金額が大きいため、2つの指標には大きな開きが出ます。
        </p>
        <p>
          2025年度は、カロリーベースが37%、生産額ベースが66%。その開きは29ポイントです。
        </p>
      </ArticleText>

      <FoodSelfSufficiencyCharts />

      <ArticleText>
        <p>
          熱量でみた食料の約6割を輸入に頼る構図は、2000年代以降、変わっていません。
        </p>
      </ArticleText>
    </div>
  );
}
