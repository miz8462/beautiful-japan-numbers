"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import balanceData from "@/data/social-security-balance.json";
import { ResponsiveBar } from "@nivo/bar";
import styles from "./CategoryBar.module.css";

const categories = balanceData.categoryBenefits;

// カテゴリ別カラー（プロジェクト指定パレットに準拠）
const CATEGORY_COLORS: Record<string, string> = {
  年金: "var(--color-brand, #5bbee4)",
  医療: "var(--color-brand-second, #f19db5)",
  "介護・福祉・その他": "#e67e22",
};

const CHART_DATA = categories.map((item) => ({
  category: item.category,
  amount: item.amount,
  percentage: item.percentage,
}));

export function CategoryBar() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：給付金額（兆円）</span>

      <ArticleChartCanvas height={280} mobileHeight={260}>
        <ResponsiveBar
          data={CHART_DATA}
          keys={["amount"]}
          indexBy="category"
          layout="horizontal"
          margin={{
            top: 10,
            right: isMobile ? 55 : 75,
            bottom: 36,
            left: isMobile ? 95 : 120,
          }}
          valueScale={{ type: "linear", min: 0, max: 70, nice: false }}
          indexScale={{ type: "band", round: true }}
          colors={({ data }) => CATEGORY_COLORS[data.category as string]}
          padding={0.35}
          borderRadius={4}
          enableGridX={true}
          enableGridY={false}
          gridXValues={[0, 20, 40, 60]}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 8,
            tickValues: [0, 20, 40, 60],
            format: (v) => `${v}`,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
          }}
          enableLabel={true}
          label={(d) => `${d.value}兆円`}
          labelTextColor="var(--color-text-primary, #222222)"
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-data, monospace)",
              fontSize: 12,
              fill: "var(--color-text-muted, #888888)",
            },
            grid: {
              line: {
                stroke: "var(--color-border, #e0e0e0)",
                strokeWidth: 1,
              },
            },
            axis: {
              domain: { line: { stroke: "transparent" } },
              ticks: {
                line: { stroke: "transparent" },
                text: { fill: "var(--color-text-primary, #222222)", fontSize: 12 },
              },
            },
          }}
          tooltip={({ data }) => (
            <div className={styles.tooltip}>
              <strong>{data.category}</strong>: {data.amount}兆円（構成比 {data.percentage}%）
            </div>
          )}
        />
      </ArticleChartCanvas>

      {/* サマリーカード */}
      <div className={styles.cardGrid}>
        {categories.map((item) => (
          <div
            key={item.category}
            className={styles.card}
            style={{ borderLeftColor: CATEGORY_COLORS[item.category] }}
          >
            <span className={styles.cardLabel}>{item.category}給付</span>
            <span className={styles.cardValue}>{item.amount}兆円</span>
            <span className={styles.cardMeta}>構成比 {item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
