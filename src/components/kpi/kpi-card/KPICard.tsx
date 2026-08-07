import styles from "./KPICard.module.css";
type Props = {
  label: string;
  value: string;
  caption?: string;
}

export function KPICard({ label, value, caption }: Props) {
  return (
    <div className={styles.kpiCard}>
      <p>{label}</p>
      <strong>{value}</strong>
      {caption && <span className={styles.caption}>{caption}</span>}
    </div>
  );
}