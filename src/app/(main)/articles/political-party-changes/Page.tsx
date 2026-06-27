import { articles } from "@/app/(main)/articles/articles";
import { ArticleHeader } from "@/components/article/article-header/ArticleHeader";
import PoliticalPartyTimelineChart from "./charts/PoliticalPartyTimeline/PoliticalPartyTimelineChart";

export default function PoliticalPartyChangesPage() {
  const article = articles.find((a) => a.href === "/articles/political-party-changes");
  if (!article) return null;

  return (
    <div>
      <div className="container">
        <ArticleHeader article={article} />

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.5, marginBottom: '8px' }}>
            2010年頃からの政党再編の主な流れ
          </h2>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '16px' }}>
            {article.sourceLabel}
          </p>
          <div style={{ background: '#fff', borderRadius: '4px', overflow: 'hidden', padding: '16px', border: '1px solid #e0e0e0' }}>
            <PoliticalPartyTimelineChart />
          </div>
        </div>
      </div>
    </div>
  );
}
