"use client";

import { ArticleChart } from "@/components/article/article-chart";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import GapChart from "./GapChart/GapChart";

const SmdVsPrChart = dynamic(
  () => import("@/app/(main)/articles/election-smd-vs-pr/SmdVsPrChart/SmdVsPrChart"),
  { ssr: false }
);

export default function ElectionSmdVsPrCharts() {
  return (
    <div className={styles.charts}>
      <ArticleChart
        title="小選挙区の獲得議席割合は比例得票率と大きく乖離する"
        source="総務省「衆議院議員総選挙結果調」"
        sourceUrl="https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html"
      >
        <SmdVsPrChart />
      </ArticleChart>

      <ArticleChart
        title="(小選挙区獲得議席割合) − (比例得票率)"
        source="総務省「衆議院議員総選挙結果調」"
        sourceUrl="https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html"
      >
        <GapChart />
      </ArticleChart>
    </div>
  );
}
