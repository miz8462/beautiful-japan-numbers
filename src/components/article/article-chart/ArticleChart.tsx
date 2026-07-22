import type { CSSProperties, ReactNode } from "react";
import styles from "./ArticleChart.module.css";

type ArticleChartProps = {
  title: ReactNode;
  yearRange?: ReactNode;
  source?: string;
  sourceUrl?: string;
  intro?: ReactNode;   // チャート上に置く補足説明、
  unitNote?: ReactNode;
  note?: ReactNode;    // チャート下に置く文（例：出典以外の注記、接続の断り書き）
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

export function ArticleChart({ title, yearRange, source, sourceUrl, intro, unitNote, note, children }: ArticleChartProps) {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.heading}>{title}</h2>
          {yearRange && <p className={styles.yearRange}>{yearRange}</p>}
        </div>
        {source && (
          <p className={styles.source}>
            {sourceUrl ? (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                出典：{source}
              </a>
            ) : (
              source
            )}
          </p>
        )}
        {intro && <p className={styles.intro}>{intro}</p>}
        {unitNote && <p className={styles.unitNote}>{unitNote}</p>}
        <div className={styles.body}>{children}</div>
        {note && <p className={styles.note}>{note}</p>}
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
