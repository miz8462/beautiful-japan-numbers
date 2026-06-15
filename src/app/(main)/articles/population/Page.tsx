import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import PopulationCharts from "./PopulationCharts";

const data = {
  title: "年間人口減少数（2024年）",
  main: "-58万人",
  cards: [
    { label: "出生数", value: "68万人" },
    { label: "死亡数", value: "160万人" },
    { label: "社会増（国際移動）", value: "+34万人" },
  ],
};

export default function PopulationPage() {
  const article = articles.find((a) => a.href === "/articles/population");
  if (!article) return null;
  return (
    <div>
      <div className="container">
        <ArticleHeader article={article} />
        <KPISection title={data.title}>
          <KPIPrimary value={data.main} />
          <KPIGrid>
            {data.cards.map((card) => (
              <KPICard
                key={card.label}
                label={card.label}
                value={card.value}
              />
            ))}
          </KPIGrid>
        </KPISection>
        <PopulationCharts />
      </div>
    </div>
  );
}
