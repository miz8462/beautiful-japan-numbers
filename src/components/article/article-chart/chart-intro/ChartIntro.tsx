import { ReactNode } from "react";
import styles from "./ChartIntro.module.css";

type ChartIntroProps = {
  children: ReactNode;
};

export function ChartIntro({ children }: ChartIntroProps) {
  return <div className={styles.intro}>{children}</div>;
}