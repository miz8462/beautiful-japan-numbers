import type { CSSProperties, ReactNode } from "react";
import styles from "./ArticleChart.module.css";

type ArticleChartProps = {
  title: string;
  source?: string;
  sourceUrl?: string;
  children: ReactNode;
};

type ChartCanvasStyle = CSSProperties & {
  "--article-chart-height"?: string;
  "--article-chart-mobile-height"?: string;
};

type ArticleChartCanvasProps = {
  children: ReactNode;
  height?: number;
  mobileHeight?: number;
};

export function ArticleChart({ title, source, sourceUrl, children }: ArticleChartProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>
      {source && (
        <p className={styles.source}>
          出典:{" "}
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {source}
            </a>
          ) : (
            source
          )}
        </p>
      )}
      <div className={styles.card}>
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}

export function ArticleChartCanvas({
  children,
  height = 260,
  mobileHeight,
}: ArticleChartCanvasProps) {
  const style: ChartCanvasStyle = {
    "--article-chart-height": `${height}px`,
  };

  if (mobileHeight) {
    style["--article-chart-mobile-height"] = `${mobileHeight}px`;
  }

  return (
    <div className={styles.canvas} style={style}>
      {children}
    </div>
  );
}
