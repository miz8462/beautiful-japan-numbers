"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import longTermRateData from "@/data/long_term_rate_10y.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./LongTermRateChart.module.css";

type RateSeriesId = "longTermRate";

type RateLineSeries = LineSeries & {
  id: RateSeriesId;
  data: { x: number; y: number }[];
};

const COLOR_RATE = "var(--color-brand)";
const SERIES_LABEL = "10年国債利回り";

const X_MIN = 1986;
const X_MAX = 2026;
const Y_MIN = -0.5;
const Y_MAX = 8.0;

const CHART_DATA: RateLineSeries[] = [
  {
    id: "longTermRate",
    data: longTermRateData.map((d) => ({
      x: d.year,
      y: d.yield10yPercent,
    })),
  },
];

const tickYears = [1986, 1995, 2005, 2015, 2026];
const yTickValues = [0, 2, 4, 6, 8];

const nivoTheme = {
  background: "transparent",
  text: {
    fontFamily: '"Roboto Mono", "SFMono-Regular", Consolas, monospace',
    fontSize: 13,
    fill: "#888888",
  },
  grid: { line: { stroke: "#e0e0e0", strokeWidth: 1 } },
  axis: {
    domain: { line: { stroke: "transparent" } },
    ticks: {
      line: { stroke: "transparent" },
      text: { fill: "#888888", fontSize: 13 },
    },
  },
};

function EndLabel({
  series,
  xScale,
  yScale,
}: LineCustomSvgLayerProps<RateLineSeries>) {
  return (
    <>
      {series.map((s) => {
        const last = s.data.at(-1);
        if (!last) return null;
        return (
          <text
            key={s.id}
            x={(xScale(last.data.x) as number) + 6}
            y={yScale(last.data.y) as number}
            fontSize={11}
            fontWeight={600}
            fill={COLOR_RATE}
            dominantBaseline="middle"
            fontFamily='"Noto Sans JP", "游ゴシック体", sans-serif'
          >
            {SERIES_LABEL}
          </text>
        );
      })}
    </>
  );
}

function TooltipContent({
  point,
}: {
  point: { data: { x: unknown; y: unknown } };
}) {
  const year = point.data.x as number;
  const rate = point.data.y as number;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年</span>
      <span className={styles.tooltipRow}>
        <span
          className={styles.tooltipDot}
          style={{ background: COLOR_RATE }}
        />
        10年国債利回り：
        <strong className={styles.tooltipValue}>
          {rate.toLocaleString("ja-JP", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })}
          %
        </strong>
      </span>
    </div>
  );
}

export function LongTermRateChart() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：%</span>
      <ArticleChartCanvas height={380} mobileHeight={320}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 16, right: 110, bottom: 48, left: 48 }}
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
            format: (v) => `${v}%`,
          }}
          layers={[
            "grid",
            "axes",
            "lines",
            EndLabel,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          colors={[COLOR_RATE]}
          lineWidth={2.5}
          pointSize={0}
          pointBorderWidth={0}
          enableGridX={false}
          gridYValues={yTickValues}
          theme={nivoTheme as Parameters<typeof ResponsiveLine>[0]["theme"]}
          useMesh={true}
          enableCrosshair={true}
          tooltip={({ point }) => <TooltipContent point={point} />}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
