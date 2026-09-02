"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import ghgDataRaw from "@/data/ghg-emissions.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createAnnotationLayer, formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./PerCapitaEmissionsChart.module.css";

const COLOR = "var(--color-brand, #5bbee4)";
const SERIES_LABEL = "一人当たり排出量";

const years = ghgDataRaw.per_capita.years;
const perCapitaVals = ghgDataRaw.per_capita.ghg_per_capita_t;
const populations = ghgDataRaw.per_capita.population_thousand;

const CHART_DATA = [
  {
    id: "perCapita",
    data: years.map((year, idx) => ({
      x: year,
      y: Number(perCapitaVals[idx].toFixed(2)),
    })),
  },
];

const X_MIN = 1990;
const X_MAX = 2024;
const Y_MIN = 6;
const Y_MAX = 13;

const tickYears = [1990, 1996, 2000, 2005, 2010, 2013, 2015, 2020, 2024];
const yTickValues = [6, 8, 10, 12];

const ANNOTATIONS = [
  {
    year: 1996,
    label: "ピーク 11.00t（▲23.2%）",
    labelYOffset: -12,
  },
];

function SeriesEndLabel({ xScale, yScale }: LineCustomSvgLayerProps<any>) {
  const lastYear = years[years.length - 1];
  const lastVal = perCapitaVals[perCapitaVals.length - 1];
  const x = ((xScale as any)(lastYear) as number) + 6;
  const y = (yScale as any)(lastVal) as number;

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
  const idx = years.indexOf(year);
  if (idx === -1) return null;
  const val = perCapitaVals[idx];
  const pop = populations[idx];

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度</span>
      <div className={styles.tooltipRows}>
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: COLOR }} />
          <span>一人当たり：</span>
          <strong className={styles.tooltipValue}>{val.toFixed(2)} t-CO2/人</strong>
        </div>
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: "#9ca3af" }} />
          <span>参考 人口：</span>
          <span className={styles.tooltipValue}>{(pop / 10).toFixed(0)} 万人</span>
        </div>
      </div>
    </div>
  );
}

export function PerCapitaEmissionsChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：t-CO2換算/人</span>
      <ArticleChartCanvas height={380} mobileHeight={300}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 32, right: isMobile ? 70 : 130, bottom: 48, left: 48 }}
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
            format: (v) => `${v}`,
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
