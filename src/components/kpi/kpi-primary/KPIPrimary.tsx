import type { ReactNode } from "react";
import styles from "./KPIPrimary.module.css";

type Props = {
  label?: ReactNode;
  value: string;
  caption?: string;
};

export function KPIPrimary({ label, value, caption }: Props) {
  return (
    <div className={styles.kpiPrimary}>
      {label && <p className={styles.kpiLabel}>{label}</p>}
      <strong className={styles.kpiValue}>{value}</strong>
      {caption && <p className={styles.kpiCaption}>{caption}</p>}
    </div>
  );
}