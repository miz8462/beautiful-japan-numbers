"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort } from "@/lib/chart-format";
import renewableEnergyData from "@/data/renewable-energy-mix.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./PowerSourceMixChart.module.css";

type PowerSourceSeriesId =
  | "hydro"
  | "coal"
  | "lng"
  | "oil"
  | "nuclear"
  | "new_energy";

const colors: Record<PowerSourceSeriesId, string> = {
  hydro: "#2196F3",
  coal: "#757575",
  lng: "#FF9800",
  oil: "#F44336",
  nuclear: "#9C27B0",
  new_energy: "#00BCD4",
};

const labels: Record<PowerSourceSeriesId, string> = {
  hydro: "水力",
  coal: "石炭",
  lng: "LNG",
  oil: "石油等",
  nuclear: "原子力",
  new_energy: "新エネ等",
};

const X_MIN = 1952;
const X_MAX = 2024;
const Y_MAX = 12000; // Maximum total is around 11494億kWh

type PowerSourceDatum = { x: number; y: number };
type PowerSourceLineSeries = LineSeries & {
  id: PowerSourceSeriesId;
  data: PowerSourceDatum[];
};

const rawData = renewableEnergyData.data;

// Stacked order: bottom to top - hydro -> coal -> lng -> oil -> nuclear -> new_energy
const CHART_DATA: PowerSourceLineSeries[] = [
  {
    id: "hydro",
    data: rawData.map((d) => ({ x: d.year, y: d.hydro })),
  },
  {
    id: "coal",
    data: rawData.map((d) => ({ x: d.year, y: d.coal })),
  },
  {
    id: "lng",
    data: rawData.map((d) => ({ x: d.year, y: d.lng })),
  },
  {
    id: "oil",
    data: rawData.map((d) => ({ x: d.year, y: d.oil })),
  },
  {
    id: "nuclear",
    data: rawData.map((d) => ({ x: d.year, y: d.nuclear })),
  },
  {
    id: "new_energy",
    data: rawData.map((d) => ({ x: d.year, y: d.new_energy })),
  },
];

const tickYears = [1952, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024];
const yTickValues = [0, 2000, 4000, 6000, 8000, 10000, 12000];

// Right-end series labels
function EndLabels({ xScale, yScale }: LineCustomSvgLayerProps<PowerSourceLineSeries>) {
  const x = (xScale(X_MAX) as number) + 6;

  // 2024年度 values
  const latest = rawData[rawData.length - 1];
  if (!latest) return null;

  const vals: Record<PowerSourceSeriesId, number> = {
    hydro: latest.hydro,
    coal: latest.coal,
    lng: latest.lng,
    oil: latest.oil,
    nuclear: latest.nuclear,
    new_energy: latest.new_energy,
  };

  // Calculate stacked Y positions (center of each area)
  let currentSum = 0;
  const yPositions = (Object.keys(vals) as PowerSourceSeriesId[]).map((id) => {
    const val = vals[id];
    const y = yScale(currentSum + val / 2) as number;
    currentSum += val;
    return { id, y, val };
  });

  return (
    <>
      {yPositions.map(({ id, y, val }) => {
        if (val < 50) return null; // Skip very small values to avoid label overlap
        return (
          <text
            key={id}
            x={x}
            y={y}
            fontSize={10}
            fontWeight={id === "nuclear" || id === "hydro" ? 600 : 500}
            fill={colors[id]}
            dominantBaseline="middle"
            fontFamily='"Noto Sans JP", sans-serif'
          >
            {labels[id]}
          </text>
        );
      })}
    </>
  );
}

// Tooltip
function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;
  const row = rawData.find((d) => d.year === year);
  if (!row) return null;

  const total = row.total;

  const items: { id: PowerSourceSeriesId; val: number }[] = [
    { id: "hydro", val: row.hydro },
    { id: "coal", val: row.coal },
    { id: "lng", val: row.lng },
    { id: "oil", val: row.oil },
    { id: "nuclear", val: row.nuclear },
    { id: "new_energy", val: row.new_energy },
  ];

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度</span>
      <div className={styles.tooltipRows}>
        {items.map(({ id, val }) => (
          <div key={id} className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: colors[id] }} />
            {labels[id]}：
            <strong className={styles.tooltipValue}>
              {val.toFixed(0)}億kWh
            </strong>
          </div>
        ))}
        <div className={`${styles.tooltipRow} ${styles.tooltipTotal}`}>
          <span className={styles.tooltipDot} style={{ background: "#888888" }} />
          合計：
          <strong className={styles.tooltipValue}>
            {total.toFixed(0)}億kWh
          </strong>
        </div>
      </div>
    </div>
  );
}

export function PowerSourceMixChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：億kWh</span>
      <ArticleChartCanvas height={450} mobileHeight={380}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: isMobile ? 55 : 75, bottom: 48, left: 48 }}
          xScale={{ type: "linear", min: X_MIN, max: X_MAX, nice: false }}
          yScale={{
            type: "linear",
            min: 0,
            max: Y_MAX,
            stacked: true,
            nice: false,
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: tickYears,
            format: (v) => formatYearShort(v, v === tickYears[0]),
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: yTickValues,
            format: (v) => `${v}`,
          }}
          layers={[
            "grid",
            "axes",
            "areas",
            "lines",
            EndLabels,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          colors={[
            colors.hydro,
            colors.coal,
            colors.lng,
            colors.oil,
            colors.nuclear,
            colors.new_energy,
          ]}
          enableArea={true}
          areaOpacity={0.7}
          lineWidth={1.2}
          pointSize={0}
          enableGridX={false}
          gridYValues={yTickValues}
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-data)",
              fontSize: 13,
              fill: "var(--color-text-secondary)",
            },
            grid: { line: { stroke: "var(--color-border)", strokeWidth: 1, strokeDasharray: "4 4" } },
            axis: {
              domain: { line: { stroke: "transparent" } },
              ticks: {
                line: { stroke: "transparent" },
                text: { fill: "var(--color-text-secondary)", fontSize: 12 },
              },
            },
          }}
          useMesh={true}
          enableCrosshair={true}
          tooltip={({ point }) => <TooltipContent point={point} />}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
