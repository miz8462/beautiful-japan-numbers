"use client";

import { ArticleChart } from "@/components/article/article-chart";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const MainExpenditureAreaChart = dynamic(
  () =>
    import("./chart/MainExpenditureAreaChart").then(
      (mod) => mod.MainExpenditureAreaChart
    ),
  { ssr: false }
);

const SocialSecurityShareChart = dynamic(
  () =>
    import("./chart/SocialSecurityShareChart").then(
      (mod) => mod.SocialSecurityShareChart
    ),
  { ssr: false }
);

type Props = {
  sourceLabel: string;
  sourceUrl?: string;
};

export default function ExpenditureCharts({ sourceLabel, sourceUrl }: Props) {
  return (
    <>
      <div className={styles.chartSection}>
        <ArticleChart
          title="主要経費別歳出の推移"
          yearRange="（1967〜2024年度）"
          source={sourceLabel}
          sourceUrl={sourceUrl}
        >
          <MainExpenditureAreaChart />
        </ArticleChart>
      </div>

      <div className={styles.chartSection}>
        <ArticleChart
          title="社会保障関係費の歳出全体に占める割合の推移"
          source={sourceLabel}
          sourceUrl={sourceUrl}
        >
          <SocialSecurityShareChart />
        </ArticleChart>
      </div>
    </>
  );
}
