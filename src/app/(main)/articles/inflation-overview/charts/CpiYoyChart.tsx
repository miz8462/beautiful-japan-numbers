"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import type { CpiDataPoint } from "@/types/cpi";
import type { BarCustomLayerProps, BarDatum } from "@nivo/bar";
import { ResponsiveBar } from "@nivo/bar";

type Props = {
  data: CpiDataPoint[];
};

type CpiBarDatum = BarDatum & {
  year: string;
  total: number;
};

type ScaleFn = (value: string | number) => number | undefined;

const annotations = [
  { year: 1997, label: "消費税 3→5%", color: "#9ca3af", labelY: 48 },
  { year: 2008, label: "リーマンショック", color: "#9ca3af", labelY: 48 },
  { year: 2014, label: "消費税 5→8%", color: "#9ca3af", labelY: 48 },
  { year: 2019, label: "消費税 8→10%", color: "#9ca3af", labelY: 48 },
  { year: 2020, label: "コロナ禍", color: "#f97316", labelY: 30 },
  { year: 2022, label: "ウクライナ侵攻", color: "#9ca3af", labelY: 12 },
];

const tickYears = ["1990", "1995", "2000", "2005", "2010", "2015", "2020", "2025"];

function toBarData(data: CpiDataPoint[]): CpiBarDatum[] {
  return data.map((point) => ({
    year: String(point.year),
    total: point.total,
  }));
}

function getBandCenter(
  xScale: BarCustomLayerProps<CpiBarDatum>["xScale"],
  year: string,
) {
  const scale = xScale as ScaleFn & { bandwidth?: () => number };
  const x = scale(year);
  if (x === undefined) return undefined;

  return x + (scale.bandwidth?.() ?? 0) / 2;
}

function AnnotationLayer({ xScale, innerHeight }: BarCustomLayerProps<CpiBarDatum>) {
  return (
    <>
      {annotations.map(({ year, label, color, labelY }) => {
        const x = getBandCenter(xScale, String(year));
        if (x === undefined) return null;

        return (
          <g key={year}>
            <line
              x1={x}
              x2={x}
              y1={0}
              y2={innerHeight}
              stroke={color}
              strokeDasharray="4 3"
              opacity={0.6}
            />
            <text
              x={x + 4}
              y={labelY}
              fontSize={10}
              fill={color}
              textAnchor="start"
            >
              {label}
            </text>
          </g>
        );
      })}
    </>
  );
}

function ZeroLine({ yScale, innerWidth }: BarCustomLayerProps<CpiBarDatum>) {
  const y = (yScale as ScaleFn)(0);
  if (y === undefined) return null;

  return (
    <line
      x1={0}
      x2={innerWidth}
      y1={y}
      y2={y}
      stroke="#6b7280"
      strokeWidth={1.5}
    />
  );
}

export function CpiYoyChart({ data }: Props) {
  const barData = toBarData(data);

  return (
    <ArticleChartCanvas height={360} mobileHeight={340}>
      <ResponsiveBar
        data={barData}
        keys={["total"]}
        indexBy="year"
        margin={{ top: 34, right: 28, bottom: 50, left: 55 }}
        padding={0.24}
        valueScale={{ type: "linear", min: -2, max: 5 }}
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
          tickValues: [-2, -1, 0, 1, 2, 3, 4, 5],
          format: (value) => `${value}%`,
        }}
        layers={[
          "grid",
          AnnotationLayer,
          ZeroLine,
          "axes",
          "bars",
        ]}
        colors={({ data: datum }) => (Number(datum.total) >= 0 ? "#5bbee4" : "#f87171")}
        enableLabel={false}
        enableGridX={false}
        gridYValues={[-2, -1, 0, 1, 2, 3, 4, 5]}
        theme={{
          background: "transparent",
          grid: { line: { stroke: "#E0E0E0", strokeWidth: 1 } },
          axis: { ticks: { text: { fontSize: 11, fill: "#888888" } } },
        }}
        tooltip={({ indexValue, data: datum }) => (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E0E0E0",
              padding: "6px 10px",
              fontSize: 12,
              color: "#1A1A1A",
              lineHeight: 1.6,
              whiteSpace: "nowrap",
            }}
          >
            {indexValue}年
            <br />
            {Number(datum.total).toFixed(1)}%
          </div>
        )}
        isInteractive={true}
      />
    </ArticleChartCanvas>
  );
}
