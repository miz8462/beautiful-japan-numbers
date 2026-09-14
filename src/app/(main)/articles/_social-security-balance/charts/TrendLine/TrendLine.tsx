"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort, createAnnotationLayer } from "@/lib/chart-format";
import balanceData from "@/data/social-security-balance.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./TrendLine.module.css";

// 系列の型定義
type SeriesId = "給付費総額" | "保険料収入" | "公費負担（国・地方）";

const COLOR_MAP: Record<SeriesId, string> = {
  給付費総額: "var(--color-accent, #c0392b)",
  保険料収入: "var(--color-brand, #5bbee4)",
  "公費負担（国・地方）": "var(--color-brand-dark, #1e7aa8)",
};

const X_MIN = 1990;
const X_MAX = 2026;
const Y_MAX = 160;

type Datum = { x: number; y: number };
type BalanceLineSeries = LineSeries & {
  id: SeriesId;
  data: Datum[];
};

const rawTrend = balanceData.trend;

const CHART_DATA: BalanceLineSeries[] = rawTrend.map((series) => ({
  id: series.id as SeriesId,
  data: series.data.map((d) => ({
    x: Number(d.x),
    y: d.y,
  })),
}));

const tickYears = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2026];
const yTickValues = [0, 40, 80, 120, 160];

const ANNOTATIONS = [
  { year: 1990, label: "基準年", labelYOffset: -10 },
  { year: 2000, label: "介護保険導入", labelYOffset: -22 },
  { year: 2020, label: "コロナ禍", labelYOffset: -10 },
];

function EndLabels({
  xScale,
  yScale,
}: LineCustomSvgLayerProps<BalanceLineSeries>) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const x = (xScale(X_MAX) as number) + (isMobile ? 6 : 8);

  const seriesEndPoints: { id: SeriesId; val: number; label: string }[] = [
    { id: "給付費総額", val: 144.1, label: "給付費総額" },
    { id: "保険料収入", val: 76.7, label: "保険料" },
    { id: "公費負担（国・地方）", val: 67.4, label: "公費負担" },
  ];

  return (
    <>
      {seriesEndPoints.map(({ id, val, label }) => {
        const y = yScale(val) as number;
        return (
          <text
            key={id}
            x={x}
            y={y}
            fontSize={isMobile ? 10 : 12}
            fontWeight={700}
            fill={COLOR_MAP[id]}
            dominantBaseline="middle"
            fontFamily="var(--font-body, sans-serif)"
          >
            {label}
          </text>
        );
      })}
    </>
  );
}

function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = String(point.data.x);

  const rows = rawTrend.map((series) => {
    const item = series.data.find((d) => d.x === year);
    return {
      id: series.id as SeriesId,
      val: item ? item.y : null,
    };
  });

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度</span>
      <div className={styles.tooltipRows}>
        {rows.map(({ id, val }) => (
          <div key={id} className={styles.tooltipRow}>
            <span
              className={styles.tooltipDot}
              style={{ background: COLOR_MAP[id] }}
            />
            <span>{id}：</span>
            <strong className={styles.tooltipValue}>
              {val != null ? `${val.toFixed(1)}兆円` : "-"}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrendLine() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：兆円</span>
      <ArticleChartCanvas height={420} mobileHeight={340}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{
            top: 36,
            right: isMobile ? 74 : 104,
            bottom: 48,
            left: 48,
          }}
          xScale={{
            type: "linear",
            min: X_MIN,
            max: X_MAX,
            nice: false,
          }}
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
            format: (v) => (v === 0 ? "0" : `${v}`),
          }}
          layers={[
            "grid",
            AnnotationLayer,
            "axes",
            "lines",
            EndLabels,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          colors={({ id }) => COLOR_MAP[id as SeriesId]}
          lineWidth={2.5}
          pointSize={0}
          enableGridX={false}
          gridYValues={yTickValues}
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-data, monospace)",
              fontSize: 12,
              fill: "var(--color-text-muted, #888888)",
            },
            grid: {
              line: {
                stroke: "var(--color-border, #e0e0e0)",
                strokeWidth: 1,
              },
            },
            axis: {
              domain: { line: { stroke: "transparent" } },
              ticks: {
                line: { stroke: "transparent" },
                text: { fill: "var(--color-text-muted, #888888)", fontSize: 12 },
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
