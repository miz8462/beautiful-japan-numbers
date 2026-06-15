import styles from "./KPICard.module.css";
type Props = {
  label: string;
  value: string;
}

export function KPICard({ label, value }: Props) {
  return (
    <div className={styles.kpiCard}>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}