import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import {
  KPICard,
  KPIGrid,
  KPIPrimary,
  KPISection,
} from "@/components/kpi";
import { GiniImprovementChart } from "./chart/gini-improvement/GiniImprovementChart";
import { GiniTrendChart } from "./chart/gini-trend/GiniTrendChart";
import styles from "./page.module.css";

export default function GiniCoefficientPage() {
  const article = articles.find((a) => a.href === "/articles/gini-coefficient");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="日本の所得格差と再分配効果（2023年）">
        <KPIPrimary
          label="2023年の所得再分配による格差改善度"
          value="34.7%"
          caption="税・社会保障により格差が約3.5割縮小"
        />
        <KPIGrid>
          <KPICard
            label="当初所得ジニ係数（2023年）"
            value="0.5855"
            caption="1981年（0.3491）から高齢化等で上昇"
          />
          <KPICard
            label="再分配後ジニ係数（2023年）"
            value="0.3825"
            caption="給付と税により0.38台に抑制"
          />
          <KPICard
            label="当初と再分配後の格差ギャップ"
            value="0.2030"
            caption="過去最大の是正幅を記録"
          />
          <KPICard
            label="1981年の改善度"
            value="10.0%"
            caption="当初0.3491 → 再分配後0.3143"
          />
        </KPIGrid>
      </KPISection>

      <div className={styles.content}>
        <ArticleText>
          <p>
            ジニ係数は、社会における所得分配の不平等さを0から1の範囲で数値化する代表的な指標です。数値が0に近いほど全員の所得が平等であり、1に近いほど一握りの世帯に所得が集中していることを意味します。
          </p>
          <p>
            厚生労働省の「所得再分配調査」では、給与や事業収入など市場で得た生の収入を示す「当初所得」と、税金・社会保険料を差し引き、年金や医療・介護・子育て支援などの公的給付を加えた「再分配所得」の2つを比較しています。
          </p>
        </ArticleText>

        <ArticleChart
          title="当初所得と再分配所得のジニ係数推移"
          subtitle="1962年度〜2023年度（世帯単位）"
          source="厚生労働省「所得再分配調査」"
          sourceUrl="https://www.e-stat.go.jp/statistics/00450422"
        >
          <GiniTrendChart />
        </ArticleChart>

        <ArticleText>
          <p>
            日本の当初所得ジニ係数は、1980年代初頭の0.34前後から一貫して上昇を続け、2023年度には過去最高の0.5855に達しました。この背景には、年金受給世代である無職の高齢者世帯の急増という人口動態の構造変化があります。
          </p>
          <p>
            一方で、年金や医療などの社会保障給付を中心とした再分配機能が強く作用しており、再分配後のジニ係数は0.37〜0.38台でほぼ横ばいを維持。税・社会保障による格差改善度は1980年代の約10%から2023年には34.7%へと大幅に拡大しています。
          </p>
        </ArticleText>

        <ArticleChart
          title="所得再分配による格差改善度の推移"
          subtitle="1962年度〜2023年度（単位: %）"
          source="厚生労働省「所得再分配調査」"
          sourceUrl="https://www.e-stat.go.jp/statistics/00450422"
        >
          <GiniImprovementChart />
        </ArticleChart>

        <ArticleSource
          label="出典: 厚生労働省「所得再分配調査」"
          href="https://www.e-stat.go.jp/statistics/00450422"
        />
      </div>
    </div>
  );
}
