"use client";

import { ArticleChart } from "@/components/article/article-chart";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const MarketCapChart = dynamic(
  () =>
    import("./chart/MarketCapChart").then(
      (mod) => mod.MarketCapChart
    ),
  { ssr: false }
);

const LandPriceChart = dynamic(
  () =>
    import("./chart/LandPriceChart").then(
      (mod) => mod.LandPriceChart
    ),
  { ssr: false }
);

const SOURCE_LABEL = "日本取引所グループ「市場別時価総額」";
const SOURCE_URL = "https://www.jpx.co.jp/markets/statistics-equities/misc/02.html";

const LAND_PRICE_SOURCE_LABEL = "国土交通省「地価公示」";
const LAND_PRICE_SOURCE_URL = "https://www.mlit.go.jp/totikensangyo/totikensangyo_fr4_000043.html";

export default function JapanEconomicHistoryCharts() {
  return (
    <div className={styles.charts}>
      <ArticleChart
        title="株式時価総額の推移"
        yearRange="（1949〜202）"
        source={SOURCE_LABEL}
        sourceUrl={SOURCE_URL}
      >
        <MarketCapChart />
      </ArticleChart>

      <ArticleChart
        title="地価公示 対前年変動率の推移"
        yearRange="（1975〜2026）"
        source={LAND_PRICE_SOURCE_LABEL}
        sourceUrl={LAND_PRICE_SOURCE_URL}
      >
        <LandPriceChart />
      </ArticleChart>
    </div>
  );
}
