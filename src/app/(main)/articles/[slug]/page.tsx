import { getAllSlugs, getArticleBySlug } from "@/app/(main)/articles";
import { ArticleShell } from "@/components/layout/ArticleShell";
import { Page } from "@/components/layout/Page";
import { notFound } from "next/navigation";
import GovernmentSpendingPage from "../government-spending/Page";
import PopulationPage from "../population/Page";

type Props = { params: Promise<{ slug: string }> }

const pages: Record<string, React.ComponentType> = {
  "government-spending": GovernmentSpendingPage,
  "population": PopulationPage,
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const PageComponent = pages[slug];
  if (!PageComponent) notFound();
  const article = getArticleBySlug(slug);
  return (
    <Page>
      <ArticleShell title={article?.title ?? ""}>
        <PageComponent />
      </ArticleShell></Page>
  );
}