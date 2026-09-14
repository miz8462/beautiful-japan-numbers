"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort } from "@/lib/chart-format";
import marketCapData from "@/data/market-cap.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./MarketCapChart.module.css";

type MarketCapDatum = { x: number; y: number };
type MarketCapLineSeries = LineSeries & {
  id: string;
  data: MarketCapDatum[];
};

const rawData = marketCapData.data;

// Aggregate monthly data to yearly data (take December value for each year)
const yearlyData: Record<number, number> = {};
rawData.forEach((d) => {
  const year = parseInt(d.date.split("-")[0]);
  const month = parseInt(d.date.split("-")[1]);
  // Use December value for each year, or the last available month
  if (!yearlyData[year] || month === 12) {
    yearlyData[year] = d.totalMarketCapMillionYen / 1000000; // Convert to trillion yen
  }
});

// Convert to chart format
const CHART_DATA: MarketCapLineSeries[] = [
  {
    id: "marketCap",
    data: Object.entries(yearlyData)
      .map(([year, value]) => ({ x: parseInt(year), y: value }))
      .sort((a, b) => a.x - b.x),
  },
];

const Y_MAX = 1250;

const tickYears = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
const yTickValues = [0, 200, 400, 600, 800, 1000,1200];

// Annotations for key events
const ANNOTATIONS = [
  { year: 1989, label: "バブル期ピーク", labelYOffset: -16 },
];

function AnnotationLayer({
  xScale,
  innerHeight,
}: LineCustomSvgLayerProps<MarketCapLineSeries>) {
  return (
    <>
      {ANNOTATIONS.map(({ year, label, labelYOffset }) => {
        const x = xScale(year) as number;
        return (
          <g key={year}>
            <line
              x1={x}
              x2={x}
              y1={0}
              y2={innerHeight}
              stroke="#9ca3af"
              strokeDasharray="4 3"
              strokeWidth={1}
              opacity={0.6}
            />
            <text
              x={x}
              y={labelYOffset}
              fontSize={11}
              fill="#9ca3af"
              textAnchor="middle"
              fontFamily='"Noto Sans JP", "游ゴシック体", sans-serif'
            >
              {label}
            </text>
          </g>
        );
      })}
    </>
  );
}

// Tooltip
function TooltipContent({ point }: { point: { data: { x: unknown; y: unknown } } }) {
  const year = point.data.x as number;
  const value = point.data.y as number;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年</span>
      <div className={styles.tooltipRows}>
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: "var(--color-brand)" }} />
          時価総額：
          <strong className={styles.tooltipValue}>
            {value.toFixed(1)}兆円
          </strong>
        </div>
      </div>
    </div>
  );
}

export function MarketCapChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：兆円</span>
      <ArticleChartCanvas height={420} mobileHeight={360}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: isMobile ? 30 : 40, bottom: 48, left: 48 }}
          xScale={{ type: "point" }}
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
            format: (v) => `${v}兆`,
          }}
          colors={["var(--color-brand)"]}
          enableArea={true}
          areaOpacity={0.8}
          lineWidth={1.5}
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
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-data)",
              fontSize: 14,
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
        />
      </ArticleChartCanvas>
    </div>
  );
}
