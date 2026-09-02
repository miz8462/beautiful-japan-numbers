"use client";

import { ArticleChart } from "@/components/article/article-chart";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const EmissionsTrendChart = dynamic(
  () =>
    import(
      "./chart/EmissionsTrendChart/EmissionsTrendChart"
    ).then((mod) => mod.EmissionsTrendChart),
  { ssr: false }
);

const GasTypeShareChart = dynamic(
  () =>
    import(
      "./chart/GasTypeShareChart/GasTypeShareChart"
    ).then((mod) => mod.GasTypeShareChart),
  { ssr: false }
);

const SectorEmissionsChart = dynamic(
  () =>
    import(
      "./chart/SectorEmissionsChart/SectorEmissionsChart"
    ).then((mod) => mod.SectorEmissionsChart),
  { ssr: false }
);

const PerCapitaEmissionsChart = dynamic(
  () =>
    import(
      "./chart/PerCapitaEmissionsChart/PerCapitaEmissionsChart"
    ).then((mod) => mod.PerCapitaEmissionsChart),
  { ssr: false }
);

const SOURCE_LABEL = "国立環境研究所（温室効果ガスインベントリオフィス）";
const SOURCE_URL = "https://www.nies.go.jp/gio/archive/ghgdata/index.html";

export default function GHGEmissionsCharts() {
  return (
    <>
      {/* 3. 総排出量の推移チャート */}
      <div className={styles.charts}>
        <ArticleChart
          title="温室効果ガス総排出量の推移"
          yearRange="（1990〜2024年度）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <EmissionsTrendChart />
        </ArticleChart>
      </div>

      {/* 4. ガス種別内訳の説明文 */}
      <ArticleText>
        <p>
          日本が排出する温室効果ガスの大部分は<strong>二酸化炭素（CO2）</strong>であり、
          総排出量全体の<strong>9割超（2024年度時点で約92.8%）</strong>を占めています。
          化石燃料の燃焼を中心とするエネルギー起源CO2がその中核です。
        </p>
        <p>
          メタン（CH4）や一酸化二窒素（N2O）は農業や廃棄物処理の改善により長期的に減少傾向にあります。
          一方、オゾン層破壊物質からの転換に伴って冷媒等として普及した「代替フロン等4ガス（HFCsなど）」は、
          1990年代後半から一時増加傾向を示したものの、近年の回収・代替技術の進展により横ばいから微減基調へと移行しています。
        </p>
      </ArticleText>

      {/* 5. ガス種別内訳チャート */}
      <div className={styles.charts}>
        <ArticleChart
          title="ガス種別の構成比推移"
          yearRange="（1990〜2024年度）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <GasTypeShareChart />
        </ArticleChart>
      </div>

      {/* 6. 部門別排出量の傾向についての説明文 */}
      <ArticleText>
        <p>
          CO2排出量を電力・熱の消費量に応じて各最終需要部門に配分した「電気・熱配分後」の部門別排出量を見ると、
          全5部門（産業・運輸・業務その他・家庭・エネルギー転換）のすべてでそれぞれのピーク時から<strong>25%〜34%の大幅な減少</strong>を達成しています。
        </p>
        <p>
          産業部門は1990年度をピークに製造業の省エネ進展や産業構造の変化を通じて33.9%減、
          運輸部門は2001年度をピークに自動車の燃費向上やハイブリッド車の普及により28.8%減となりました。
          また、業務その他部門および家庭部門は2013年度にピークを迎えた後、省エネ家電や高効率機器の普及、
          建築物の断熱性能向上、電力の低炭素化に伴い約3割減少しています。
        </p>
      </ArticleText>

      {/* 7. 部門別CO2排出量チャート */}
      <div className={styles.charts}>
        <ArticleChart
          title="部門別CO2排出量の推移（電気・熱配分後）"
          yearRange="（1990〜2024年度）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <SectorEmissionsChart />
        </ArticleChart>
      </div>

      {/* 8. 一人当たり排出量についての説明文 */}
      <ArticleText>
        <p>
          国民一人当たりの温室効果ガス排出量は、2024年度で<strong>8.45トン（CO2換算）</strong>となり、
          ピーク時である1996年度（11.00トン）と比べて<strong>23.2%減少</strong>しました。
        </p>
        <p>
          総排出量のピークが2013年度であったのに対し、一人当たり排出量のピークが1996年度と大きく異なるのは、
          国内の人口動態と密接に関係しています。
          1990年代から2000年代にかけては人口が増加基調にあったため、社会全体の排出総量が増加する中でも
          1990年代後半以降の一人当たり排出量は高止まりから微減傾向へと向かっていました。
          2010年代以降は人口減少と脱炭素化の双方が重なり、一人当たり・総量ともに減少傾向が定着しています。
        </p>
      </ArticleText>

      {/* 9. 一人当たり排出量チャート */}
      <div className={styles.charts}>
        <ArticleChart
          title="一人当たり温室効果ガス排出量の推移"
          yearRange="（1990〜2024年度）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <PerCapitaEmissionsChart />
        </ArticleChart>
      </div>
    </>
  );
}
