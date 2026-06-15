import styles from "./ArticleSource.module.css";

export function ArticleSource({ href, label }: { href: string; label: string }) {
  return (
    <p className={styles.articleSource} >
      <a href={href} target="_blank" rel="noopener noreferrer">
        {label}
      </a>
    </p>
  );
}