import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import JapanEconomicHistoryCharts from "./JapanEconomicHistoryCharts";

const SOURCE_LABEL = "出典: 日本取引所グループ / 国土交通省";
const SOURCE_URL = "https://www.jpx.co.jp/markets/statistics-equities/misc/02.html";

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
          label="株式時価総額（2026年）"
          value="約1,250兆円"
          caption="バブル期ピーク（1989年12月：約611兆円）の約2倍に達する水準"
        />
        <KPIGrid>
          <KPICard
            label={<>地価変動率<br />（三大都市圏・2026）</>}
            value="+3.5%"
            caption="緩やかな回復基調が継続"
          />
          <KPICard
            label={<>バブル期地価上昇ピーク<br />（三大都市圏・1988年）</>}
            value="+43.8%"
            caption="前年比で異常な高騰を記録"
          />
          <KPICard
            label={<>バブル崩壊後最大下落<br />（三大都市圏・1993年）</>}
            value="-14.7%"
            caption="資産デフレへの転落"
          />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          戦後の日本経済は、高度経済成長、バブル経済、そして「失われた30年」と呼ばれる長期停滞という3つの時代を歩んできました。
          その流れは、株式市場の「時価総額」と「地価」という2つの資産価格に、はっきりと表れています。
        </p>
      </ArticleText>

      <JapanEconomicHistoryCharts />

      <ArticleText>
        <p>
          <strong>高度経済成長期（1950年代〜1970年代初頭）</strong>
        </p>
        <p>
          製造業を中心に産業が急速に拡大し、株式時価総額は右肩上がりに増えました。人口が都市へ集中したことで地価も上がり続け、土地は「持っていれば値上がりする資産」と見られるようになります。この流れは1973年の第一次石油危機で転機を迎え、成長のペースは落ち着いていきました。
        </p>
        <p>
          <strong>バブル経済期（1980年代後半〜1990年代初頭）</strong>
        </p>
        <p>
          1985年のプラザ合意後の円高に対応するため、金融緩和が進みました。あふれた資金は株式と不動産に向かい、資産価格は実体経済を大きく上回る勢いで膨らみます。株式時価総額は1989年に約611兆円でピークを迎え、地価も1988年に全国平均で前年比+21.7%、三大都市圏では+43.8%に達しました。
        </p>
        <p>
          この時期には「土地の値段は下がらない」という「土地神話」が広まり、企業も個人も借入れを増やして不動産に投資しました。
        </p>
        <p>
          <strong>バブル崩壊と長期停滞期（1990年代以降）</strong>
        </p>
        <p>
          1990年に入ると株価が急落し、地価も下落に転じます。
          三大都市圏の地価は1992年に前年比−11.6%、1993年には−14.7%と下落幅が拡大しました。
          資産価格の急落は、金融機関に多額の不良債権を残し、1990年代後半の金融危機にもつながります。
          物価が下がり続けるデフレのなかで、企業は投資や賃上げに慎重になり、停滞が長引きました。
        </p>
        <p>
          地価は2000年代半ばに三大都市圏でいったん上昇に転じましたが、リーマン・ショックで再び下落しました。
        </p>
        <p><strong>近年の動き</strong>
        </p>
        <p>
          2024年には日経平均株価が約34年ぶりにバブル期の最高値を更新し、2026年の株式時価総額は約1,250兆円と、1989年のピークの約2倍に達しています。
          三大都市圏の地価も+3.5%と、緩やかな上昇が続いています。
        </p>
        <p>
          ただし、この比較には注意が必要です。
          時価総額は「その年の金額」そのままの数字なので、30年余りの経済規模の拡大や円安の影響も含まれています。
          バブル期との違いを見るには、経済の大きさ(GDP)に対する比率で比べるのが有効です。
          また、近年の株価上昇は企業収益の拡大が背景にあるとされ、借入れで資産を買い進めたバブル期とは、上昇のしくみが異なります。
        </p>
      </ArticleText>
    </div>
  );
}
