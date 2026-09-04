import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import { TrendLineLoader } from "./charts/TrendLine";
import { FundingPieLoader } from "./charts/FundingPie";
import { CategoryBarLoader } from "./charts/CategoryBar";
import styles from "./page.module.css";

// 出典情報
const SOURCE_LABEL = "厚生労働省「社会保障給付費の推移および将来見通し」・財務省資料";
const SOURCE_URL = "https://www.mhlw.go.jp/stf/newpage_21509.html";

export default function SocialSecurityBalancePage() {
  const article = articles.find(
    (a) => a.href === "/articles/social-security-balance"
  );
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事ヘッダー */}
      <ArticleHeader article={article} />

      {/* KPIセクション */}
      <KPISection title="社会保障の給付と負担（令和8年度予算ベース）">
        <KPIPrimary
          label="社会保障給付費 総額"
          value="144.1兆円"
          caption="1990年度（47.2兆円）から約3倍に拡大"
        />
        <KPIGrid>
          <KPICard
            label="対GDP比率"
            value="20.8%"
            caption="経済規模の約5分の1に相当"
          />
          <KPICard
            label="保険料負担割合 vs 公費負担割合"
            value="53.2% vs 46.8%"
            caption="保険料76.7兆円 / 公費67.4兆円"
          />
        </KPIGrid>
      </KPISection>

      {/* 本文 1: 導入 */}
      <ArticleText>
        <p>
          日本の社会保障制度は、病気やケガの治療、高齢期の暮らし、介護が必要になったときの備えなど、国民の命と生活を生涯にわたって支える基盤です。
          しかし、少子高齢化が急速に進むなかで、その給付に必要な費用は年々増え続け、令和8年度予算ベースで過去最高の<strong>144.1兆円</strong>に達しました。
        </p>
        <p>
          これはバブル絶頂期の1990年度（47.2兆円）と比べて<strong>約3倍</strong>の規模です。
          一方で、給付をまかなう財源は国民が支払う「社会保険料」だけでなく、多額の「公費（税金）」によって穴埋めされ続けています。
          1990年から2026年までの長期データを通じて、「給付（受けるサービス）」と「負担（支払うお金）」のバランスがどのように変化してきたのかを客観的な事実から見ていきましょう。
        </p>
      </ArticleText>

      {/* チャート1: 時系列推移 */}
      <div className={styles.charts}>
        <ArticleChart
          title="社会保障給付費と負担（保険料・公費）の推移"
          subtitle="1990〜2026年度の推移（単位：兆円）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <TrendLineLoader />
        </ArticleChart>
      </div>

      {/* 本文 2: 給付と公費負担急増の背景 */}
      <ArticleText>
        <p>
          推移グラフをたどると、給付費総額が急カーブを描いて増大する一方で、給付と保険料収入の「開き（ギャップ）」が年々広がっていることが分かります。
        </p>
        <p>
          1990年当時、給付費47.2兆円に対して保険料収入は35.4兆円あり、給付の約4分の3を保険料でカバーできていました。公費（税金）の負担は12.2兆円にとどまっていました。
        </p>
        <p>
          しかし、現役世代の人口減少と高齢化に伴い、保険料収入の伸び（35.4兆円→76.7兆円）は給付の伸びに追いつかず、不足分を補うための公費負担（国・地方の税金）は<strong>12.2兆円から67.4兆円へと約5.5倍</strong>に急膨張しました。
          社会保障の不足分は、国の一般会計歳出や借金（国債）にも直結する最大要因となっています。
        </p>
      </ArticleText>

      {/* チャート2: 財源内訳（横帯グラフ） */}
      <div className={styles.charts}>
        <ArticleChart
          title="社会保障給付費の財源構成"
          subtitle="令和8年度予算ベースの内訳（単位：兆円・構成比%）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <FundingPieLoader />
        </ArticleChart>
      </div>

      {/* 本文 3: 財源の構成と公費の位置づけ */}
      <ArticleText>
        <p>
          令和8年度の財源構成を見ると、私たちが毎月の給与や年金から納めている「社会保険料」が<strong>76.7兆円（53.2%）</strong>、国や地方自治体の税金で賄う「公費」が合計<strong>67.4兆円（46.8%）</strong>となっています。
        </p>
        <p>
          「社会保険」という仕組みは本来、加入者が保険料を出し合って助け合う相互扶助が基本原則ですが、現在の日本の社会保障は、給付費の半分近くを税金などの公費によって支えなければ維持できない構造になっていることが数値から確認できます。
        </p>
      </ArticleText>

      {/* チャート3: 分野別給付費（バーチャート） */}
      <div className={styles.charts}>
        <ArticleChart
          title="給付分野別の規模と構成比"
          subtitle="令和8年度予算ベース（単位：兆円）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <CategoryBarLoader />
        </ArticleChart>
      </div>

      {/* 本文 4: 給付分野とこれからの考察 */}
      <ArticleText>
        <p>
          144.1兆円の給付費は、具体的に何に使われているのでしょうか。
          最も大きな割合を占めるのは<strong>年金給付（59.9兆円、41.6%）</strong>で、高齢期の生活を支える柱となっています。
          次いで病院での受診や投薬などを支える<strong>医療給付（48.4兆円、33.6%）</strong>、そして2000年にスタートした介護保険や子育て支援などを含む<strong>介護・福祉・その他（35.8兆円、24.8%）</strong>と続きます。
        </p>
        <p>
          病院にかかったときの窓口負担が原則1〜3割で済むことや、高齢期に年金を受け取れること、介護サービスを少額の自己負担で利用できることは、すべてこの巨額の給付によって成り立っています。
        </p>
        <p>
          年金・医療・介護という安心な暮らしの「メリット」を享受する一方で、現役世代や企業が負担する「社会保険料」の上昇や、将来世代へツケを回す「財政赤字」という重い「コスト」を誰がどのように分かち合うのか。
          給付の水準を見直すのか、負担を公平に引き上げるのか、あるいは徹底した効率化を進めるのか――示された客観的な数字をもとに、私たち一人ひとりが考え続ける必要があります。
        </p>
      </ArticleText>

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
