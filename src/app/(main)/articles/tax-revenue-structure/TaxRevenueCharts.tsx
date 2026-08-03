"use client";

import { ArticleChart } from "@/components/article/article-chart";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const TaxRevenueAreaChart = dynamic(
  () =>
    import("./chart/TaxRevenueAreaChart").then(
      (mod) => mod.TaxRevenueAreaChart
    ),
  { ssr: false }
);

const SOURCE_LABEL = "財務省「税収に関する資料」";
const SOURCE_URL = "https://www.mof.go.jp/tax_policy/summary/condition/a03.htm";

export default function TaxRevenueCharts() {
  return (
    <div className={styles.charts}>
      <ArticleChart
        title="一般会計税収の税目別内訳の推移"
        yearRange="（1979〜2024年度）"
        source={SOURCE_LABEL}
        sourceUrl={SOURCE_URL}
      >
        <TaxRevenueAreaChart />
      </ArticleChart>
    </div>
  );
}
