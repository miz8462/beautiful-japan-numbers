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
            label="60代の平均貯蓄額"
            value="2,843万円"
            caption="2025年（負債234万円）"
          />
          <KPICard
            label="70歳以上の平均貯蓄額"
            value="2,471万円"
            caption="2025年（負債81万円）"
          />
          <KPICard
            label="30代の平均負債額"
            value="1,940万円"
            caption="2025年（住宅ローン等を中心に急増）"
          />
          <KPICard
            label="40代の平均負債額"
            value="1,483万円"
            caption="2002年の876万円から約1.7倍"
          />
        </KPIGrid>
      </KPISection>

      {/* 導入解説 */}
      <ArticleText>
        <p>
          「日本人は貯蓄好き」というイメージは広く共有されていますが、マクロの家計貯蓄率や世代別の資産・負債バランスの現実はどうなっているのでしょうか。
        </p>
        <p>
          内閣府の「国民経済計算」および総務省の「家計調査」データに基づき、1990年代以降の家計貯蓄率の長期低下と、若年・子育て世代における住宅ローン負債の急増、そして高齢世代への資産偏重という構造を可視化します。
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
          マクロ経済全体の家計貯蓄率（可処分所得のうち消費されずに貯蓄に回った割合）を見ると、1990年代半ばには<strong>10〜12%前後</strong>あった貯蓄率は、急速な高齢化（年金を取り崩して生活する高齢世帯の増加）や実質賃金の伸び悩みにより長期的に低下し、2010年代以降は0%前後で推移しています。
        </p>
        <p>
          2020年度はコロナ禍の特別定額給付金や行動制限に伴う消費抑制で一時的に10.6%まで急上昇したものの、経済活動の正常化に伴い再び低水準に戻っています。
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
          世代ごとの資産状況を見ると、「高齢層の純貯蓄超過」と「若年・現役層の負債超過」というコントラストが際立ちます。
        </p>
        <p>
          2025年時点で、60代（貯蓄2,843万円 vs 負債234万円）や70歳以上（貯蓄2,471万円 vs 負債81万円）は多額の純貯蓄を保有しています。
          一方で、30代は貯蓄1,073万円に対して負債が<strong>1,940万円（純負債 約867万円）</strong>、29歳以下も純負債1,039万円と、住宅取得期にある世代が重い債務を抱えていることが分かります。
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
          特に顕著なのが30代・40代の負債額の急激な伸びです。
          低金利環境と都市部の住宅価格高騰（不動産インフレ）を背景に、30代の平均負債額は2002年の737万円から2025年には<strong>約2.6倍の1,940万円</strong>へと跳ね上がりました。
        </p>
        <p>
          超低金利時代から「金利のある世界」への移行が進むなかで、現役世代の住宅ローン負担と高齢世代の資産活用（NISA等による投資促進や世代間移転）は、今後の日本経済を左右する極めて重要な論点です。
        </p>
      </ArticleText>

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL_KAKEI} label={SOURCE_LABEL_KAKEI} />
    </div>
  );
}
