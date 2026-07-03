"use client";

import { ResponsiveLine } from "@nivo/line";
import savingsData from "@/data/savings-rate.json";
import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import styles from "./SavingsRateChart.module.css";
import { useMediaQuery } from "@mui/material";

// ─── Nivo Theme ──────────────────────────────────────────────────
const nivoTheme = {
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
  markers: {
    lineColor: "#aaaaaa",
    lineStrokeWidth: 1.5,
    text: {
      fill: "#666666",
      fontFamily: '"Noto Sans JP", "游ゴシック体", sans-serif',
      fontSize: 11,
      fontWeight: 500,
    },
  },
};

// ─── Data formatting ─────────────────────────────────────────────
const CHART_DATA = [
  {
    id: "貯蓄率",
    color: "#5bbee4",
    data: savingsData.data.map((d) => ({
      x: d.fiscal_year,
      y: d.savings_rate_percent,
    })),
  },
];

export function SavingsRateChart() {
  return (
    <div className={styles.wrapper}>
      <ArticleChartCanvas height={360} mobileHeight={280}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 20, right: 65, bottom: 40, left: 45 }}
          xScale={{ type: "linear", min: 1994, max: 2024 }}
          yScale={{ type: "linear", min: -3, max: 14 }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: [1995, 2000, 2005, 2010, 2015, 2020, 2024],
            format: (v) => formatYearShort(v, v === 1995),
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: [-2, 0, 2, 4, 6, 8, 10, 12, 14],
            format: (v) => `${v}%`,
          }}
          colors={(serie) => String(serie.color)}
          lineWidth={3}
          enableGridX={false}
          gridYValues={[-2, 0, 2, 4, 6, 8, 10, 12, 14]}
          useMesh={true}
          pointSize={0}
          markers={[
            {
              axis: "x",
              value: 2009,
              lineStyle: { stroke: "#bbbbbb", strokeWidth: 1.5, strokeDasharray: "4 4" },
              legend: "東日本大震災",
              legendPosition: "top",
              textStyle: { fontSize: 10, fill: "#868484ff" }
            },
            {
              axis: "x",
              value: 2020,
              lineStyle: { stroke: "#bbbbbb", strokeWidth: 1.5, strokeDasharray: "4 4" },
              legend: "コロナ禍",
              legendPosition: "top",
              textStyle: { fontSize: 10, fill: "#868484ff" }
            },
          ]}
          layers={[
            "grid",
            "markers",
            "axes",
            "lines",
            "mesh",
            ({ series }) => {
              return (
                <>
                  {series.map((serie) => {
                    const lastPoint = serie.data[serie.data.length - 1];
                    if (!lastPoint) return null;
                    return (
                      <text
                        key={serie.id}
                        x={lastPoint.position.x + 8}
                        y={lastPoint.position.y + 4}
                        fontSize={12}
                        fontWeight={700}
                        fill="#5bbee4"
                        fontFamily='"Noto Sans JP", sans-serif'
                      >
                        {serie.id}
                      </text>
                    );
                  })}
                </>
              );
            },
          ]}
          theme={nivoTheme as any}
          tooltip={({ point }) => (
            <div className={styles.tooltip}>
              <span className={styles.tooltipYear}>{point.data.x}年</span>
              <span className={styles.tooltipVal}>
                貯蓄率: <strong>{Number(point.data.y).toFixed(1)}%</strong>
              </span>
            </div>
          )}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
