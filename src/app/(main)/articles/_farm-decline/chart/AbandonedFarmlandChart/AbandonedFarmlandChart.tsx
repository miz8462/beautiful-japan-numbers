"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import dataRaw from "@/data/farm-decline.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./AbandonedFarmlandChart.module.css";

const COLOR = "var(--color-accent, #e85d4a)";
const SERIES_LABEL = "耕作放棄地面積";

const CHART_DATA = [
  {
    id: "abandonedFarmland",
    data: dataRaw.abandonedFarmland.map((d) => ({ x: d.year, y: d.hectares })),
  },
];

const X_MIN = 1975;
const X_MAX = 2015;
const Y_MIN = 0;
const Y_MAX = 500000;

const tickYears = [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015];
const yTickValues = [0, 100000, 200000, 300000, 400000, 500000];

function formatY(v: number) {
  return `${(v / 10000).toFixed(0)}万ha`;
}

function SeriesEndLabel({ xScale, yScale }: LineCustomSvgLayerProps<any>) {
  const last = dataRaw.abandonedFarmland[dataRaw.abandonedFarmland.length - 1];
  const x = ((xScale as any)(X_MAX) as number) + 6;
  const y = (yScale as any)(last.hectares) as number;

  return (
    <text
      x={x}
      y={y}
      fontSize={11}
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
  const row = dataRaw.abandonedFarmland.find((d) => d.year === year);
  if (!row) return null;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年</span>
      <div className={styles.tooltipRow}>
        <span className={styles.tooltipDot} style={{ background: COLOR }} />
        耕作放棄地：
        <strong className={styles.tooltipValue}>
          {row.hectares.toLocaleString()}ha
        </strong>
      </div>
    </div>
  );
}

export function AbandonedFarmlandChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：万ha</span>
      <ArticleChartCanvas height={360} mobileHeight={280}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 30, right: isMobile ? 72 : 88, bottom: 48, left: 56 }}
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
      <p className={styles.discontinuedNote}>
        ※2020年農林業センサスから耕作放棄地の調査項目が廃止されたため、データは2015年までとなります。
      </p>
    </div>
  );
}
