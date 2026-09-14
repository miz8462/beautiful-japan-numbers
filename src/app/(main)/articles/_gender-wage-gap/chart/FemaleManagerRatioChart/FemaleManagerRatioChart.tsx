"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import femaleManagerData from "@/data/female-manager-ratio.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "../GenderWageGapChart/GenderWageGapChart.module.css";

type SeriesId = "yakuin" | "bucho" | "kacho" | "kakaricho";

type ManagerDatum = { x: number; y: number };
type ManagerLineSeries = LineSeries & {
  id: SeriesId;
  data: ManagerDatum[];
};

const SERIES_KEYS: SeriesId[] = ["yakuin", "bucho", "kacho", "kakaricho"];

const labels: Record<SeriesId, string> = {
  yakuin: "役員",
  bucho: "部長相当職",
  kacho: "課長相当職",
  kakaricho: "係長相当職",
};

const colors: Record<SeriesId, string> = {
  yakuin: "#8b5cf6",
  bucho: "#64748b",
  kacho: "#38bdf8",
  kakaricho: "#14b8a6",
};

const CHART_DATA: ManagerLineSeries[] = SERIES_KEYS.map((key) => ({
  id: key,
  data: femaleManagerData.map((d) => ({ x: d.year, y: d[key] })),
}));

const X_MIN = 2009;
const X_MAX = 2024;
const Y_MIN = 0;
const Y_MAX = 22;

const tickYears = [2009, 2011, 2013, 2015, 2017, 2019, 2021, 2023, 2024];
const yTickValues = [0, 5, 10, 15, 20];

function SeriesEndLabels({
  xScale,
  yScale,
}: LineCustomSvgLayerProps<any>) {
  const lastRow = femaleManagerData[femaleManagerData.length - 1];

  const labelOffsets: Record<SeriesId, number> = {
    yakuin: 0,
    kakaricho: 0,
    kacho: 0,
    bucho: 0,
  };

  const x = ((xScale as any)(X_MAX) as number) + 6;

  return (
    <>
      {SERIES_KEYS.map((key) => {
        const val = lastRow[key];
        const rawY = (yScale as any)(val) as number;
        const y = rawY + (labelOffsets[key] || 0);

        return (
          <text
            key={key}
            x={x}
            y={y}
            fontSize={11}
            fontWeight={600}
            fill={colors[key]}
            dominantBaseline="middle"
            fontFamily='"Noto Sans JP", sans-serif'
          >
            {labels[key]}
          </text>
        );
      })}
    </>
  );
}

function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;
  const row = femaleManagerData.find((d) => d.year === year);

  if (!row) return null;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>
        {row.year}年度（{row.fiscal_year_label}）
      </span>
      <div className={styles.tooltipRows}>
        {SERIES_KEYS.map((key) => (
          <div key={key} className={styles.tooltipRow}>
            <span
              className={styles.tooltipDot}
              style={{ background: colors[key] }}
            />
            <span>{labels[key]}：</span>
            <strong className={styles.tooltipValue}>{row[key].toFixed(1)}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FemaleManagerRatioChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：%</span>
      <ArticleChartCanvas height={440} mobileHeight={380}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 30, right: isMobile ? 125 : 155, bottom: 48, left: 48 }}
          xScale={{ type: "linear", min: X_MIN, max: X_MAX, nice: false }}
          yScale={{
            type: "linear",
            min: Y_MIN,
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
          colors={({ id }) => colors[id as SeriesId]}
          lineWidth={2}
          pointSize={0}
          enableGridX={false}
          gridYValues={yTickValues}
          useMesh={true}
          enableCrosshair={true}
          crosshairType="x"
          tooltip={({ point }) => <TooltipContent point={point} />}
          layers={[
            "grid",
            "axes",
            "lines",
            SeriesEndLabels,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-data)",
              fontSize: 14,
              fill: "var(--color-text-secondary)",
            },
            grid: {
              line: {
                stroke: "var(--color-border)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              },
            },
            axis: {
              domain: { line: { stroke: "transparent" } },
              ticks: {
                line: { stroke: "transparent" },
                text: { fill: "var(--color-text-secondary)", fontSize: 12 },
              },
            },
          }}
        />
      </ArticleChartCanvas>
    </div>
  );
}
