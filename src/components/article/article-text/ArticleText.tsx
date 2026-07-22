import { ReactNode } from "react";
import styles from "./ArticleText.module.css";

type ArticleTextProps = {
  children: ReactNode;
};

export function ArticleText({ children }: ArticleTextProps) {
  return <div className={styles.text}>{children}</div>;
}