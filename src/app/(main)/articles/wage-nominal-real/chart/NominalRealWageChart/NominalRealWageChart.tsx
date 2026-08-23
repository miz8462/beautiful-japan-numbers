"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import wageData from "@/data/wage-nominal-real.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createAnnotationLayer, formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./NominalRealWageChart.module.css";

type WageDatum = { x: number; y: number };
type WageLineSeries = LineSeries & {
  id: "nominal" | "real";
  data: WageDatum[];
};

const CHART_DATA: WageLineSeries[] = [
  {
    id: "nominal",
    data: wageData.map((d) => ({ x: d.year, y: d.nominal })),
  },
  {
    id: "real",
    data: wageData.map((d) => ({ x: d.year, y: d.real })),
  },
];

const X_MIN = 1990;
const X_MAX = 2025;
const Y_MIN = 90;
const Y_MAX = 125;

const tickYears = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];
const yTickValues = [90, 95, 100, 105, 110, 115, 120, 125];

const colors: Record<string, string> = {
  nominal: "var(--color-brand, #5bbee4)",
  real: "var(--color-accent, #c0392b)",
};

const labels: Record<string, string> = {
  nominal: "名目賃金",
  real: "実質賃金",
};

const ANNOTATIONS = [
  { year: 1997, label: "消費税5%引き上げ", labelYOffset: -10 },
  { year: 2008, label: "リーマンショック", labelYOffset: -10 },
  { year: 2020, label: "令和2年基準(=100)", labelYOffset: -10 },
];

function SeriesEndLabels({
  xScale,
  yScale,
}: LineCustomSvgLayerProps<any>) {
  const lastNominal = wageData[wageData.length - 1].nominal;
  const lastReal = wageData[wageData.length - 1].real;

  const x = ((xScale as any)(X_MAX) as number) + 6;
  const nominalY = (yScale as any)(lastNominal) as number;
  const realY = (yScale as any)(lastReal) as number;

  return (
    <>
      <text
        x={x}
        y={nominalY}
        fontSize={13}
        fontWeight={600}
        fill={colors.nominal}
        dominantBaseline="middle"
        fontFamily='"Noto Sans JP", sans-serif'
      >
        {labels.nominal}
      </text>
      <text
        x={x}
        y={realY}
        fontSize={13}
        fontWeight={600}
        fill={colors.real}
        dominantBaseline="middle"
        fontFamily='"Noto Sans JP", sans-serif'
      >
        {labels.real}
      </text>
    </>
  );
}

function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;
  const row = wageData.find((d) => d.year === year);

  if (!row) return null;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年</span>
      <div className={styles.tooltipRows}>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: colors.nominal }}
          />
          名目賃金指数：
          <strong className={styles.tooltipValue}>{row.nominal.toFixed(1)}</strong>
        </div>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: colors.real }}
          />
          実質賃金指数：
          <strong className={styles.tooltipValue}>{row.real.toFixed(1)}</strong>
        </div>
      </div>
    </div>
  );
}

export function NominalRealWageChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：指数（令和2年平均＝100）</span>
      <ArticleChartCanvas height={420} mobileHeight={360}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: isMobile ? 65 : 80, bottom: 48, left: 48 }}
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
            format: (v) => `${v}`,
          }}
          colors={({ id }) => colors[id]}
          enableArea={false}
          lineWidth={2.5}
          pointSize={0}
          enableGridX={false}
          gridYValues={yTickValues}
          useMesh={true}
          enableCrosshair={true}
          crosshairType="x"
          tooltip={({ point }) => <TooltipContent point={point} />}
          layers={[
            "grid",
            AnnotationLayer,
            "axes",
            "areas",
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
