import type { ReactNode } from "react";
import styles from "./KPICard.module.css";
type Props = {
  label: ReactNode;
  value: string;
  caption?: string;
  valueColor?: string;
}

export function KPICard({ label, value, caption, valueColor }: Props) {
  return (
    <div className={styles.kpiCard}>
      <p>{label}</p>
      <strong style={valueColor ? { color: valueColor } : undefined}>{value}</strong>
      {caption && <span className={styles.caption}>{caption}</span>}
    </div>
  );
}