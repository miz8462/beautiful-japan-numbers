import styles from "./TopicCard.module.css";

type Props = {
  href: string;
  label: string;
  title: string;
  description: string;
};

export function TopicCard({
  href,
  label,
  title,
  description,
}: Props) {
  return (
    <a className={styles.card} href={href}>
      <p className={styles.cardLabel}>{label}</p>
      <h3>{title}</h3>
      <p>{description}</p>
    </a>
  );
}