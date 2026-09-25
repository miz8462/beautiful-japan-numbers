import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import { SavingsRateChart } from "./chart/SavingsRate/SavingsRateChart";
import { SavingsDebtByAgeChart } from "./chart/SavingsDebtByAge/SavingsDebtByAgeChart";
import { DebtByAgeTrendChart } from "./chart/DebtByAgeTrend/DebtByAgeTrendChart";
import styles from "./page.module.css";

const SOURCE_LABEL_SNA = "内閣府「国民経済計算年次推計」";
const SOURCE_URL_SNA = "https://www.esri.cao.go.jp/jp/sna/menu.html";
const SOURCE_LABEL_KAKEI = "総務省統計局「家計調査報告（貯蓄・負債編）」";
const SOURCE_URL_KAKEI = "https://www.stat.go.jp/data/sav/sokuhou/nen/index.html";

export default function SavingsPage() {
  const article = articles.find((a) => a.href === "/articles/savings");
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事ヘッダー */}
      <ArticleHeader article={article} />

      {/* KPIセクション */}
      <KPISection title="日本の家計貯蓄と負債の現在地（2024〜2025年）">
        <KPIPrimary
          label="家計貯蓄率（2024年度）"
          value="0.8%"
          caption="1990年代の10%超から低水準で推移"
        />
        <KPIGrid>
          <KPICard
            label="70歳以上の平均貯蓄額"
            value="2,471万円"
            caption="2025年（負債81万円）"
          />
          <KPICard
            label="30代の平均負債額"
            value="1,940万円"
            caption="2025年（住宅ローンの急騰）"
          />
        </KPIGrid>
      </KPISection>

      {/* 導入解説 */}
      <ArticleText>
        <p>
          「日本人は貯蓄好き」——そう思っている人は多いはずです。ですが、2024年度の家計貯蓄率はわずか<strong>0.8%</strong>。1990年代には10%を超えていたことを考えると、そのイメージは過去のものになりつつあります。
        </p>
        <p>
          では、貯蓄は本当に減っているのでしょうか。それとも、世代によって事情が大きく違うのでしょうか。この記事では、貯蓄率の長期低下の背景と、高齢世代に資産が偏る一方で若い世代が住宅ローンなどの負債を抱える構造を、数字で追っていきます。
        </p>
      </ArticleText>

      {/* チャート1: 貯蓄率の推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title="家計貯蓄率の長期推移"
          subtitle="1994〜2024年度の推移（%）"
          source={SOURCE_LABEL_SNA}
          sourceUrl={SOURCE_URL_SNA}
        >
          <SavingsRateChart />
        </ArticleChart>
      </div>

      {/* 解説1 */}
      <ArticleText>
        <p>
          家計貯蓄率とは、可処分所得のうちどれだけを消費せずに貯蓄へ回したかを示す指標です。1990年代半ばには<strong>10〜12%前後</strong>あったこの数値が、2010年代以降は<strong>マイナス</strong>にまで落ち込んでいます。
        </p>
        <p>
          背景にあるのは、主に2つの要因です。
          ひとつは高齢化の進行。
          年金を切り崩しながら暮らす高齢世帯が増えるほど、社会全体の貯蓄率は押し下げられます。
          もうひとつは実質賃金の伸び悩み。
          稼ぎが増えなければ、そもそも貯蓄に回すお金の余裕も生まれません。
        </p>
        <p>
          唯一の例外が2020年度です。
          コロナ禍の特別定額給付金と、外出自粛による消費の落ち込みが重なり、貯蓄率は一時10.6%まで跳ね上がりました。
          しかし経済活動が正常化するにつれ、その反動もすぐに収まっています。
        </p>
      </ArticleText>

      {/* チャート2: 年齢階級別の貯蓄と負債 */}
      <div className={styles.charts}>
        <ArticleChart
          title="年齢階級別の貯蓄・負債残高"
          subtitle="二人以上の世帯（2025年・単位：万円）"
          source={SOURCE_LABEL_KAKEI}
          sourceUrl={SOURCE_URL_KAKEI}
        >
          <SavingsDebtByAgeChart />
        </ArticleChart>
      </div>

      {/* 解説2 */}
      <ArticleText>
        <p>
          世代別に見ると、コントラストはさらに鮮明になります。ひとことで言えば、「高齢層は貯蓄超過、若年・現役層は負債超過」という構図です。
        </p>
        <p>
          60代は貯蓄2,843万円に対し負債はわずか234万円、70歳以上も貯蓄2,471万円に対し負債81万円と、いずれも潤沢な純貯蓄を抱えています。
          対照的に30代は、貯蓄1,073万円に対して負債は1,940万円。
          差し引きすると約867万円の純負債です。
          29歳以下も純負債は1,039万円にのぼります。
          ちょうど住宅を取得する時期にあたるこの世代が、いかに重い債務を背負っているかが分かります。
        </p>
      </ArticleText>

      {/* チャート3: 負債額の推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title="年齢階級別 負債額の長期推移"
          subtitle="2002〜2025年の推移（単位：万円）"
          source={SOURCE_LABEL_KAKEI}
          sourceUrl={SOURCE_URL_KAKEI}
        >
          <DebtByAgeTrendChart />
        </ArticleChart>
      </div>

      {/* まとめ解説 */}
      <ArticleText>
        <p>
          なかでも際立つのが、30代・40代における負債額の急激な伸びです。低金利環境と都市部の住宅価格高騰を背景に、30代の平均負債額は2002年の737万円から2025年には1,940万円へ、実に約2.6倍に膨らみました。
        </p>
        <p>
          長らく続いた超低金利時代は終わりを迎えつつあり、日本経済は「金利のある世界」へと移行しています。
          そのなかで、現役世代がどう住宅ローンと向き合うか、そして高齢世代の資産をNISAなどを通じてどう次世代へ循環させていくか——
          この2つは、これからの日本経済を占ううえで避けて通れない論点と言えるでしょう。
        </p>
      </ArticleText>
    </div>
  );
}
