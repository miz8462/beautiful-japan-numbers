"use client";

import { ArticleChart } from "@/components/article/article-chart";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const CityBars = dynamic(() => import("./charts/CityBars"), { ssr: false });
const TotalPopChart = dynamic(() => import("./charts/TotalPopChart"), { ssr: false });
const BirthDeathChart = dynamic(() => import("./charts/BirthDeathChart"), { ssr: false });
const NaturalSocialChart = dynamic(() => import("./charts/NaturalSocialChart"), { ssr: false });

export default function PopulationCharts() {
  return (
    <div className={styles.charts}>
      <ArticleChart
        title="年間58万人の減少は、仙台市の人口規模なら約1.9年分に相当"
        source="総務省 住民基本台帳(2024)"
        sourceUrl="https://www.soumu.go.jp/main_sosiki/jichi_gyousei/daityo/jinkou_jinkoudoutai-setaisuu.html"
      >
        <CityBars />
      </ArticleChart>

      <ArticleChart
        title="2008年をピークに、日本の総人口は減少し続けている"
        source="出典: 総務省統計局 人口推計"
        sourceUrl="https://www.stat.go.jp/data/jinsui/2.html"
      >
        <TotalPopChart />
      </ArticleChart>

      <ArticleChart
        title="2007年以降、死亡数が出生数を上回り続けている"
        source="出典: 総務省統計局 人口推計"
        sourceUrl="https://www.stat.go.jp/data/jinsui/2.html"
      >
        <BirthDeathChart />
      </ArticleChart>

      <ArticleChart
        title="人口変化は、自然減を社会増が一部補う構図が続く"
        source="出典: 総務省統計局 人口推計"
        sourceUrl="https://www.stat.go.jp/data/jinsui/2.html"
      >
        <NaturalSocialChart />
      </ArticleChart>
    </div >
  );
}
