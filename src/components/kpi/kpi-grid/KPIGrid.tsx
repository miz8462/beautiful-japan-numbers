import { ReactNode } from "react";
import styles from "./KPIGrid.module.css";

type Props = {
  children: ReactNode;
}

export function KPIGrid({ children }: Props) {
  return <div className={styles.kpiGrid}>{children}</div>;
}