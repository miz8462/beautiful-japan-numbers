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
          subtitle="1965年度〜2025年度（単位: %）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          note="※2025年度の数値は概算値。"
        >
          <SelfSufficiencyTrendChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          1965年度に73%だったカロリーベース自給率は、2025年度に37%。60年でほぼ半分になりました。
        </p>
        <p>
          1993年度は、記録的な冷夏による米の不作で37%まで急落。2025年度は、その年と同じ水準です。2000年代以降は37〜40%で横ばいが続いています。
        </p>
        <p>
          生産額ベースは2022年度に58%と、1965年度以降で最低を記録しました。同じ年のカロリーベースは、前年と同じ38%でした。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="品目別食料自給率の比較（ベスト5・ワースト5）"
          subtitle="2025年度概算値"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          note={<>
            ※米は、加工用などの輸入米（ミニマム・アクセス米を含む）を含めた数字。主食用米に限ると99%。<br />
            ※鶏卵は、輸入飼料の分を差し引いていない。
          </>}
        >
          <ItemRankingChart />
        </ArticleChart>
      </div>
      <ArticleText>
        <p>
          重量ベースの自給率が高いのは、鶏卵96%、米95%、きのこ類88%。一方、豆類は8%、大麦・はだか麦は12%、油脂類は14%、小麦は16%です。最も高い鶏卵と最も低い豆類の差は、88ポイントあります。
        </p>
      </ArticleText>
    </>
  );
}
