"use client";

import { ArticleChart } from "@/components/article/article-chart";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const PolicyRateChart = dynamic(
  () => import("./chart/policy-rate-chart").then((mod) => mod.PolicyRateChart),
  { ssr: false }
);

const LongTermRateChart = dynamic(
  () => import("./chart/long-term-rate-chart").then((mod) => mod.LongTermRateChart),
  { ssr: false }
);

const NationalDebtInterestRateChart = dynamic(
  () =>
    import("./chart/interest-rate-weighted-average-chart").then(
      (mod) => mod.NationalDebtInterestRateChart
    ),
  { ssr: false }
);

const HousingDepositRateChart = dynamic(
  () =>
    import("./chart/housing-deposit-rate-chart").then(
      (mod) => mod.HousingDepositRateChart
    ),
  { ssr: false }
);

export default function InterestRateCharts() {
  return (
    <>
      {/* 2. 政策金利の推移 */}
      <div className={styles.chartSection}>
        <ArticleChart
          title="日本の政策金利（公定歩合・無担保コールO/N物）の推移"
          yearRange="（1973〜2026年）"
          source="日本銀行「基準割引率および基準貸付利率の推移」「無担保コールO/N物レート」"
          sourceUrl="https://www.boj.or.jp/"
        >
          <PolicyRateChart />
        </ArticleChart>
      </div>

      {/* 3. 長期金利の推移 */}
      <div className={styles.chartSection}>
        <ArticleChart
          title="新規発行10年国債利回り（長期金利）の推移"
          yearRange="（1986〜2026年）"
          source="財務省「国債金利情報」"
          sourceUrl="https://www.mof.go.jp/jgbs/reference/interest_rate/"
        >
          <LongTermRateChart />
        </ArticleChart>
      </div>

      {/* 4. 普通国債利率加重平均の推移 */}
      <div className={styles.chartSection}>
        <ArticleChart
          title="国債利率加重平均の推移"
          yearRange="（1975〜2025年度）"
          source="財務省「国債関係想定データ」"
          sourceUrl="https://www.mof.go.jp/"
        >
          <NationalDebtInterestRateChart />
        </ArticleChart>
      </div>

      {/* 5. 住宅ローン・預金金利の推移 */}
      <div className={styles.chartSection}>
        <ArticleChart
          title="住宅ローン（フラット35）と通常預貯金金利の推移"
          yearRange="（1996〜2026年）"
          source="住宅金融支援機構「【フラット３５】借入金利の推移」/ ゆうちょ銀行「貯金の金利の沿革」など"
          sourceUrl="https://www.jhf.go.jp/"
        >
          <HousingDepositRateChart />
        </ArticleChart>
      </div>
    </>
  );
}
