"use client";

import { ArticleChart } from "@/components/article/article-chart";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import FemaleParticipationChart from "./charts/FemaleParticipation/FemaleParticipationChart";
import FemaleWinRateChart from "./charts/FemaleWinRate/FemaleWinRateChart";

const AgeStructureChart = dynamic(() => import("./charts/AgeStructure/AgeStructureChart"), { ssr: false });

const SOURCE_LABEL = "総務省「衆議院議員総選挙結果調」";
const SOURCE_URL = "https://www.soumu.go.jp/senkyo/senkyo_s/data/index.html";

export default function DietMembersCharts() {
  return (
    <>
      {/* チャート1: 女性比率の推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title="衆議院選挙における女性候補者・議員の割合の推移"
          subtitle="1946〜2026年の推移（%）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <FemaleParticipationChart />
        </ArticleChart>
      </div>

      {/* 解説1 */}
      <ArticleText>
        <p>
          1946年の総選挙では39名（8.4%）の女性議員が誕生しましたが、その後は長らく1〜2%台の極めて低い水準で低迷しました。
          1990年代以降、女性候補者の擁立増加に伴い緩やかな上昇トレンドに入り、2026年（第51回衆院選）には過去最高の14.6%に達しました。
          しかし、女性候補者の割合（24.4%）や国際標準（列国議会同盟IPU加盟国平均約26%）と比較すると、依然として大きな開きが存在します。        </p>
      </ArticleText>

      {/* チャート2: 男女別当選率 */}
      <div className={styles.charts}>
        <ArticleChart
          title="男女別・衆議院選挙候補者の当選率の推移"
          subtitle="1946〜2026年の推移（%）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <FemaleWinRateChart />
        </ArticleChart>
      </div>

      {/* 解説2 */}
      <ArticleText>
        <p>
          候補者数に対する当選者の割合（当選率）を男女別に比較すると、歴史的に男性候補者の当選率（おおむね30〜50%）が女性（10〜25%前後）を大きく上回る構図が続いてきました。
          直近の2026年選挙でも、男性の当選率（40.9%）に対し女性は21.7%と、約19ポイントの格差が残っています。
        </p>
      </ArticleText>

      {/* チャート3: 年齢構成の推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title="当選議員の年代別構成比の推移"
          subtitle="1946〜2026年の推移（%）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
          note="※2024年（第50回）および2026年（第51回）は比例代表の年齢別データ未公表のため、小選挙区当選者のみのデータとなっています。"
        >
          <AgeStructureChart />
        </ArticleChart>
      </div>

      {/* 解説3 */}
      <ArticleText>
        <p>
          1950〜1970年代の国会では40〜50代が議員の中核を占め、60代以上の割合は10〜20%程度にとどまっていました。
          2026年の第51回衆院選ではこの割合が40.1%に達し、戦後最高の水準となっています。
          一方、20〜30代の若手議員の割合は合計しても6.2%にとどまっています。
        </p>
      </ArticleText>
    </>
  );
}
