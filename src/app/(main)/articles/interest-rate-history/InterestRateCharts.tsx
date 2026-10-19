"use client";

import { ArticleChart } from "@/components/article/article-chart";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import { ArticleText } from "@/components/article/article-text/ArticleText";

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
      <ArticleText>
        <p>
          政策金利は1995年に0.46%と0.5%を割り込み、2024年まで30年間、年ごとの値が0.5%以下で推移しました。
          2016〜2023年の8年間はマイナス圏。
          2024年は0.23%、2026年は0.98%です。
        </p>
      </ArticleText>
      {/* 2. 政策金利の推移 */}
      <div className={styles.chartSection}>
        <ArticleChart
          title="日本の政策金利（公定歩合・無担保コールO/N物）の推移"
          subtitle="1973年〜2026年（単位: %）"
          source="日本銀行「基準割引率および基準貸付利率の推移」「無担保コールO/N物レート」"
          sourceUrl="https://www.boj.or.jp/"
        >
          <PolicyRateChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          10年国債利回りは1990年の6.62%から、2019年には-0.02%まで下がりました。
          2021年の0.09%から2026年の2.80%までは、5年間で2.71ポイントの上昇。
          1995年以来の水準です。
        </p>
      </ArticleText>

      {/* 3. 長期金利の推移 */}
      <div className={styles.chartSection}>
        <ArticleChart
          title="新規発行10年国債利回り（長期金利）の推移"
          subtitle="1986年〜2026年（単位: %）"
          source="財務省「国債金利情報」"
          sourceUrl="https://www.mof.go.jp/jgbs/reference/interest_rate/"
        >
          <LongTermRateChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          国債の利率加重平均は、1976年度の7.64%が最高、2022年度の0.76%が最低です。
          2025年度は0.98%で、2022年度から0.22ポイント上昇しました。
          1%を下回る状態は2017年度から9年続いています。
        </p>
      </ArticleText>

      {/* 4. 普通国債利率加重平均の推移 */}
      <div className={styles.chartSection}>
        <ArticleChart
          title="国債利率加重平均の推移"
          subtitle="1975年度〜2025年度（単位: %）"
          source="財務省「普通国債の利率加重平均の推移」"
          sourceUrl="https://www.mof.go.jp/"
        >
          <NationalDebtInterestRateChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          通常貯金金利は2016年2月の0.001%から、2024年4月に0.02%、2026年2月に0.30%へ。2024年4月からの約2年で15倍になり、1996年以降のグラフで最も高い水準です。
          フラット35は2016年8月に下限0.90%・上限1.57%まで下がり、2026年8月は下限3.29%・上限5.57%。
          10年で下限は2.39ポイント、上限は4.00ポイント上昇し、2003年10月以降で最も高くなっています。
        </p>
      </ArticleText>

      {/* 5. 住宅ローン・預金金利の推移 */}
      <div className={styles.chartSection}>
        <ArticleChart
          title="住宅ローン（フラット35）と通常預貯金金利の推移"
          subtitle="1996年〜2026年（単位: %）"
          source="住宅金融支援機構「フラット35借入金利」/ ゆうちょ銀行資料"
          sourceUrl="https://www.jhf.go.jp/"
        >
          <HousingDepositRateChart />
        </ArticleChart>
      </div>
    </>
  );
}
