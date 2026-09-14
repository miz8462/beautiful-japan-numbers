"use client";

import { ArticleChart } from "@/components/article/article-chart";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import DeadVoteChart from "./charts/DeadVote/DeadVoteChart";

const TurnoutLineChart = dynamic(() => import("./charts/TurnoutLineChart"), { ssr: false });

const SOURCE_TURNOUT = "総務省「衆議院議員総選挙における年代別投票率の推移」";
const SOURCE_TURNOUT_URL = "https://www.soumu.go.jp/senkyo/senkyo_s/news/sonota/nendaibetu/";

export default function VoterTurnoutCharts() {
  return (
    <>
      {/* チャート1: 年代別投票率推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title="年代別・衆議院議員選挙の投票率推移"
          subtitle="1967〜2024年の推移（%）"
          source={SOURCE_TURNOUT}
          sourceUrl={SOURCE_TURNOUT_URL}
          note="※10代の投票率は2016年の18歳選挙権施行（第48回・2017年衆院選）以降のデータです。"
        >
          <TurnoutLineChart />
        </ArticleChart>
      </div>

      {/* 解説1 */}
      <ArticleText>
        <p>
          日本の国政選挙（衆議院総選挙）における投票率は、昭和後期の1960〜1980年代には<strong>70%台前半</strong>で安定して推移していました。
          しかし、1990年代半ばの小選挙区比例代表並立制導入以降は低下傾向を強め、2014年には過去最低となる52.66%を記録。近年も50%台前半の低空飛行が続いています。
        </p>
        <p>
          年代別に見ると、世代間の格差は歴然としています。
          60代の投票率が一貫して<strong>70%前後〜80%台</strong>の高い水準を保ち続けているのに対し、20代の投票率は1990年代以降30%台まで急落しました。
          直近の2024年選挙でも、60代（68.02%）と20代（34.62%）の間には<strong>約2倍の開き</strong>が存在します。
        </p>
      </ArticleText>

      {/* チャート2: 死票の割合 */}
      <div className={styles.charts}>
        <ArticleChart
          title="選挙制度と「死票」の割合（2026年第51回衆院選）"
          subtitle="小選挙区と比例代表における死票率の対比（%）"
        >
          <DeadVoteChart />
        </ArticleChart>
      </div>

      {/* 解説2 */}
      <ArticleText>
        <p>
          投票率の低下だけでなく、「投じられた票が議席にどう結びついているか」という選挙制度の構造も重要な視点です。
        </p>
        <p>
          各選挙区で1人しか当選しない<strong>小選挙区制では、全体の48.0%（約2,735万票）が当選者以外の候補に投じられた「死票」</strong>となりました。
          一方、得票数に応じて議席が配分される比例代表制では、獲得議席がゼロだった政党への票を除く<strong>94.7%の票が議席に反映</strong>されています。
        </p>
        <p>
          若年層の政治的無関心や投票率の世代間格差、そして死票が多く生まれる選挙制度の特性。
          「誰が投票所に足を運び、どのような声が国政に届いているのか」を、感情ではなく数字の事実から見つめ直すことが求められます。
        </p>
      </ArticleText>
    </>
  );
}
