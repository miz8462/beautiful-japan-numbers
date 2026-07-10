"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import expenditureData from "@/data/household-expenditure-structure.json";
import type { BarCustomLayerProps, BarDatum } from "@nivo/bar";
import { ResponsiveBar } from "@nivo/bar";
import styles from "./ExpenditureShareChart.module.css";

type CategoryKey =
  | "food"
  | "transport_comm"
  | "housing"
  | "utilities"
  | "furniture"
  | "clothing"
  | "medical"
  | "education"
  | "culture_recreation"
  | "other";

type ExpenditureBarDatum = BarDatum & {
  year: string;
} & Record<CategoryKey, number>;

type ScaleFn = (value: string | number) => number | undefined;

const categoryKeys: CategoryKey[] = [
  "other",
  "culture_recreation",
  "education",
  "medical",
  "clothing",
  "furniture",
  "utilities",
  "housing",
  "transport_comm",
  "food",
];

const labels: Record<CategoryKey, string> = {
  food: "食料",
  housing: "住居",
  utilities: "光熱・水道",
  furniture: "家具・家事用品",
  clothing: "被服及び履物",
  medical: "保健医療",
  transport_comm: "交通・通信",
  education: "教育",
  culture_recreation: "教養娯楽",
  other: "その他",
};

const colors: Record<CategoryKey, string> = {
  food: "#5bbee4",
  transport_comm: "#1e7aa8",
  housing: "#c7c7c7",
  utilities: "#d4d4d4",
  furniture: "#bdbdbd",
  clothing: "#cfcfcf",
  medical: "#b8b8b8",
  education: "#dcdcdc",
  culture_recreation: "#c2c2c2",
  other: "#e2e2e2",
};

const tickYears = ["2000", "2005", "2010", "2015", "2020", "2025"];
const yTickValues = [0, 20, 40, 60, 80, 100];

const chartData: ExpenditureBarDatum[] = expenditureData.data.map((datum) => {
  const row = { year: String(datum.year) } as ExpenditureBarDatum;
  categoryKeys.forEach((key) => {
    row[key] = datum.shares[key];
  });
  return row;
});

export function ExpenditureShareChart() {
  return (
    <div className={styles.wrapper}>
      <ArticleChartCanvas height={430} mobileHeight={390}>
        <ResponsiveBar
          data={chartData}
          keys={categoryKeys}
          indexBy="year"
          margin={{ top: 28, right: 24, bottom: 44, left: 48 }}
          padding={0.18}
          valueScale={{ type: "linear", min: 0, max: 100, nice: false }}
          indexScale={{ type: "band", round: false }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: tickYears,
            format: (value) => formatYearShort(value, value === tickYears[0]),
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: yTickValues,
            format: (value) => `${value}%`,
          }}
          colors={({ id }) => colors[id as CategoryKey]}
          enableLabel={false}
          enableGridX={false}
          gridYValues={yTickValues}
          theme={{
            background: "transparent",
            text: {
              fontFamily: '"Roboto Mono", "SFMono-Regular", Consolas, monospace',
              fontSize: 11,
              fill: "#888888",
            },
            grid: { line: { stroke: "#e0e0e0", strokeWidth: 1 } },
            axis: {
              domain: { line: { stroke: "transparent" } },
              ticks: {
                line: { stroke: "transparent" },
                text: { fill: "#888888", fontSize: 11 },
              },
            },
          }}
          tooltip={({ indexValue, data }) => {
            const rows = [...categoryKeys].reverse();
            return (
              <div className={styles.tooltip}>
                <span className={styles.tooltipYear}>{indexValue}年</span>
                <div className={styles.tooltipRows}>
                  {rows.map((key) => (
                    <span key={key} className={styles.tooltipRow}>
                      <span
                        className={styles.tooltipDot}
                        style={{ background: colors[key] }}
                      />
                      {labels[key]}
                      <strong className={styles.tooltipValue}>
                        {Number(data[key]).toFixed(1)}%
                      </strong>
                    </span>
                  ))}
                </div>
              </div>
            );
          }}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
