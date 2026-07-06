"use client";

import { ArticleChart } from "@/components/article/article-chart";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import FemaleParticipationChart from "./charts/FemaleParticipation/FemaleParticipationChart";
import FemaleWinRateChart from "./charts/FemaleWinRate/FemaleWinRateChart";

const AgeStructureChart = dynamic(() => import("./charts/AgeStructure/AgeStructureChart"), { ssr: false });

export default function DietMembersCharts() {
  return (
    <div className={styles.charts}>
      <ArticleChart
        title="女性候補者・議員の割合は緩やかに上昇"
        source="総務省「衆議院議員総選挙結果調」"
        sourceUrl="https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html"
      >
        <FemaleParticipationChart />
      </ArticleChart>

      <ArticleChart
        title="当選率の男女格差は縮まっているが依然として男性が高い"
        source="総務省「衆議院議員総選挙結果調」"
        sourceUrl="https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html"
      >
        <FemaleWinRateChart />
      </ArticleChart>

      <ArticleChart
        title="当選議員の年齢構成の推移"
        source="総務省「衆議院議員総選挙結果調」"
        sourceUrl="https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html"
      >
        <AgeStructureChart />
        <p className="text-secondary" style={{ fontSize: "12px", marginTop: "8px", lineHeight: "1.6" }}>
          ※ 2024年（第50回）および2026年（第51回）は比例代表の年齢別データ未公表のため、小選挙区当選者のみのデータとなっています。
        </p>
      </ArticleChart>
    </div>
  );
}
