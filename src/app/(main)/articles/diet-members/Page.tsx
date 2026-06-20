import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { KPICard, KPIGrid, KPIPrimary, KPISection } from "@/components/kpi";
import DietMembersCharts from "./DietMembersCharts";

export default function DietMembersPage() {
  const article = articles.find((a) => a.href === "/articles/diet-members");
  if (!article) return null;

  return (
    <div>
      <div className="container">
        <ArticleHeader article={article} />
        <KPISection title="女性比率と当選率・年齢構成（最新・2026年衆院選）">
          <KPIPrimary value="14.6%" caption="女性当選者の割合" />
          <KPIGrid>
            <KPICard label="女性候補者の割合" value="24.4%" />
            <KPICard label="女性候補者の当選率" value="21.7%" />
            <KPICard label="男性候補者の当選率" value="40.9%" />
            <KPICard label="60代以上の割合" value="40.1%" />
          </KPIGrid>
        </KPISection>
        <DietMembersCharts />
      </div>
    </div>
  );
}
