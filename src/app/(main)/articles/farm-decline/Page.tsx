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

      <KPISection title="2025年 農業構造の現状（主要指標）">
        <KPIPrimary
          label="販売農家数（2025年）"
          value="79.3万戸"
          caption="1985年（331万戸）から76%減"
        />
        <KPIGrid>
          <KPICard
            label="基幹的農業従事者数"
            value="103.6万人"
            caption="2020年比で24.0%減"
          />
          <KPICard
            label="従事者の平均年齢"
            value="67.7歳"
            caption="30歳未満は1.3万人"
          />
          <KPICard
            label="65歳以上従事者比率"
            value="約70%"
            caption="103.6万人のうち72.1万人"
          />
          <KPICard
            label="耕作放棄地（2015年）"
            value="42.3万ha"
            caption="1975年（13.1万ha）の3.2倍"
          />
        </KPIGrid>
      </KPISection>

      <ArticleText>
        <p>
          販売農家は、1985年の331万戸から2025年の79万戸まで、40年で76%減りました。
        </p>
        <p>
          基幹的農業従事者は103.6万人で、平均年齢は67.7歳。65歳以上が約70%を占めます。耕作放棄地は、1975年の13.1万haから2015年の42.3万haへと、3.2倍になりました。
        </p>
        <p>「販売農家」とは、経営耕地面積30a(約3,000㎡)以上、または農産物の販売金額が年50万円以上の農家です。これに満たない農家は「自給的農家」に分類され、この数字には含まれません。

        </p>
      </ArticleText>

      <FarmDeclineCharts />

      <ArticleText>
        <p>
          1985年から2025年までに、販売農家は252万戸減りました。2025年の基幹的農業従事者103.6万人のうち、60歳以上は77.8%、65歳以上は約70%です。耕作放棄地は、2015年時点で42.3万haでした。
        </p>
      </ArticleText>
    </div>
  );
}
