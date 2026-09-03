"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort } from "@/lib/chart-format";
import renewableEnergyData from "@/data/renewable-energy-mix.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./NonFossilShareChart.module.css";

type NonFossilSeriesId = "nuclear" | "renewable" | "non_fossil";

const colors: Record<NonFossilSeriesId, string> = {
  renewable: "#5bbee4",
  nuclear: "#1e7aa8",
  non_fossil: "#7F1084",
};

const labels: Record<NonFossilSeriesId, string> = {
  nuclear: "原子力",
  renewable: "再エネ（水力含む）",
  non_fossil: "非化石電源（合計）",
};

const X_MIN = 1952;
const X_MAX = 2024;
const Y_MAX = 80; // Maximum non-fossil ratio needs to show up to 80%

type NonFossilDatum = { x: number; y: number };
type NonFossilLineSeries = LineSeries & {
  id: NonFossilSeriesId;
  data: NonFossilDatum[];
};

const rawData = renewableEnergyData.data;

// Calculate percentages
const CHART_DATA: NonFossilLineSeries[] = [
  {
    id: "nuclear",
    data: rawData.map((d) => ({
      x: d.year,
      y: (d.nuclear / d.total) * 100,
    })),
  },
  {
    id: "renewable",
    data: rawData.map((d) => ({
      x: d.year,
      y: ((d.hydro + d.new_energy) / d.total) * 100,
    })),
  },
  {
    id: "non_fossil",
    data: rawData.map((d) => ({
      x: d.year,
      y: ((d.nuclear + d.hydro + d.new_energy) / d.total) * 100,
    })),
  },
];

const tickYears = [1952, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2024];
const yTickValues = [0, 20, 40, 60, 80];

// Series labels on the right
function SeriesLabels({ xScale, yScale }: LineCustomSvgLayerProps<NonFossilLineSeries>) {
  const x = (xScale(X_MAX) as number) + 6;

  // 2024年度 values
  const latest = rawData[rawData.length - 1];
  if (!latest) return null;

  const nuclearPct = (latest.nuclear / latest.total) * 100;
  const renewablePct = ((latest.hydro + latest.new_energy) / latest.total) * 100;
  const nonFossilPct = ((latest.nuclear + latest.hydro + latest.new_energy) / latest.total) * 100;

  const nuclearY = yScale(nuclearPct) as number;
  const renewableY = yScale(renewablePct) as number;
  const nonFossilY = yScale(nonFossilPct) as number;

  return (
    <>
      <text x={x} y={nuclearY} fontSize={11} fontWeight={600} fill={colors.nuclear} dominantBaseline="middle" fontFamily='"Noto Sans JP", sans-serif'>
        {labels.nuclear}
      </text>
      <text x={x} y={renewableY} fontSize={11} fontWeight={600} fill={colors.renewable} dominantBaseline="middle" fontFamily='"Noto Sans JP", sans-serif'>
        {labels.renewable}
      </text>
      <text x={x} y={nonFossilY} fontSize={11} fontWeight={600} fill={colors.non_fossil} dominantBaseline="middle" fontFamily='"Noto Sans JP", sans-serif'>
        {labels.non_fossil}
      </text>
    </>
  );
}

// Tooltip
function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;
  const row = rawData.find((d) => d.year === year);
  if (!row) return null;

  const total = row.total;
  const nuclearPct = (row.nuclear / total) * 100;
  const renewablePct = ((row.hydro + row.new_energy) / total) * 100;
  const nonFossilPct = ((row.nuclear + row.hydro + row.new_energy) / total) * 100;

  const items: { id: NonFossilSeriesId; val: number; label: string; color: string }[] = [
    { id: "nuclear", val: nuclearPct, label: labels.nuclear, color: colors.nuclear },
    { id: "renewable", val: renewablePct, label: labels.renewable, color: colors.renewable },
    { id: "non_fossil", val: nonFossilPct, label: labels.non_fossil, color: colors.non_fossil },
  ];

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度</span>
      <div className={styles.tooltipRows}>
        {items.map(({ id, val, label, color }) => (
          <div key={id} className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: color }} />
            {label}：
            <strong className={styles.tooltipValue}>
              {val.toFixed(1)}%
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NonFossilShareChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：％</span>
      <ArticleChartCanvas height={380} mobileHeight={320}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: isMobile ? 75 : 95, bottom: 48, left: 48 }}
          xScale={{ type: "linear", min: X_MIN, max: X_MAX, nice: false }}
          yScale={{
            type: "linear",
            min: 0,
            max: Y_MAX,
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
            format: (v) => `${v}%`,
          }}
          layers={[
            "grid",
            "axes",
            "lines",
            SeriesLabels,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          colors={({ id }) => {
            if (id === "nuclear") return colors.nuclear;
            if (id === "renewable") return colors.renewable;
            return colors.non_fossil;
          }}
          enableArea={false}
          lineWidth={2}
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
          crosshairType="x"
          tooltip={({ point }) => <TooltipContent point={point} />}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
