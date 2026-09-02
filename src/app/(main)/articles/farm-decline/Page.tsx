import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import FarmDeclineCharts from "./FarmDeclineCharts";

export default function FarmDeclinePage() {
  const article = articles.find((a) => a.href === "/articles/farm-decline");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="2025年 農業構造の現状">
        <KPIPrimary
          label="販売農家数"
          value="79万3千戸"
          caption="5年前（2020年）比22.9%減"
        />
        <KPIGrid>
          <KPICard
            label="基幹的農業従事者数"
            value="103万6千人"
            caption="5年前比24.0%減"
          />
          <KPICard
            label="基幹的農業従事者の平均年齢"
            value="67.7歳"
            caption="高齢化が進行"
          />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          日本では、農産物を実際に販売している農家（<strong>販売農家</strong>）の数が
          長期にわたって減り続けています。1985年に約331万戸だった販売農家は、
          2025年には約79万戸まで落ち込み、40年間で<strong>約76%</strong>が失われました。
          高度経済成長期の農村から都市への人口流出に始まり、農業収益の伸び悩みや
          後継者不在といった課題が重なり、農業を辞める世帯が毎年後を絶ちません。
        </p>
        <p>
          農林水産省が5年ごとに実施する「農林業センサス」のデータを通じて、
          販売農家数の推移と農業従事者の高齢化、そしてその帰結としての
          耕作放棄地の拡大を見ていきます。
        </p>
      </ArticleText>

      <FarmDeclineCharts />

      <ArticleText>
        <p>
          農家数の減少・高齢化・耕作放棄地の増加は、それぞれ独立した現象ではなく、
          相互に連鎖する構造的な問題です。離農によって農地が荒廃し、地域の農業コミュニティが
          崩壊すれば、次世代が農業を引き継ぐ環境そのものが失われていきます。
          2020年農林業センサスから耕作放棄地の調査項目が廃止され、
          客観的な荒廃農地調査に切り替えられたことも、この問題の深刻化を反映しています。
          農地の集積・集約化や農業法人の活用、スマート農業の普及など、
          日本農業の構造転換が急がれています。
        </p>
      </ArticleText>
    </div>
  );
}
