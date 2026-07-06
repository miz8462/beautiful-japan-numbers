"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import expenditureData from "@/data/household-expenditure-structure.json";
import { formatYearShort } from "@/lib/chart-format";
import type { LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./EngelCoefficientChart.module.css";

type EngelLineSeries = LineSeries & {
  id: "engelCoefficient";
  data: { x: number; y: number }[];
};

const color = "#5bbee4";
const tickYears = [2000, 2005, 2010, 2015, 2020, 2025];
const yTickValues = [22, 24, 26, 28, 30];

const chartData: EngelLineSeries[] = [
  {
    id: "engelCoefficient",
    data: expenditureData.data.map((datum) => ({
      x: datum.year,
      y: datum.engelCoefficient,
    })),
  },
];

export function EngelCoefficientChart() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>エンゲル係数 = 食費 / 消費支出合計 × 100</span>
      <p>
        エンゲル係数が高いのは、消費のうち食費が締める割合が高いことを示します。
      </p>
      <p>
        一般に25％を越えると生活のゆとりが少なくなり、
        30％以上になると生活が苦しいと感じる家庭が多くなります。
      </p>
      <ArticleChartCanvas height={360} mobileHeight={300}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 28, right: 24, bottom: 42, left: 48 }}
          xScale={{ type: "linear", min: 2000, max: 2025, nice: false }}
          yScale={{ type: "linear", min: 22, max: 30, nice: false }}
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
          colors={[color]}
          lineWidth={2.5}
          pointSize={0}
          pointBorderWidth={0}
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
          useMesh={true}
          tooltip={({ point }) => (
            <div className={styles.tooltip}>
              <span className={styles.tooltipYear}>{point.data.x}年：
                <strong>{Number(point.data.y).toFixed(1)}%</strong></span>
            </div>
          )}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
