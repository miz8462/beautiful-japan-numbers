"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import dataRaw from "@/data/farm-decline.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createAnnotationLayer, formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./SalesFarmHouseholdsChart.module.css";

const COLOR = "var(--color-brand, #5bbee4)";
const SERIES_LABEL = "販売農家数";

const CHART_DATA = [
  {
    id: "salesFarmHouseholds",
    data: dataRaw.salesFarmHouseholds.map((d) => ({ x: d.year, y: d.households })),
  },
];

const X_MIN = 1985;
const X_MAX = 2025;
const Y_MIN = 0;
const Y_MAX = 3500000;

const tickYears = [1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];
const yTickValues = [0, 500000, 1000000, 1500000, 2000000, 2500000, 3000000, 3500000];

function formatY(v: number) {
  if (v === 0) return "0";
  return `${(v / 10000).toFixed(0)}万`;
}

// 1985年は新定義の起点なのでアノテーションは不要（系列の先頭年自体が新定義）
// 代わりに2020年センサスの法人化進展をアノテーションする等も検討できるが今回は省略
const ANNOTATIONS: { year: number; label: string; labelYOffset?: number }[] = [];

function SeriesEndLabel({ xScale, yScale }: LineCustomSvgLayerProps<any>) {
  const last = dataRaw.salesFarmHouseholds[dataRaw.salesFarmHouseholds.length - 1];
  const x = ((xScale as any)(X_MAX) as number) + 6;
  const y = (yScale as any)(last.households) as number;

  return (
    <text
      x={x}
      y={y}
      fontSize={12}
      fontWeight={600}
      fill={COLOR}
      dominantBaseline="middle"
      fontFamily='"Noto Sans JP", sans-serif'
    >
      {SERIES_LABEL}
    </text>
  );
}

function TooltipContent({ point }: { point: { data: { x: unknown; y: unknown } } }) {
  const year = point.data.x as number;
  const row = dataRaw.salesFarmHouseholds.find((d) => d.year === year);
  if (!row) return null;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年</span>
      <div className={styles.tooltipRow}>
        <span className={styles.tooltipDot} style={{ background: COLOR }} />
        販売農家数：<strong className={styles.tooltipValue}>{row.households.toLocaleString()}戸</strong>
      </div>
      {row.note && <div className={styles.tooltipNote}>※{row.note}</div>}
    </div>
  );
}

export function SalesFarmHouseholdsChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：万戸</span>
      <ArticleChartCanvas height={380} mobileHeight={300}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 30, right: isMobile ? 60 : 80, bottom: 48, left: 52 }}
          xScale={{ type: "linear", min: X_MIN, max: X_MAX, nice: false }}
          yScale={{ type: "linear", min: Y_MIN, max: Y_MAX, nice: false }}
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
            format: formatY,
          }}
          colors={() => COLOR}
          enableArea={true}
          areaOpacity={0.08}
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
