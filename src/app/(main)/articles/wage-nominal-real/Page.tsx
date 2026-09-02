"use client";

import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const NominalRealWageChart = dynamic(
  () =>
    import("./chart/NominalRealWageChart/NominalRealWageChart").then(
      (mod) => mod.NominalRealWageChart
    ),
  { ssr: false }
);

const SOURCE_LABEL = "毎月勤労統計調査（厚生労働省）";
const SOURCE_URL =
  "https://www.e-stat.go.jp/stat-search/files?toukei=00450071&tstat=000001011791";

export default function WageNominalRealPage() {
  const article = articles.find(
    (a) => a.href === "/articles/wage-nominal-real"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="賃金指数の変化（1990年比 / 令和2年平均=100）">
        <KPIPrimary
          label="名目賃金指数の伸び（1990→2025年）"
          value="+11.4%"
          caption="1990年（100.3）から2025年（111.7）への上昇率"
        />
        <KPIGrid>
          <KPICard
            label="名目賃金指数 (1990)"
            value="100.3"
            caption="バブル期の水準"
          />
          <KPICard
            label="名目賃金指数 (2025)"
            value="111.7"
            caption="緩やかな上昇傾向"
          />
          <KPICard
            label="実質賃金指数 (1990)"
            value="111.8"
            caption="高水準の購買力"
          />
          <KPICard
            label="実質賃金指数 (2025)"
            value="98.0"
            caption="1990年比 -12.3% の下落"
          />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          日本の労働者の賃金動向を評価する際、実際に支払われる金額を示す「<strong>名目賃金</strong>」と、物価の変動の影響を除外して購買力を表す「<strong>実質賃金</strong>」の2つの視点が存在します。
        </p>
        <p>
          1990年から2025年にかけた36年間の推移を見ると、名目賃金指数（令和2年平均=100）は100.3から111.7へと緩やかに増加しています。一方で、実質賃金指数は1990年の111.8から2025年には98.0へと推移しており、横ばいから下落傾向がうかがえます。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="名目賃金と実質賃金の推移"
          yearRange="（1990〜2025年）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <NominalRealWageChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          名目賃金は2010年代半ばから緩やかな増加ペースを保ち、近年では物価高に伴う賃上げの動きも重なって指数の上昇が見られます。
        </p>
        <p>
          一方で実質賃金の推移においては、消費税率の改定や世界的な原材料高、為替の変動などに伴う物価上昇局面で, 賃金の伸びが物価の上昇に追いつかない期間が生じるなど、購買力としての賃金水準の維持には多様な経済要因が影響を及ぼしています。
        </p>
      </ArticleText>
    </div>
  );
}
