"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import nonRegularData from "@/data/non-regular-employment.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createAnnotationLayer, formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./NonRegularEmploymentChart.module.css";

type RatioDatum = { x: number; y: number };
type RatioLineSeries = LineSeries & {
  id: "ratio";
  data: RatioDatum[];
};

const CHART_DATA: RatioLineSeries[] = [
  {
    id: "ratio",
    data: nonRegularData.map((d) => ({ x: d.year, y: d.ratio })),
  },
];

const X_MIN = 2002;
const X_MAX = 2025;
const Y_MIN = 25;
const Y_MAX = 42;

const tickYears = [2002, 2005, 2008, 2010, 2013, 2016, 2019, 2022, 2025];
const yTickValues = [25, 30, 35, 40];

const COLOR_BRAND = "var(--color-brand, #5bbee4)";
const LABEL_TEXT = "非正規雇用比率";

const ANNOTATIONS = [
  { year: 2008, label: "リーマンショック", labelYOffset: -10 },
  { year: 2019, label: "ピーク (38.3%)", labelYOffset: -10 },
  { year: 2020, label: "コロナ拡大", labelYOffset: 12 },
];

function SeriesEndLabel({
  xScale,
  yScale,
}: LineCustomSvgLayerProps<any>) {
  const lastRatio = nonRegularData[nonRegularData.length - 1].ratio;

  const x = ((xScale as any)(X_MAX) as number) + 6;
  const y = (yScale as any)(lastRatio) as number;

  return (
    <text
      x={x}
      y={y}
      fontSize={13}
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
  const row = nonRegularData.find((d) => d.year === year);

  if (!row) return null;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年</span>
      <div className={styles.tooltipRows}>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: COLOR_BRAND }}
          />
          非正規雇用比率：
          <strong className={styles.tooltipValue}>{row.ratio.toFixed(1)}%</strong>
        </div>
        <div className={styles.tooltipRow} style={{ opacity: 0.8, fontSize: "0.8rem" }}>
          非正規：{row.nonregular.toLocaleString("ja-JP")}万人 / 正規：{row.regular.toLocaleString("ja-JP")}万人
        </div>
      </div>
    </div>
  );
}

export function NonRegularEmploymentChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：%</span>
      <ArticleChartCanvas height={420} mobileHeight={360}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: isMobile ? 85 : 100, bottom: 48, left: 48 }}
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
