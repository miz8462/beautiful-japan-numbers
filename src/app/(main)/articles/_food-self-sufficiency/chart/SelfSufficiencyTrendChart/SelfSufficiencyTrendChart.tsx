"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import trendDataRaw from "@/data/food-self-sufficiency.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createAnnotationLayer, formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./SelfSufficiencyTrendChart.module.css";

type TrendDatum = { x: number; y: number };
type TrendLineSeries = LineSeries & {
  id: "calorieBase" | "productionValueBase";
  data: TrendDatum[];
};

const CHART_DATA: TrendLineSeries[] = [
  {
    id: "calorieBase",
    data: trendDataRaw.data.map((d) => ({ x: d.year, y: d.calorieBase })),
  },
  {
    id: "productionValueBase",
    data: trendDataRaw.data.map((d) => ({ x: d.year, y: d.productionValueBase })),
  },
];

const X_MIN = 1965;
const X_MAX = 2025;
const Y_MIN = 30;
const Y_MAX = 100;

const tickYears = [1965, 1975, 1985, 1995, 2005, 2015, 2025];
const yTickValues = [30, 40, 50, 60, 70, 80, 90, 100];

const colors: Record<string, string> = {
  calorieBase: "var(--color-brand, #5bbee4)",
  productionValueBase: "var(--color-brand-dark, #1e7aa8)",
};

const labels: Record<string, string> = {
  calorieBase: "カロリーベース",
  productionValueBase: "生産額ベース",
};

const ANNOTATIONS = [
  { year: 1993, label: "米不作(記録的冷夏)", labelYOffset: -10 },
  { year: 2022, label: "円安・ロシアのウクライナ侵攻による穀物高", labelYOffset: -10 },
];

function SeriesEndLabels({
  xScale,
  yScale,
}: LineCustomSvgLayerProps<any>) {
  const lastItem = trendDataRaw.data[trendDataRaw.data.length - 1];
  const lastCalorie = lastItem.calorieBase;
  const lastProduction = lastItem.productionValueBase;

  const x = ((xScale as any)(X_MAX) as number) + 6;
  const calorieY = (yScale as any)(lastCalorie) as number;
  const productionY = (yScale as any)(lastProduction) as number;

  return (
    <>
      <text
        x={x}
        y={calorieY}
        fontSize={12}
        fontWeight={600}
        fill={colors.calorieBase}
        dominantBaseline="middle"
        fontFamily='"Noto Sans JP", sans-serif'
      >
        {labels.calorieBase}
      </text>
      <text
        x={x}
        y={productionY}
        fontSize={12}
        fontWeight={600}
        fill={colors.productionValueBase}
        dominantBaseline="middle"
        fontFamily='"Noto Sans JP", sans-serif'
      >
        {labels.productionValueBase}
      </text>
    </>
  );
}

function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;
  const row = trendDataRaw.data.find((d) => d.year === year);

  if (!row) return null;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度</span>
      <div className={styles.tooltipRows}>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: colors.productionValueBase }}
          />
          生産額ベース：
          <strong className={styles.tooltipValue}>{row.productionValueBase}%</strong>
        </div>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: colors.calorieBase }}
          />
          カロリーベース：
          <strong className={styles.tooltipValue}>{row.calorieBase}%</strong>
        </div>

      </div>
    </div>
  );
}

export function SelfSufficiencyTrendChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：%</span>
      <ArticleChartCanvas height={420} mobileHeight={360}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: isMobile ? 95 : 110, bottom: 48, left: 48 }}
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
