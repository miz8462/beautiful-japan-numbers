"use client";

import { ArticleChart } from "@/components/article/article-chart";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import DeadVoteChart from "./charts/dead-vote-chart/DeadVoteChart";

const TurnoutLineChart = dynamic(() => import("./charts/TurnoutLineChart"), { ssr: false });

export default function VoterTurnoutCharts() {
  return (
    <div className={styles.charts}>
      <ArticleChart
        title="60代の投票率は高く、20代は低い"
        source="総務省 選挙結果"
        sourceUrl="https://www.soumu.go.jp/senkyo/senkyo_s/news/sonota/nendaibetu/"
      >
        <TurnoutLineChart />
        <p className="text-secondary" style={{ fontSize: "12px", textAlign: "end", }} >※10代の投票率は2017年以降</p>
      </ArticleChart>
      <ArticleChart
        title="小選挙区では約半分の投票が議席に反映されない"
      >
        <DeadVoteChart />
      </ArticleChart>
    </div>
  );
}
