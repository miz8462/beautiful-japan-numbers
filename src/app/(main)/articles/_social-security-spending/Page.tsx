import { articles } from "@/app/(main)/articles/articles";
import { ArticleChart } from "@/components/article/article-chart";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import SocialSecurityTrendLoader from "./charts/SocialSecurityTrend/SocialSecurityTrendLoader";
import styles from "./page.module.css";

// ─── 出典情報 ────────────────────────────────────────────────────
const SOURCE_LABEL = "厚生労働省「社会保障費用統計」";
const SOURCE_URL = "https://www.mhlw.go.jp/";

export default function SocialSecuritySpendingPage() {
  const article = articles.find(
    (a) => a.href === "/articles/social-security-spending"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      {/* 1. KPIセクション */}
      <KPISection title="社会保障給付費の主要指標（2023年度）">
        <KPIPrimary
          label="社会保障給付費 総額"
          value="135.5兆円"
          caption="1990年度の51.4兆円から約2.6倍に拡大"
        />
        <KPIGrid>
          <KPICard
            label="年金給付の割合"
            value="41.6%"
            caption="56.4兆円"
          />
          <KPICard
            label="医療給付の割合"
            value="33.6%"
            caption="45.5兆円"
          />
          <KPICard
            label="福祉・その他の割合"
            value="24.8%"
            caption="33.6兆円"
          />
        </KPIGrid>
      </KPISection>

      {/* 2. 導入文 */}
      <ArticleText>
        <p>
          日本の社会保障給付費は、年金、医療、福祉・介護などの各制度を通じて国民に支給・給付される費用の総体です。
          少子高齢化の進行とともにその規模は拡大を続け、2023年度には<strong>135.5兆円</strong>に達しました。
          これは1990年度の51.4兆円から約2.6倍の増加に相当します。
        </p>
        <p>
          厚生労働省「社会保障費用統計」のデータに基づき、年金・医療・福祉の3区分の推移と最新の内訳を可視化し、
          日本の社会保障給付費がどのように膨張してきたのかを数字でたどります。
        </p>
      </ArticleText>

      {/* 3. 推移チャート */}
      <div className={styles.charts}>
        <ArticleChart
          title="社会保障給付費の推移"
          subtitle="1990〜2023年度の推移（兆円）"
          source={SOURCE_LABEL}
          sourceUrl={SOURCE_URL}
        >
          <SocialSecurityTrendLoader />
        </ArticleChart>
      </div>

      {/* 4. 詳細解説 */}
      <ArticleText>
        <p>
          給付費の内訳を積み上げで見ると、一貫して<strong>年金給付</strong>が最大の構成要素です。
          2023年度時点で年金給付は56.4兆円（全体の41.6%）を占め、高齢化に伴う受給者数の増加や給付水準の維持がその規模を支えています。
        </p>
        <p>
          次いで大きいのが<strong>医療給付</strong>で、2023年度は45.5兆円（33.6%）となりました。
          医療技術の高度化や高齢者の医療ニーズの増大を背景に、1990年度の19.6兆円から約2.3倍へと拡大しています。
          また、<strong>福祉・介護・その他</strong>は33.6兆円（24.8%）で、2000年度の介護保険制度導入以降、介護給付を中心に急速に伸びてきました。
        </p>
        <p>
          1990年度から2023年度の33年間で、社会保障給付費は51.4兆円から135.5兆円へと約2.6倍に拡大しました。
          現役世代と高齢世代の間で負担をどう分かち合うか、給付の効率化をどう進めるかは、日本の財政が直面する最も大きな課題の一つです。
        </p>
      </ArticleText>

      {/* 5. 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}