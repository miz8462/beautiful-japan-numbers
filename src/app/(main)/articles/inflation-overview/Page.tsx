import { articles } from "@/app/(main)/articles/articles";
import { CpiIndexChart } from "@/app/(main)/articles/inflation-overview/charts/CpiIndexChart";
import { CpiYoyChart } from "@/app/(main)/articles/inflation-overview/charts/CpiYoyChart";
import {
  type PriceRankingComparison
} from "@/app/(main)/articles/inflation-overview/charts/PriceRankingTable/PriceRankingTable";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import cpiData from "@/data/cpi-japan.json";
import priceRankingData from "@/data/price-ranking.json";
import type { CpiJson } from "@/types/cpi";
import { PriceRankingTable } from "./charts/PriceRankingTable/PriceRankingTable";
import styles from "./page.module.css";

const data = cpiData as CpiJson;
const priceRanking = priceRankingData as {
  latestYear: number;
  comparison2020: PriceRankingComparison;
  comparison1990: PriceRankingComparison;
};

const SOURCE_LABEL = "総務省統計局「消費者物価指数（2020年基準）」";
const SOURCE_URL = "https://www.e-stat.go.jp/stat-search/files?toukei=00200573&tstat=000001150147";

export default function InflationOverviewPage() {
  const article = articles.find((a) => a.href === "/articles/inflation-overview");
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事ヘッダー */}
      <ArticleHeader article={article} />

      {/* KPIセクション */}
      <KPISection title="日本の物価水準とインフレ率の現状（2025年）">
        <KPIPrimary
          label="総合CPI指数（2025年）"
          value="111.9"
          caption="2020年（100.0）比で +11.9% 上昇"
        />
        <KPIGrid>
          <KPICard
            label="2025年 インフレ率（前年比）"
            value="+3.2%"
            caption="総合消費者物価指数の年間上昇率"
          />
          <KPICard
            label="コアCPI（生鮮食品除く）"
            value="111.2"
            caption="2020年比 +11.2%"
          />
          <KPICard
            label="コアコアCPI（食料・エネルギー除く）"
            value="105.4"
            caption="基調的な物価も持続的にプラス"
          />
          <KPICard
            label="1990→2025 上昇幅"
            value="+24.9%"
            caption="バブル期（89.6）からの35年間累計"
          />
        </KPIGrid>
      </KPISection>

      {/* 導入解説 */}
      <ArticleText>
        <p>
          消費者物価指数（CPI）は、家計が購入する商品やサービスの価格水準を指数化したもので、「総合」から天候要因で変動しやすい生鮮食品を除いたものが「コア」、さらにエネルギーも除いて基調的な物価変化を見やすくしたものが「コアコア」です。
        </p>
        <p>
          1990年代半ばから2010年代初頭にかけて、これら3系列はいずれも95〜98前後の狭いレンジで横ばいが続いていました。しかし2022年以降は一転し、総合CPIは2020年の100.0から2025年には111.9へと上昇しています。30年以上経験してこなかったペースで、モノやサービスの価格が動いています。
        </p>
      </ArticleText>

      {/* チャート1: 物価水準の推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title="消費者物価指数（水準）の長期推移"
          subtitle="1990〜2025年の推移（2020年=100）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <CpiIndexChart data={data.index} />
          <dl className={styles.seriesNotes}>
            <div>
              <dt>総合</dt>
              <dd>家計が購入する幅広い商品・サービス全体の物価動向。</dd>
            </div>
            <div>
              <dt>コア</dt>
              <dd>総合から天候要因で変動しやすい生鮮食品を除いた指数。</dd>
            </div>
            <div>
              <dt>コアコア</dt>
              <dd>食料とエネルギーを除き、基調的な物価変化を見やすくした指数。</dd>
            </div>
          </dl>
        </ArticleChart>
      </div>

      {/* 解説1 */}
      <ArticleText>
        <p>
          水準の推移を見ると、1990年代半ばから2010年代初頭にかけては指数が95〜98前後の狭いレンジで横ばいまたは微減を続け、物価がほとんど上がらない「デフレ・ディスインフレの時代」が続いていたことが分かります。
        </p>
        <p>
          しかし、2022年以降の世界的原材料高や円安を背景に、総合CPIは2020年の100.0から2025年には<strong>111.9（+11.9%）</strong>へと急角度で上昇。30年以上経験してこなかったペースでモノやサービスの価格改定が進んでいます。
        </p>
      </ArticleText>

      {/* チャート2: インフレ率（前年比） */}
      <div className={styles.charts}>
        <ArticleChart
          title="インフレ率（前年比変化率）の長期推移"
          subtitle="1990〜2025年の推移（%）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <CpiYoyChart data={data.yoy} />
        </ArticleChart>
      </div>

      {/* 解説2 */}
      <ArticleText>
        <p>
          前年比の変動率（インフレ率）を見ると、過去にプラスとなった局面は消費税率引き上げ時（1997年の5%化、2014年の8%化）や2008年の資源高など一時的な外的要因に限られていました。  %化、2014年の8%化）や2008年の資源高など一時的な外的要因に限られていました。
        </p>
        <p>
          これに対し、2022年（+2.5%）、2023年（+3.2%）、2024年（+2.7%）、2025年（+3.2%）と<strong>4年連続で2%を超えるインフレ率</strong>続いています。
        </p>
      </ArticleText>

      {/* ランキングテーブル */}
      <div className={styles.charts}>
        <PriceRankingTable
          data={priceRanking.comparison2020}
          title="品目別の物価上昇・下降ランキング（2020→2025年）"
          latestYear={priceRanking.latestYear}
        />

        <PriceRankingTable
          data={priceRankingData.comparison1990}
          title="35年間の品目別物価変動ランキング（1990→2025年）"
        />
      </div>

      {/* まとめ解説 */}
      <ArticleText>
        <p>
          品目別の変動を見ると、直近5年（2020〜2025年）はうるち米やコーヒー豆など食品を中心に上昇が目立つのに対し、35年（1990〜2025年）で見ると電気冷蔵庫やカメラなど家電製品が9割以上値下がりしています
        </p>
        <p>
          ただし、この「9割値下がり」は少し注意が必要です。昔の冷蔵庫と今の冷蔵庫は、省エネ性能も容量も別物です。統計では、こうした性能アップの分を価格から差し引いて計算しているため、指数上は大きく下がって見えます。実際の店頭価格が10万円から1万円になったわけではなく、同じお金でより高性能なものが買えるようになった、という意味です。
        </p>
        <p>
          たとえば冷蔵庫は、本体の値段も電気代も大きく下がっています。同じ容量でも、35年前よりはるかに省エネ性能が上がっているため、電気代の面でも家計の負担は軽くなっています。見た目の指数だけでなく、使い続けたときの総コストで見ても、家電は本当に「安くなった」品目だといえます。
        </p>
      </ArticleText>

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
