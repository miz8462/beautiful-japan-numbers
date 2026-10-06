import type { ReactNode } from "react";
import styles from "./ChartNote.module.css";

type ChartNoteProps = {
  children: ReactNode;
  className?: string;
};

export function ChartNote({ children, className }: ChartNoteProps) {
  return (
    <p className={className ? `${styles.chartNote} ${className}` : styles.chartNote}>
      {children}
    </p>
  );
}
