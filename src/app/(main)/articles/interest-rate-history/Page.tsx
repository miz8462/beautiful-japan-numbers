import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import InterestRateCharts from "./InterestRateCharts";

export default function InterestRateHistoryPage() {
  const article = articles.find((a) => a.href === "/articles/interest-rate-history");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="金利のある世界への回帰">
        <KPIPrimary
          label="政策金利（無担保コール翌日物）"
          value="0.98%"
          caption="2026年現在の政策金利目標値付近"
        />
        <KPIGrid>
          <KPICard
            label="マイナス金利解除"
            value="2024年3月"
            caption="17年ぶりの利上げでマイナス金利を脱却"
          />
          <KPICard
            label="10年国債利回り"
            value="2.80%"
            caption="2026年の市場取引利回り（長期金利指標）"
          />
          <KPICard
            label="国債平均金利"
            value="0.98%"
            caption="普通国債残高に対する加重平均（2025年度）"
          />
          <KPICard
            label="通常貯金金利"
            value="0.30%"
            caption="ゆうちょ銀行通常貯金（2026年改定値）"
          />
        </KPIGrid>
      </KPISection>

      {/* 1. 導入 */}
      <ArticleText>
        <p>
          日本経済は今、「金利のない世界」から「金利のある世界」へと大きな転換期を迎えています。
          日本銀行は2016年から続いていたマイナス金利政策を2024年3月に解除し、実に17年ぶりの利上げへとかじを切りました。
          デフレ脱却と経済の正常化を目指すこの決定は、長らくゼロ金利環境に慣れ親しんできた企業や個人、そして国家の財政運営に新たなインパクトを与えつつあります。
        </p>
      </ArticleText>

      {/* 2, 3, 4, 5. Charts */}
      <InterestRateCharts />

      {/* 6. まとめ */}
      <ArticleText>
        <p>
          四半世紀にわたって続いた日本の「超低金利時代」は歴史的な転換を遂げ、「金利のある世界」へと戻りつつあります。
          金利の復活は、預金者にとっては資産形成へのささやかな追い風となる一方、住宅ローン借入者には負担増のリスクをもたらし、国にとっては利払い負担という財政的プレッシャーを強めることになります。
          この変化をただ恐れるのではなく、データを通じて金利の歴史的な位置づけを把握し、新しい経済環境へ適応していくことが求められています。
        </p>
      </ArticleText>
    </div>
  );
}
