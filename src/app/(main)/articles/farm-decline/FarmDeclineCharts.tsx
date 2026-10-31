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
      <ArticleText>
        <p>
販売農家は、調査のたびに減っています。1985年の331万戸が、1995年に265万戸、2005年に196万戸、2015年に133万戸、2025年に79万戸。
        </p>
        <p>
          5年あたりの減少数は、1990年の34.4万戸から2025年の23.5万戸へ縮小しました。一方、減少率は10.4%から22.9%に上がっています。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="販売農家数の推移"
          subtitle="1985年〜2025年"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <SalesFarmHouseholdsChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          基幹的農業従事者のうち、60歳以上の割合は1995年の58.4%から2015年の78.7%へ上がりました。2025年は77.8%で、10年前をわずかに下回ります。
        </p>
        <p>
          30〜59歳は40.0%から20.9%へ、30歳未満は1.6%から1.2%へ。2025年の実数では、30歳未満が1.3万人、80歳以上が16.7万人です。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="基幹的農業従事者の年齢構成の変化"
          subtitle="1995年〜2025年"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <AgeCompositionChart />
        </ArticleChart>
      </div>

      <ArticleText>
        <p>
          耕作放棄地は、1975年の13.1万haから2015年の42.3万haへ、40年で3.2倍になりました。
        </p>
        <p>
          2020年の調査から、耕作放棄地の項目は廃止されています。以降は「荒廃農地」を対象とする別の調査に移ったため、この系列のデータは2015年までです。
        </p>
      </ArticleText>

      <div className={styles.charts}>
        <ArticleChart
          title="耕作放棄地面積の推移"
          subtitle="1975年〜2015年"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <AbandonedFarmlandChart />
        </ArticleChart>
      </div>
    </>
  );
}
