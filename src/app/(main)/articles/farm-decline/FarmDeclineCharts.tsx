"use client";

import { ArticleChart } from "@/components/article/article-chart";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const SalesFarmHouseholdsChart = dynamic(
  () =>
    import(
      "./chart/SalesFarmHouseholdsChart/SalesFarmHouseholdsChart"
    ).then((mod) => mod.SalesFarmHouseholdsChart),
  { ssr: false }
);

const AgeCompositionChart = dynamic(
  () =>
    import(
      "./chart/AgeCompositionChart/AgeCompositionChart"
    ).then((mod) => mod.AgeCompositionChart),
  { ssr: false }
);

const AbandonedFarmlandChart = dynamic(
  () =>
    import(
      "./chart/AbandonedFarmlandChart/AbandonedFarmlandChart"
    ).then((mod) => mod.AbandonedFarmlandChart),
  { ssr: false }
);

const SOURCE_LABEL = "農林水産省「農林業センサス」";
const SOURCE_URL = "https://www.maff.go.jp/j/tokei/kouhyou/noucen/index.html";

export default function FarmDeclineCharts() {
  return (
    <>
      <div className={styles.charts}>
        <ArticleChart
          title="販売農家数の推移"
          yearRange="（1985〜2025年）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <SalesFarmHouseholdsChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          農家の減少とともに深刻化しているのが、農業に従事する人々の<strong>高齢化</strong>です。
          基幹的農業従事者の年齢構成を見ると、1995年には60歳以上の割合が約58%でしたが、
          その後も一貫して増加し続けています。高齢の農業者が離農する一方で、
          若い世代の農業への新規参入は限られており、従事者の平均年齢は上昇し続けています。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="基幹的農業従事者の年齢構成の変化"
          yearRange="（1995〜2025年、10年ごと）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <AgeCompositionChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          農業者の高齢化が進み、後継者がいないまま農業を辞めると、
          それまで耕されていた農地が放置されてしまいます。こうして生まれるのが<strong>耕作放棄地</strong>です。
          1975年には約13万haだった耕作放棄地は、農家数の減少と高齢化が加速した1990年代以降、
          急激に増加しました。農地の荒廃は、食料生産能力の低下だけでなく、
          農村景観の変化や生態系への影響という点でも社会的な問題となっています。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="耕作放棄地面積の推移"
          yearRange="（1975〜2015年）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <AbandonedFarmlandChart />
        </ArticleChart>
      </div>
    </>
  );
}
