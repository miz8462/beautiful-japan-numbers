import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import { articles } from "../articles";
import VoterTurnoutCharts from "./VoterTurnoutCharts";

export default function VoterTurnoutPage() {
  const article = articles.find((a) => a.href === "/articles/voter-turnout");
  if (!article) return null;

  return (
    <div>
      <div className="container">
        <ArticleHeader article={article} />
        <VoterTurnoutCharts />
      </div>
    </div>
  );
}
