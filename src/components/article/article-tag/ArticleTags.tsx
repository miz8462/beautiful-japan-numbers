import { TAGS, type Tag } from "@/app/(main)/articles/articles";
import styles from "./ArticleTag.module.css";

export function ArticleTags({ tags }: { tags: Tag[] }) {
  return (
    <div>
      {tags.map((tag) => {
        const data = TAGS[tag];

        return (
          <a key={tag} href={`/topics/${tag}`} className={styles.topic}>
            {data}
          </a>
        );
      })}
    </div>
  );
}