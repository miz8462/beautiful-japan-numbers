import type { ReactNode } from "react";
import styles from "./KPIPrimary.module.css";

type Props = {
  label?: ReactNode;
  value: string;
  caption?: string;
  valueColor?: string;
};

export function KPIPrimary({ label, value, caption, valueColor }: Props) {
  return (
    <div className={styles.kpiPrimary}>
      {label && <p className={styles.kpiLabel}>{label}</p>}
      <strong className={styles.kpiValue} style={valueColor ? { color: valueColor } : undefined}>{value}</strong>
      {caption && <p className={styles.kpiCaption}>{caption}</p>}
    </div>
  );
}