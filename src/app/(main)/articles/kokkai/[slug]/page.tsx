import { getAllSlugs, getArticleBySlug } from "@/app/(main)/articles/articles";
import { ArticleShell } from "@/components/layout/ArticleShell";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> }

const PREFIX = "kokkai/";

export function generateStaticParams() {
    return getAllSlugs()
        .filter((s) => s.startsWith(PREFIX))
        .map((s) => ({ slug: s.slice(PREFIX.length) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const article = getArticleBySlug(`${PREFIX}${slug}`);
    if (!article) return {};

    return {
        title: `${article.title}`,
        description: article.description,
        openGraph: {
            title: article.title,
            description: article.description,
            images: [`/articles/${PREFIX}${slug}/opengraph-image`],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.description,
        },
    };
}

export default async function KokkaiArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = getArticleBySlug(`${PREFIX}${slug}`);
    if (!article) notFound();

    let PageComponent: React.ComponentType;
    try {
        const mod = await import(`../${slug}/Page`);
        PageComponent = mod.default;
    } catch {
        notFound();
    }

    return (
        <ArticleShell title={article.title}>
            <PageComponent />
        </ArticleShell>
    );
}