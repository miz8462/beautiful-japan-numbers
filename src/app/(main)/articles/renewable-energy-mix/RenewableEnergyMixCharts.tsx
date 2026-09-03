"use client";

import { ArticleChart } from "@/components/article/article-chart";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import renewableEnergyData from "@/data/renewable-energy-mix.json";

const PowerSourceMixChart = dynamic(
  () =>
    import("./chart/PowerSourceMixChart").then(
      (mod) => mod.PowerSourceMixChart
    ),
  { ssr: false }
);

const NonFossilShareChart = dynamic(
  () =>
    import("./chart/NonFossilShareChart").then(
      (mod) => mod.NonFossilShareChart
    ),
  { ssr: false }
);

const RenewableBreakdownChart = dynamic(
  () =>
    import("./chart/RenewableBreakdownChart").then(
      (mod) => mod.RenewableBreakdownChart
    ),
  { ssr: false }
);

const SOURCE_LABEL = "資源エネルギー庁「エネルギー白書」「エネルギー需給実績」";
const SOURCE_URL = "https://www.enecho.meti.go.jp/about/whitepaper/";

export default function RenewableEnergyMixCharts() {
  return (
    <div className={styles.charts}>
      <ArticleChart
        title="電源構成の推移"
        yearRange="（1952〜2024年度）"
        source={SOURCE_LABEL}
        sourceUrl={SOURCE_URL}
        note="1952〜2009年度は資源エネルギー庁「電源開発の概要」等を基にエネルギー白書2023がまとめた数値、2010〜2024年度は資源エネルギー庁「エネルギー需給実績(確報)」の数値。2010年度を境に算出方法が異なるため接続には注意。"
      >
        <PowerSourceMixChart />
      </ArticleChart>

      <ArticleChart
        title="非化石電源比率の推移"
        yearRange="（1952〜2024年度）"
        source={SOURCE_LABEL}
        sourceUrl={SOURCE_URL}
      >
        <NonFossilShareChart />
      </ArticleChart>

      <ArticleChart
        title="再生可能エネルギー内訳の推移"
        yearRange="（2010〜2024年度）"
        source={SOURCE_LABEL}
        sourceUrl={SOURCE_URL}
      >
        <RenewableBreakdownChart />
      </ArticleChart>
    </div>
  );
}
