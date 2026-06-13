import { getAllSlugs, getArticleBySlug } from "@/app/(main)/articles/articles";
import { ArticleShell } from "@/components/layout/ArticleShell";
import { PageLayout } from "@/components/layout/Page";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> }

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
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  let PageComponent: React.ComponentType;
  try {
    const mod = await import(`../${slug}/Page`);
    PageComponent = mod.default;
  } catch {
    notFound();
  }

  return (
    <PageLayout>
      <ArticleShell title={article.title}>
        <PageComponent />
      </ArticleShell>
    </PageLayout>
  );
}