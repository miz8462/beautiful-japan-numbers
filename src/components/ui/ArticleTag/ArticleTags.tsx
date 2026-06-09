// components/ui/ArticleTags.tsx
import { TAG_LABELS, type Tag } from "@/app/(main)/articles";
import styles from "./AritcleTag.module.css"

export function ArticleTags({ tags }: { tags: Tag[] }) {
  return (
    <>
      {tags.map((tag) => (
        <a key={tag} href={`/topics/${tag}`} className={styles.topic}>
          {TAG_LABELS[tag]}
        </a>
      ))}
    </>
  );
}