import styles from "./TopicCard.module.css";

type Props = {
  href: string;
  label: string;
  publishedAt: string;
  title: string;
  description: string;
};

export function TopicCard({
  href,
  label,
  publishedAt,
  title,
  description,
}: Props) {
  return (
    <a className={styles.card} href={href}>
      <div className={styles.cardHeader}>
        <p className={styles.cardLabel}>{label}</p>
        <p className={styles.cardDate}>{publishedAt}</p>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </a>
  );
}