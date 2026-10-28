"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import genderWageGapData from "@/data/gender-wage-gap.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createAnnotationLayer, formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./GenderWageGapChart.module.css";

type GapDatum = { x: number; y: number };
type GapLineSeries = LineSeries & {
  id: "wage_gap";
  data: GapDatum[];
};

const CHART_DATA: GapLineSeries[] = [
  {
    id: "wage_gap",
    data: genderWageGapData.map((d) => ({ x: d.year, y: d.wage_gap })),
  },
];

const X_MIN = 1976;
const X_MAX = 2024;
const Y_MIN = 50;
const Y_MAX = 80;

const tickYears = [1976, 1985, 1995, 2005, 2015, 2020, 2024];
const yTickValues = [50, 55, 60, 65, 70, 75, 80];

const COLOR_BRAND = "#5bbee4";
const LABEL_TEXT = "男女間賃金格差（男性=100）";

const ANNOTATIONS = [
  { year: 2020, label: "2020年〜推計方法改定", labelYOffset: -10 },
];

function SeriesEndLabel({
  xScale,
  yScale,
}: LineCustomSvgLayerProps<any>) {
  const lastGap = genderWageGapData[genderWageGapData.length - 1].wage_gap;

  const x = ((xScale as any)(X_MAX) as number) + 6;
  const y = (yScale as any)(lastGap) as number;

  return (
    <text
      x={x}
      y={y}
      fontSize={12}
      fontWeight={600}
      fill={COLOR_BRAND}
      dominantBaseline="middle"
      fontFamily='"Noto Sans JP", sans-serif'
    >
      {LABEL_TEXT}
    </text>
  );
}

function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;
  const row = genderWageGapData.find((d) => d.year === year);

  if (!row) return null;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>
        {row.year}年（{row.year_jp}）
      </span>
      <div className={styles.tooltipRows}>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: COLOR_BRAND }}
          />
          男女間賃金格差：
          <strong className={styles.tooltipValue}>{row.wage_gap.toFixed(1)}</strong>
        </div>
        <div className={styles.tooltipRow} style={{ opacity: 0.8, fontSize: "0.8rem" }}>
          男性: {row.wage_male.toFixed(1)}千円 / 女性: {row.wage_female.toFixed(1)}千円
        </div>
      </div>
    </div>
  );
}

export function GenderWageGapChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：男性=100</span>
      <ArticleChartCanvas height={420} mobileHeight={360}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: isMobile ? 140 : 180, bottom: 48, left: 48 }}
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
          colors={[COLOR_BRAND]}
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
            SeriesEndLabel,
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
