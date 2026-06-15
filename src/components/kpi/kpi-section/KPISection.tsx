import { ReactNode } from "react";
import styles from "./KPISection.module.css"

type Props = {
  title: string;
  children: ReactNode;
};


export function KPISection({ title, children }: Props) {
  return (
    <section className={styles.kpiSection} aria-labelledby="kpi">
      <div className={styles.kpiMain}>
        <h2 id="kpi">{title}</h2>
        {children}
      </div>
    </section>
  );
}