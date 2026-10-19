import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import InterestRateCharts from "./InterestRateCharts";

const SOURCE_LABEL = "出典: 日本銀行 / 財務省 / 住宅金融支援機構 / ゆうちょ銀行";
const SOURCE_URL = "https://www.boj.or.jp/";

export default function InterestRateHistoryPage() {
  const article = articles.find((a) => a.href === "/articles/interest-rate-history");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="金利のある世界への回帰（主要指標）">
        <KPIPrimary
          label="政策金利（無担保コール翌日物）"
          value="0.98%"
          caption="2026年の水準"
        />
        <KPIGrid>
          <KPICard
            label="マイナス金利解除"
            value="2024年3月"
            caption="2024年3月に解除。利上げは17年ぶり"
          />
          <KPICard
            label="10年国債利回り"
            value="2.80%"
            caption="新規発行10年債の2026年の利回り"
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
          日本銀行は2024年3月、2016年から続いたマイナス金利政策を解除しました。
          利上げは2007年以来、17年ぶりです。
          2026年の政策金利は0.98%、10年国債利回りは2.80%。
          通常貯金金利も0.30%に改定されています。
        </p>
      </ArticleText>

      {/* 2, 3, 4, 5. Charts */}
      <InterestRateCharts />

      {/* 6. まとめ */}
      <ArticleText>
        <p>
          5つの指標は、いずれも直近の底から上昇しました。
          政策金利は2019年の-0.07%から2026年の0.98%へ。
          10年国債利回りは2019年の-0.015%から2.80%へ。
          国債の利率加重平均は2022年度の0.76%から2025年度の0.98%へ。
          通常貯金金利は2016年の0.001%から0.30%へ。フラット35の下限は2016年8月の0.90%から3.29%へ。
        </p>
      </ArticleText>
    </div>
  );
}
