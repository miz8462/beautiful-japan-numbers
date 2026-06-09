import { articles, TAG_LABELS, type Tag } from "@/app/(main)/articles";
import { Page } from "@/components/layout/Page";
import { TopicCard } from "@/components/ui/TopicCard";

export function generateStaticParams() {
  return Object.keys(TAG_LABELS).map((slug) => ({ slug }));
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tag = slug as Tag;
  const label = TAG_LABELS[tag];
  const filtered = articles.filter((a) => a.tags.includes(tag));

  return (
    <Page>
      <div className="container">
        <header>
          <h1>{label}</h1>
        </header>
        <div>
          {filtered.map((article) => (
            <TopicCard key={article.href} {...article} />
          ))}
        </div>
      </div>
    </Page>
  );
}