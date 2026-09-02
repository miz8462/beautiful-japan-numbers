import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import JapanEconomicHistoryCharts from "./JapanEconomicHistoryCharts";

export default function JapanEconomicHistoryPage() {
  const article = articles.find(
    (a) => a.href === "/articles/japan-economic-history"
  );
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="日本経済の主要指標（2026年現在）">
        <KPIPrimary
          label="株式時価総額"
          value="約1,250兆円"
          caption="バブル期ピーク（1989年12月：約611兆円）の約2倍に達する水準"
        />
        <KPIGrid>
          <KPICard label={<>地価変動率<br />（三大都市圏・2026）</>} value="+3.5%" />
          <KPICard label={<>バブル期地価上昇ピーク<br />（三大都市圏・1988年）</>} value="+43.8%" />
          <KPICard label={<>バブル崩壊後最大下落<br />（三大都市圏・1993年）</>} value="-14.7%" />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          戦後の日本経済は、高度経済成長期、バブル経済期、そして「失われた30年」と呼ばれる長期停滞期という3つの時代を経てきました。
          この推移を資産価格の動きから見ると、株式市場の時価総額と地価の変動が、それぞれの時代の特徴を明確に示しています。
        </p>
      </ArticleText>

      <JapanEconomicHistoryCharts />

      <ArticleText>
        <p>
          <strong>高度経済成長期（1950年代〜1970年代初頭）</strong>では、日本の産業力が急速に拡大し、株式時価総額も着実に増加しました。
          地価も安定した上昇傾向を示し、経済成長を背景に資産価格が徐々に上昇する時期でした。
        </p>
        <p>
          <strong>バブル経済期（1980年代後半〜1990年代初頭）</strong>は、資産価格が異常な上昇を示した時期です。
          株式時価総額は1989年に約611兆円でピークに達し、地価も1988年に全国平均で前年比+21.7%、三大都市圏で+43.8%という急上昇を記録しました。
          この時期、土地神話と呼ばれる「地価は下がらない」という信念が広まり、企業や個人が積極的に不動産投資を行いました。
        </p>
        <p>
          <strong>バブル崩壊と長期停滞期（1990年代以降）</strong>では、資産価格が急落し、その後長期間にわたり低迷しました。
          地価は1992年に三大都市圏で前年比-11.6%まで下落し、その後もマイナス圏での推移が続きました。
          株式時価総額もバブル期のピークを大きく下回る水準で推移し、日本経済はデフレと長期停滞という「失われた30年」に入りました。
        </p>
        <p>
          近年、地価は再び上昇基調に転じていますが、バブル期のような急激な上昇ではなく、緩やかな回復となっています。
          株式時価総額もバブル期のピークを超え、2026年には約1250兆円に達していますが、これは企業収益の改善や株価の上昇によるもので、バブル期のような異常な投機熱を反映したものではありません。
        </p>
      </ArticleText>
    </div>
  );
}
