import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import FarmDeclineCharts from "./FarmDeclineCharts";

const SOURCE_LABEL = "出典: 農林水産省「農林業センサス」";
const SOURCE_URL = "https://www.maff.go.jp/j/tokei/kouhyou/noucen/index.html";

export default function FarmDeclinePage() {
  const article = articles.find((a) => a.href === "/articles/farm-decline");
  if (!article) return null;

  return (
    <div className="container">
      <ArticleHeader article={article} />

      <KPISection title="2025年 農業構造の現状（主要指標）">
        <KPIPrimary
          label="販売農家数（2025年）"
          value="79.3万戸"
          caption="1985年（331万戸）から約76%減少"
        />
        <KPIGrid>
          <KPICard
            label="基幹的農業従事者数"
            value="103.6万人"
            caption="2020年比で24.0%減少"
          />
          <KPICard
            label="従事者の平均年齢"
            value="67.7歳"
            caption="高齢化が深刻化"
          />
          <KPICard
            label="65歳以上従事者比率"
            value="約70%"
            caption="担い手確保が急務"
          />
          <KPICard
            label="耕作放棄地（2015年）"
            value="42.3万ha"
            caption="1975年（13.1万ha）の3倍超"
          />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          日本では、農産物を実際に販売している農家（<strong>販売農家</strong>）の数が長期にわたって減り続けています。1985年に約331万戸だった販売農家は、2025年には約79万戸まで落ち込み、40年間で<strong>約76%</strong>が失われました。
          高度経済成長期の農村から都市への人口流出に始まり、農業収益の伸び悩みや後継者不在といった課題が重なり、農業を辞める世帯が毎年後を絶ちません。
        </p>
        <p>
          農林水産省が5年ごとに実施する「農林業センサス」のデータを通じて、販売農家数の推移と農業従事者の高齢化、そしてその帰結としての耕作放棄地の拡大を見ていきます。
        </p>
      </ArticleText>

      <FarmDeclineCharts />

      <ArticleText>
        <p>
          農家数の減少・高齢化・耕作放棄地の増加は、それぞれ独立した現象ではなく、相互に連鎖する構造的な問題です。離農によって農地が荒廃し、地域の農業コミュニティが崩壊すれば、次世代が農業を引き継ぐ環境そのものが失われていきます。
        </p>
        <p>
          2020年農林業センサスから耕作放棄地の調査項目が廃止され、客観的な荒廃農地調査に切り替えられたことも、この問題の深刻化を反映しています。農地の集積・集約化や農業法人の活用、スマート農業の普及など、日本農業の構造転換が急がれています。
        </p>
      </ArticleText>

      <ArticleSource href={article.sourceUrl || SOURCE_URL} label={article.sourceLabel || SOURCE_LABEL} />
    </div>
  );
}
