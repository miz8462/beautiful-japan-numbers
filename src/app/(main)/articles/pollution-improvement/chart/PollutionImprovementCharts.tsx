"use client";

import { ArticleChart } from "@/components/article/article-chart";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import dynamic from "next/dynamic";
import styles from "../page.module.css";

const SpmAchievementChart = dynamic(
  () =>
    import(
      "./SpmAchievementChart/SpmAchievementChart"
    ).then((mod) => mod.SpmAchievementChart),
  { ssr: false }
);

const WaterQualityAchievementChart = dynamic(
  () =>
    import(
      "./WaterQualityAchievementChart/WaterQualityAchievementChart"
    ).then((mod) => mod.WaterQualityAchievementChart),
  { ssr: false }
);

const SPM_SOURCE_LABEL = "環境統計集(令和7年版) 6章大気環境「浮遊粒子状物質環境基準達成状況の推移」";
const WATER_SOURCE_LABEL = "環境統計集(令和7年版) 5章水環境「環境基準達成率の推移(BODまたはCOD)」";
const SOURCE_URL = "https://www.env.go.jp/doc/toukei.html";

export default function PollutionImprovementCharts() {
  return (
    <>
      {/* 4. SPM達成率チャート */}
      <div className={styles.charts}>
        <ArticleChart
          title="浮遊粒子状物質（SPM）環境基準達成率の推移"
          yearRange="（1985〜2023年度）"
          source={SPM_SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <SpmAchievementChart />
        </ArticleChart>
      </div>

      {/* 5. 自排局に関する解説文 */}
      <ArticleText>
        <p>
          SPMの達成率において顕著だったのは、一般環境大気測定局（一般局）と自動車排出ガス測定局（自排局）の格差です。
          1980年代から1990年代にかけて、一般局の達成率がおおむね50〜60%台で推移していたのに対し、
          主要幹線道路沿いに設置された自排局では<strong>20〜30%台と極めて深刻な未達成状態</strong>が続いていました。
          交通集中に伴うディーゼル排ガスや粉じんが、沿道住民の健康に直結する環境課題となっていたことを物語っています。
        </p>
        <p>
          この状況を一変させたのが、自動車NOx・PM法の施行や自治体主導のディーゼル車排出ガス規制、
          燃料中の硫黄分低減（サルファーフリー化）、および微粒子捕集フィルター（DPF）の普及です。
          2000年代半ば以降、自排局の達成率は急上昇し、現在では一般局・自排局ともに100%近い達成水準が維持されています。
        </p>
      </ArticleText>

      {/* 6. BOD/COD達成率チャート */}
      <div className={styles.charts}>
        <ArticleChart
          title="公共用水域の環境基準達成率の推移（BOD/COD）"
          yearRange="（1974〜2023年度）"
          source={WATER_SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <WaterQualityAchievementChart />
        </ArticleChart>
      </div>

      {/* 7. 湖沼特有の課題についての解説文 */}
      <ArticleText>
        <p>
          公共用水域の水質達成率（河川はBOD、湖沼・海域はCOD）を水域別に見ると、水域の特性による明確な明暗が現れています。
          水の流れが速く自浄作用が働きやすい河川は、下水道整備や工場排水規制の進展とともに1974年の51.3%から2023年には<strong>93.8%</strong>へと大幅に改善しました。海域も8割前後の達成率を維持しています。
        </p>
        <p>
          一方で、水が長期間滞留する<strong>湖沼（COD）の達成率は1974年（41.9%）から2023年（52.6%）にかけて50%前後でほぼ横ばい</strong>にとどまっています。
          閉鎖性水域では、流入した窒素やリンによる富栄養化が進み、水中の植物プランクトンが内部生産されるため、
          生活排水対策や流域規制を行っても水質改善に長期間を要するという構造的な難しさが浮き彫りとなっています。
        </p>
      </ArticleText>
    </>
  );
}
