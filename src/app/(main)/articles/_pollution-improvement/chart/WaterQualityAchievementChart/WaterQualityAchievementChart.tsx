"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import pollutionDataRaw from "@/data/pollution.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./WaterQualityAchievementChart.module.css";

const COLOR_TOTAL = "var(--color-brand, #5bbee4)";
const COLOR_RIVER = "var(--color-brand-dark, #1e7aa8)";
const COLOR_SEA = "#3a9fb8";
const COLOR_LAKE = "#e67e22"; // 湖沼は改善が遅れている特筆系列として視認性を確保

const waterData = pollutionDataRaw.water_bod_cod_achievement_rate;
const totalMap = waterData.total;
const riverMap = waterData.river;
const lakeMap = waterData.lake;
const seaMap = waterData.sea;

const years = Object.keys(totalMap).map(Number).sort((a, b) => a - b);

const CHART_DATA: LineSeries[] = [
  {
    id: "total",
    data: years.map((y) => ({ x: y, y: Number(totalMap[String(y) as keyof typeof totalMap].toFixed(1)) })),
  },
  {
    id: "river",
    data: years.map((y) => ({ x: y, y: Number(riverMap[String(y) as keyof typeof riverMap].toFixed(1)) })),
  },
  {
    id: "sea",
    data: years.map((y) => ({ x: y, y: Number(seaMap[String(y) as keyof typeof seaMap].toFixed(1)) })),
  },
  {
    id: "lake",
    data: years.map((y) => ({ x: y, y: Number(lakeMap[String(y) as keyof typeof lakeMap].toFixed(1)) })),
  },
];

const LABELS: Record<string, string> = {
  total: "全体",
  river: "河川（BOD）",
  sea: "海域（COD）",
  lake: "湖沼（COD）",
};

const COLORS: Record<string, string> = {
  total: COLOR_TOTAL,
  river: COLOR_RIVER,
  sea: COLOR_SEA,
  lake: COLOR_LAKE,
};

const X_MIN = 1974;
const X_MAX = 2023;
const Y_MIN = 30;
const Y_MAX = 100;

const tickYears = [1974, 1980, 1990, 2000, 2010, 2020, 2023];
const yTickValues = [30, 40, 50, 60, 70, 80, 90, 100];

function SeriesEndLabels({
  xScale,
  yScale,
}: LineCustomSvgLayerProps<any>) {
  const lastYear = years[years.length - 1];
  const lastRiver = riverMap[String(lastYear) as keyof typeof riverMap];
  const lastTotal = totalMap[String(lastYear) as keyof typeof totalMap];
  const lastSea = seaMap[String(lastYear) as keyof typeof seaMap];
  const lastLake = lakeMap[String(lastYear) as keyof typeof lakeMap];

  const x = ((xScale as any)(lastYear) as number) + 6;

  const posMap = [
    { key: "river", label: "河川", color: COLOR_RIVER, y: (yScale as any)(lastRiver) as number },
    { key: "total", label: "全体", color: COLOR_TOTAL, y: (yScale as any)(lastTotal) as number },
    { key: "sea", label: "海域", color: COLOR_SEA, y: (yScale as any)(lastSea) as number },
    { key: "lake", label: "湖沼", color: COLOR_LAKE, y: (yScale as any)(lastLake) as number },
  ];

  return (
    <g>
      {posMap.map(({ key, label, color, y }) => (
        <text
          key={key}
          x={x}
          y={y}
          fontSize={11}
          fontWeight={600}
          fill={color}
          dominantBaseline="middle"
          fontFamily='"Noto Sans JP", sans-serif'
        >
          {label}
        </text>
      ))}
    </g>
  );
}

function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;
  const totalVal = totalMap[String(year) as keyof typeof totalMap];
  const riverVal = riverMap[String(year) as keyof typeof riverMap];
  const lakeVal = lakeMap[String(year) as keyof typeof lakeMap];
  const seaVal = seaMap[String(year) as keyof typeof seaMap];

  if (totalVal === undefined) return null;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度</span>
      <div className={styles.tooltipRows}>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: COLOR_TOTAL }}
          />
          <span className={styles.tooltipLabel}>全体：</span>
          <strong className={styles.tooltipValue}>{totalVal.toFixed(1)}%</strong>
        </div>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: COLOR_RIVER }}
          />
          <span className={styles.tooltipLabel}>河川（BOD）：</span>
          <strong className={styles.tooltipValue}>{riverVal.toFixed(1)}%</strong>
        </div>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: COLOR_SEA }}
          />
          <span className={styles.tooltipLabel}>海域（COD）：</span>
          <strong className={styles.tooltipValue}>{seaVal.toFixed(1)}%</strong>
        </div>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: COLOR_LAKE }}
          />
          <span className={styles.tooltipLabel}>湖沼（COD）：</span>
          <strong className={styles.tooltipValue}>{lakeVal.toFixed(1)}%</strong>
        </div>
      </div>
    </div>
  );
}

export function WaterQualityAchievementChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：%</span>
      <ArticleChartCanvas height={380} mobileHeight={300}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 24, right: isMobile ? 65 : 85, bottom: 48, left: 48 }}
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
          colors={({ id }) => COLORS[id as string]}
          enableArea={false}
          lineWidth={2.2}
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
