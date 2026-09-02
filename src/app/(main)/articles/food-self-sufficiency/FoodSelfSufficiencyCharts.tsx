"use client";

import { ArticleChart } from "@/components/article/article-chart";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const SelfSufficiencyTrendChart = dynamic(
  () =>
    import(
      "./chart/SelfSufficiencyTrendChart/SelfSufficiencyTrendChart"
    ).then((mod) => mod.SelfSufficiencyTrendChart),
  { ssr: false }
);

const ItemRankingChart = dynamic(
  () =>
    import("./chart/ItemRankingChart/ItemRankingChart").then(
      (mod) => mod.ItemRankingChart
    ),
  { ssr: false }
);

const SOURCE_LABEL = "農林水産省「食料需給表」";
const SOURCE_URL = "https://www.maff.go.jp/j/zyukyu/zikyu_ritu/012.html";

export default function FoodSelfSufficiencyCharts() {
  return (
    <>
      <div className={styles.charts}>
        <ArticleChart
          title="食料自給率の長期推移"
          yearRange="（1965〜2025年度）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          note="※2025年度の数値は概算値。"
        >
          <SelfSufficiencyTrendChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          1965年度には73%であったカロリーベースの食料自給率は、高度経済成長期から平成初期にかけて大幅に低下しました。品目別の自給率（ベスト5・ワースト5）を比較すると、国内で自給可能な食材と海外依存度が高い食材との間に極めて大きな差が存在していることがわかります。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title={<>品目別食料自給率の比較<br />（ベスト5・ワースト5）</>}
          yearRange="（2025年度概算値）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          note="※重量ベースでの概算値。上位5品目（ベスト5）と下位5品目（ワースト5）を表示。"
        >
          <ItemRankingChart />
        </ArticleChart>
      </div>
    </>
  );
}
