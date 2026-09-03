"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort } from "@/lib/chart-format";
import renewableEnergyData from "@/data/renewable-energy-mix.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./RenewableBreakdownChart.module.css";

type RenewableSeriesId =
  | "hydro"
  | "solar"
  | "wind"
  | "geothermal"
  | "biomass";

const colors: Record<RenewableSeriesId, string> = {
  hydro: "#2196F3",
  solar: "#03A9F4",
  wind: "#00BCD4",
  geothermal: "#009688",
  biomass: "#4CAF50",
};

const labels: Record<RenewableSeriesId, string> = {
  hydro: "水力",
  solar: "太陽光",
  wind: "風力",
  geothermal: "地熱",
  biomass: "バイオマス",
};

const X_MIN = 2010;
const X_MAX = 2024;
const Y_MAX = 1800; // Maximum renewable total is around 1551億kWh, so 1800 is reasonable

type RenewableDatum = { x: number; y: number };
type RenewableLineSeries = LineSeries & {
  id: RenewableSeriesId;
  data: RenewableDatum[];
};

const rawData = renewableEnergyData.data.filter((d) => d.year >= 2010);

// Stacked order: bottom to top - hydro -> solar -> wind -> geothermal -> biomass
const CHART_DATA: RenewableLineSeries[] = [
  {
    id: "hydro",
    data: rawData.map((d) => ({ x: d.year, y: d.hydro })),
  },
  {
    id: "solar",
    data: rawData.map((d) => ({ x: d.year, y: d.solar || 0 })),
  },
  {
    id: "wind",
    data: rawData.map((d) => ({ x: d.year, y: d.wind || 0 })),
  },
  {
    id: "geothermal",
    data: rawData.map((d) => ({ x: d.year, y: d.geothermal || 0 })),
  },
  {
    id: "biomass",
    data: rawData.map((d) => ({ x: d.year, y: d.biomass || 0 })),
  },
];

const tickYears = [2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024];
const yTickValues = [0, 300, 600, 900, 1200, 1500, 1800];

// Right-end series labels
function EndLabels({ xScale, yScale }: LineCustomSvgLayerProps<RenewableLineSeries>) {
  const x = (xScale(X_MAX) as number) + 6;

  // 2024年度 values
  const latest = rawData[rawData.length - 1];
  if (!latest) return null;

  const vals: Record<RenewableSeriesId, number> = {
    hydro: latest.hydro,
    solar: latest.solar || 0,
    wind: latest.wind || 0,
    geothermal: latest.geothermal || 0,
    biomass: latest.biomass || 0,
  };

  // Calculate stacked Y positions (center of each area)
  let currentSum = 0;
  const yPositions = (Object.keys(vals) as RenewableSeriesId[]).map((id) => {
    const val = vals[id];
    const y = yScale(currentSum + val / 2) as number;
    currentSum += val;
    return { id, y, val };
  });

  return (
    <>
      {yPositions.map(({ id, y, val }) => {
        if (val < 20) return null; // Skip very small values to avoid label overlap
        return (
          <text
            key={id}
            x={x}
            y={y}
            fontSize={10}
            fontWeight={id === "hydro" ? 600 : 500}
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

  const total = row.hydro + (row.solar || 0) + (row.wind || 0) + (row.geothermal || 0) + (row.biomass || 0);

  const items: { id: RenewableSeriesId; val: number }[] = [
    { id: "hydro", val: row.hydro },
    { id: "solar", val: row.solar || 0 },
    { id: "wind", val: row.wind || 0 },
    { id: "geothermal", val: row.geothermal || 0 },
    { id: "biomass", val: row.biomass || 0 },
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

export function RenewableBreakdownChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：億kWh</span>
      <ArticleChartCanvas height={380} mobileHeight={320}>
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
          colors={({ id }) => colors[id as RenewableSeriesId]}
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
