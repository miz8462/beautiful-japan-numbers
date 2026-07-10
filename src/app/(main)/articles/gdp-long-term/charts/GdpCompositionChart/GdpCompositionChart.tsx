"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import gdpData from "@/data/gdp-1980-2024.json";
import type { BarCustomLayerProps, BarDatum } from "@nivo/bar";
import { ResponsiveBar } from "@nivo/bar";
import styles from "./GdpCompositionChart.module.css";

type CategoryKey =
  | "privateConsumption"
  | "governmentConsumption"
  | "grossCapitalFormation"
  | "netExports";

type GdpBarDatum = BarDatum & {
  year: string;
} & Record<CategoryKey, number>;

type ScaleFn = (value: string | number) => number | undefined;

const categoryKeys: CategoryKey[] = [
  "netExports",
  "grossCapitalFormation",
  "governmentConsumption",
  "privateConsumption",
];

const labels: Record<CategoryKey, string> = {
  privateConsumption: "民間最終消費支出",
  governmentConsumption: "政府最終消費支出",
  grossCapitalFormation: "総資本形成",
  netExports: "純輸出",
};

const colors: Record<CategoryKey, string> = {
  privateConsumption: "#5bbee4", // Civic Sky
  governmentConsumption: "#1e7aa8", // Civic Sky Dark
  grossCapitalFormation: "#2e9e6e", // Green
  netExports: "#f06449", // Coral (for negative values)
};

const tickYears = ["1980", "1990", "2000", "2010", "2020", "2024"];
const yTickValues = [-10, 0, 20, 40, 60, 80, 100];

// 1980年度以降を使用
const filtered = gdpData.data.filter((d) => d.year >= 1980);

const chartData: GdpBarDatum[] = filtered.map((datum) => {
  const row = { year: String(datum.year) } as GdpBarDatum;
  categoryKeys.forEach((key) => {
    row[key] = datum.nominalShares[key];
  });
  return row;
});

// ─── カスタムレイヤー: ゼロライン ─────────────────────────────────
function ZeroLine({ yScale, innerWidth }: BarCustomLayerProps<GdpBarDatum>) {
  const y = yScale(0);
  if (y === undefined) return null;

  return (
    <line
      x1={0}
      x2={innerWidth}
      y1={y}
      y2={y}
      stroke="#888888"
      strokeWidth={1}
      strokeDasharray="4 2"
    />
  );
}

export function GdpCompositionChart() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：名目GDPに占める構成比（%）</span>
      <ArticleChartCanvas height={430} mobileHeight={390}>
        <ResponsiveBar
          data={chartData}
          keys={categoryKeys}
          indexBy="year"
          margin={{ top: 28, right: 24, bottom: 44, left: 48 }}
          padding={0.18}
          valueScale={{ type: "linear", min: -10, max: 100, nice: false }}
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
          layers={[
            "grid",
            ZeroLine,
            "axes",
            "bars",
            "markers",
          ]}
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
                <span className={styles.tooltipYear}>{indexValue}年度</span>
                <div className={styles.tooltipRows}>
                  {rows.map((key) => {
                    const value = Number(data[key]);
                    const isNegative = value < 0;
                    return (
                      <span key={key} className={styles.tooltipRow}>
                        <span
                          className={styles.tooltipDot}
                          style={{ background: colors[key] }}
                        />
                        {labels[key]}
                        <strong
                          className={
                            isNegative ? styles.tooltipNegative : styles.tooltipValue
                          }
                        >
                          {value.toFixed(1)}%
                        </strong>
                      </span>
                    );
                  })}
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
