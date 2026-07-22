import { ReactNode } from "react";
import styles from "./ArticleIntro.module.css";

type ArticleIntroProps = {
  children: ReactNode;
};

export function ArticleText({ children }: ArticleIntroProps) {
  return <div className={styles.intro}>{children}</div>;
}