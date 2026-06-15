"use client";

import { ArticleChart } from "@/components/article/article-chart";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const TurnoutLineChart = dynamic(() => import("./charts/TurnoutLineChart"), { ssr: false });

export default function VoterTurnoutCharts() {
  return (
    <div className={styles.charts}>
      <ArticleChart
        title="衆院選の投票率は、60代が高く、20代は全体を大きく下回る"
        source="総務省 選挙結果"
        sourceUrl="https://www.soumu.go.jp/senkyo/senkyo_s/news/sonota/nendaibetu/"
      >
        <TurnoutLineChart />
        <p className="text-secondary" style={{ fontSize: "12px", textAlign: "end", }} >※10代の投票率は2017年以降</p>
      </ArticleChart>
    </div>
  );
}
