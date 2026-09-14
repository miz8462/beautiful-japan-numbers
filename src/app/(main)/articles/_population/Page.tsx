import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { ArticleSource } from "@/components/article/article-source/ArticleSource";
import { ArticleText } from "@/components/article/article-text/ArticleText";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import PopulationCharts from "./PopulationCharts";

const SOURCE_LABEL = "総務省統計局「人口推計」・総務省「住民基本台帳に基づく人口動態」";
const SOURCE_URL = "https://www.stat.go.jp/data/jinsui/2.html";

export default function PopulationPage() {
  const article = articles.find((a) => a.href === "/articles/population");
  if (!article) return null;

  return (
    <div className="container">
      {/* 記事ヘッダー */}
      <ArticleHeader article={article} />

      {/* KPIセクション */}
      <KPISection title="日本の人口動態の現在地（2024年）">
        <KPIPrimary
          label="年間 人口減少数"
          value="-58万人"
          caption="過去最大のペースで減少が継続"
        />
        <KPIGrid>
          <KPICard
            label="年間出生数"
            value="68万人"
            caption="過去最少を更新（少子化の加速）"
          />
          <KPICard
            label="年間死亡数"
            value="160万人"
            caption="高齢化に伴い過去最多水準"
          />
          <KPICard
            label="社会増（国際移動等）"
            value="+34万人"
            caption="外国人の入国超過などでプラス"
          />
          <KPICard
            label="総人口（2024年）"
            value="1億2,388万人"
            caption="2008年ピークから400万人以上減少"
          />
        </KPIGrid>
      </KPISection>

      {/* 導入解説 */}
      <ArticleText>
        <p>
          「日本の人口が減っている」という話題は日常的に耳にしますが、具体的にどのくらいのスピードで、どのような内訳で減少し、それがどの程度の規模感なのかを実感するのは容易ではありません。
        </p>
        <p>
          2024年の1年間で、日本の総人口は<strong>58万人</strong>減少しました。
          総人口の長期推移、出生数と死亡数が逆転した「自然減」の推移、外国人の流入などの「社会増」、そして主要都市の人口規模との比較を通じて、人口減少の現実を数字で紐解きます。
        </p>
      </ArticleText>

      {/* チャート群 */}
      <PopulationCharts />

      {/* 出典 */}
      <ArticleSource href={SOURCE_URL} label={SOURCE_LABEL} />
    </div>
  );
}
