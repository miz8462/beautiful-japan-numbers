import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { articles } from "../articles";
import ElectionSmdVsPrCharts from "./ElectionSmdVsPrCharts";

export default function ElectionSmdVsPrPage() {
  const article = articles.find(
    (a) => a.href === "/articles/election-smd-vs-pr"
  );
  if (!article) return null;

  return (
    <div>
      <div className="container">
        <ArticleHeader article={article} />
        <ElectionSmdVsPrCharts />
      </div>
    </div>
  );
}
