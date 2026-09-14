"use client";

import { ArticleChart } from "@/components/article/article-chart";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import dynamic from "next/dynamic";
import styles from "./page.module.css";

const CityBars = dynamic(() => import("./charts/CityBars"), { ssr: false });
const TotalPopChart = dynamic(() => import("./charts/TotalPopChart"), { ssr: false });
const BirthDeathChart = dynamic(() => import("./charts/BirthDeathChart"), { ssr: false });
const NaturalSocialChart = dynamic(() => import("./charts/NaturalSocialChart"), { ssr: false });

const SOURCE_JUMIN = "総務省「住民基本台帳に基づく人口、人口動態及び世帯数（2024年）」";
const SOURCE_JUMIN_URL = "https://www.soumu.go.jp/main_sosiki/jichi_gyousei/daityo/jinkou_jinkoudoutai-setaisuu.html";
const SOURCE_JINSUI = "総務省統計局「人口推計」";
const SOURCE_JINSUI_URL = "https://www.stat.go.jp/data/jinsui/2.html";

export default function PopulationCharts() {
  return (
    <>
      {/* チャート1: 総人口推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title="日本の総人口の長期推移"
          subtitle="1980〜2024年の推移（万人）"
          source={SOURCE_JINSUI}
          sourceUrl={SOURCE_JINSUI_URL}
        >
          <TotalPopChart />
        </ArticleChart>
      </div>

      {/* 解説1 */}
      <ArticleText>
        <p>
          日本の総人口は、高度経済成長期から2000年代半ばにかけて一貫して増加を続けていましたが、<strong>2008年の1億2,808万人をピーク</strong>に減少局面へと突入しました。
        </p>
        <p>
          2024年時点の総人口は1億2,388万人となり、ピーク時から400万人以上が減少しています。
          この減少ペースは年々加速しており、日本の社会経済や地域社会に大きな構造変化をもたらしています。
        </p>
      </ArticleText>

      {/* チャート2: 出生数と死亡数 */}
      <div className={styles.charts}>
        <ArticleChart
          title="出生数と死亡数の推移（自然減の拡大）"
          subtitle="2000〜2023年の推移（万人）"
          source={SOURCE_JINSUI}
          sourceUrl={SOURCE_JINSUI_URL}
        >
          <BirthDeathChart />
        </ArticleChart>
      </div>

      {/* 解説2 */}
      <ArticleText>
        <p>
          人口減少の主因は、生まれる子どもの数（出生数）よりも亡くなる人の数（死亡数）が多い<strong>「自然減」</strong>です。
        </p>
        <p>
          2000年には年間約119万人いた出生数は2023年には73万人へと約4割減少した一方、高齢化に伴い死亡数は年間96万人から159万人へと急増しました。
          2007年に死亡数が出生数を上回る「デッドクロス」が発生して以降、自然減の幅は年々拡大し続けています。
        </p>
      </ArticleText>

      {/* チャート3: 自然増減と社会増減 */}
      <div className={styles.charts}>
        <ArticleChart
          title="自然増減と社会増減（国際移動等）の内訳"
          subtitle="2010〜2023年の推移（万人）"
          source={SOURCE_JINSUI}
          sourceUrl={SOURCE_JINSUI_URL}
        >
          <NaturalSocialChart />
        </ArticleChart>
      </div>

      {/* 解説3 */}
      <ArticleText>
        <p>
          人口変動の内訳を「自然動態（出生−死亡）」と「社会動態（入国−出国）」に分解すると、外国人労働者や留学生などの流入増加によって<strong>「社会増」が年間十数万〜数十万人規模でプラス</strong>に寄与していることが分かります。
        </p>
        <p>
          しかし、年間80万人規模に達する急激な自然減を社会増だけで相殺することは難しく、人口減少トレンドの基調は変わっていません。
        </p>
      </ArticleText>

      {/* チャート4: 都市規模との対比 */}
      <div className={styles.charts}>
        <ArticleChart
          title="年間減少数（58万人）のインパクト：主要都市人口との比較"
          subtitle="減少規模を政令指定都市等の人口で換算（年数）"
          source={SOURCE_JUMIN}
          sourceUrl={SOURCE_JUMIN_URL}
        >
          <CityBars />
        </ArticleChart>
      </div>

      {/* 解説4 */}
      <ArticleText>
        <p>
          1年間に58万人が減少するという数字は、地方の中核都市である<strong>仙台市（人口約106万人）なら約1.9年分、福岡市（約160万人）なら約2.8年分</strong>の街が丸ごと消失する規模に匹敵します。
        </p>
        <p>
          労働力不足や地域インフラの維持、社会保障制度の持続可能性など、人口減少が投げかける問いは多岐にわたります。
          感情論ではなく確かな数字を基点として、社会の縮小と共存するための設計が求められています。
        </p>
      </ArticleText>
    </>
  );
}
