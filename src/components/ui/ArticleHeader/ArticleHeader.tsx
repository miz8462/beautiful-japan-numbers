import type { Article } from "@/app/(main)/articles/articles";
import { ArticleTags } from "@/components/ui/ArticleTag/ArticleTags";
import { FiCalendar } from "react-icons/fi";
import { ArticleSource } from "../ArticleSource/ArticleSource";
import styles from "./ArticleHeader.module.css";

export function ArticleHeader({ article }: { article: Article }) {
  return (
    <header className={styles.header}>
      <div className={styles.dateMeta}>
        <FiCalendar size={14} />
        <time dateTime={article.publishedAt}>
          {new Date(article.publishedAt).toLocaleDateString("ja-JP", {
            year: "numeric", month: "long", day: "numeric",
          })}
        </time>
      </div>
      <ArticleTags tags={article.tags} />
      <h1>{article.title}</h1>
      <p>{article.description}</p>
      <ArticleSource href={article.sourceUrl} label={article.sourceLabel} />
    </header>
  );
}