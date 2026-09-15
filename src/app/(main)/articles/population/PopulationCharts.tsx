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
          subtitle="1980〜2024年（万人）"
          source={SOURCE_JINSUI}
          sourceUrl={SOURCE_JINSUI_URL}
        >
          <TotalPopChart />
        </ArticleChart>
      </div>

      {/* 解説1 */}
      <ArticleText>
        <p>
          日本の総人口は、高度経済成長期から2000年代半ばまで一貫して増加を続けてきましたが、2008年の1億2,808万人をピークに減少局面へと転じました。
        </p>
        <p>
          2024年時点の総人口は1億2,388万人となり、ピークから400万人以上が減少しています。
          減少のペースは年を追うごとに加速しており、労働力人口の縮小や地方の過疎化など、社会や地域の構造そのものを揺るがし始めています。
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
          人口減少の主因は<strong>「自然減」</strong>——生まれる子どもの数（出生数）よりも、亡くなる人の数（死亡数）が多いことにあります。        </p>
        <p>
          出生数は2000年の約119万人から2023年には73万人へと、4割近く落ち込みました。
          一方の死亡数は、高齢化を背景に96万人から159万人へと急増しています。
          2007年、死亡数が出生数を初めて上回る「デッドクロス」が発生して以降、この自然減の幅は年々拡大し続けているのです。
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
          人口変動は、「自然動態(出生−死亡)」と「社会動態(入国−出国)」の2つに分解できます。
          このうち社会動態については、外国人労働者や留学生の流入増加を背景に、<strong>「社会増」が年間十数万〜数十万人</strong>規模でプラスに寄与しています。        </p>
        <p>
          しかし、年間80万人規模にまで達する自然減の勢いを、社会増だけで補うのは困難です。
          人口減少という大きなトレンドそのものは、依然として変わっていません。
        </p>
      </ArticleText>

      {/* チャート4: 都市規模との対比 */}
      <div className={styles.charts}>
        <ArticleChart
          title={<>年間減少数（58万人）のインパクト<br />主要都市人口との比較</>}
          subtitle="政令指定都市等の人口と比較（年数）"
          source={SOURCE_JUMIN}
          sourceUrl={SOURCE_JUMIN_URL}
        >
          <CityBars />
        </ArticleChart>
      </div>

      {/* 解説4 */}
      <ArticleText>
        <p>
          1年間に58万人が減少するというのは、地方の中核都市である<strong>仙台市(人口約106万人)がまるごと2年足らず、福岡市(約160万人)なら3年足らず</strong>で消えてしまう規模に匹敵します。
        </p>
        <p>
          労働力不足、地域インフラの維持、社会保障制度の持続可能性——人口減少が投げかける問いは多岐にわたります。
          感情論ではなく、確かな数字を基点に、社会の縮小と共存していくための設計が求められています。
        </p>
      </ArticleText>
    </>
  );
}
