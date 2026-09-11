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
          caption="国民に供給される熱量（カロリー）に占める国産割合"
        />
        <KPIGrid>
          <KPICard
            label="生産額ベース自給率"
            value="66%"
            caption="国内消費生産額に占める国産割合"
          />
          <KPICard
            label="主食用米の自給率"
            value="99%"
            caption="主食はほぼ国内自給を維持"
          />
          <KPICard
            label="小麦の自給率"
            value="16%"
            caption="パン・麺類など大半を輸入"
          />
          <KPICard
            label="大豆の自給率"
            value="6%"
            caption="食用・油脂用原料の多くを依存"
          />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          「<strong>食料自給率</strong>」は、国内で消費される食料がどれくらい国産で賄われているかを示す指標です。その算出方法には、主に熱量（エネルギー）を基準とする「<strong>カロリーベース</strong>」と、金額を基準とする「<strong>生産額ベース</strong>」の2種類が存在します。
        </p>
        <p>
          カロリーベースは国民の栄養確保の観点から安全保障上の指標として重視される一方、生産額ベースは農業生産活動の経済的規模や付加価値を反映しやすい特徴があります。野菜や果物・畜産物などは熱量が低くても生産額が大きいため、2つの指標の間には大きな開きが生じます。
        </p>
      </ArticleText>

      <FoodSelfSufficiencyCharts />

      <ArticleText>
        <p>
          食料自給率低下の主な背景には、食生活の洋風化・高度化に伴う「食文化の変化」があります。主食である米の消費量が減少し、外国産飼料や原材料への依存度が高い畜産物や油脂類、小麦の消費量が急増したことが要因です。
        </p>
        <p>
          2000年代以降、カロリーベース自給率は37〜40%程度で横ばい傾向が続いています。輸入途絶リスクや気候変動、国際情勢の緊張が高まる中、国内生産能力の維持・向上と持続可能な食料安全保障の確立に向けた取り組みが求められています。
        </p>
      </ArticleText>

      <ArticleSource href={article.sourceUrl || SOURCE_URL} label={article.sourceLabel || SOURCE_LABEL} />
    </div>
  );
}
