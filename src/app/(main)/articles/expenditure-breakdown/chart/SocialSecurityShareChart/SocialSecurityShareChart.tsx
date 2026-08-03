"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort, createAnnotationLayer } from "@/lib/chart-format";
import expenditureData from "@/data/expenditure-breakdown.json";
import type { LineCustomSvgLayerProps } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./SocialSecurityShareChart.module.css";

// ─── 定数定義 ────────────────────────────────────────────────────
const COLOR_BRAND_DARK = "var(--color-brand-dark)";
const X_MIN = 1967;
const X_MAX = 2024;
const Y_MIN = 0;
const Y_MAX = 35; // 2024年は約29.1%なので35が適正

const rawData = expenditureData;

// 各年度の (socialSecurityOku / totalOku * 100) を計算
const CHART_DATA = [
  {
    id: "社会保障関係費の割合",
    color: COLOR_BRAND_DARK,
    data: rawData.map((d) => ({
      x: d.fiscalYear,
      y: (d.socialSecurityOku / d.totalOku) * 100,
    })),
  },
];

const tickYears = [1967, 1975, 1985, 1995, 2005, 2015, 2024];
const yTickValues = [0, 10, 20, 30, 35];

// 注釈
const ANNOTATIONS = [
  { year: 1973, label: "福祉元年", labelYOffset: -20 },
  { year: 2020, label: "コロナ禍", labelYOffset: -20 },
];

// ─── 右端の系列ラベル ─────────────────────────────────────────────
function EndLabel({ xScale, yScale }: LineCustomSvgLayerProps<any>) {
  const x = ((xScale as any)(X_MAX) as number) + 6;
  const latest = rawData[rawData.length - 1];
  if (!latest) return null;
  const latestVal = (latest.socialSecurityOku / latest.totalOku) * 100;
  const y = (yScale as any)(latestVal) as number;

  return (
    <text
      x={x}
      y={y}
      fontSize={11}
      fontWeight={700}
      fill={COLOR_BRAND_DARK}
      dominantBaseline="middle"
      fontFamily='"Noto Sans JP", sans-serif'
    >
      社会保障費の割合
    </text>
  );
}

export function SocialSecurityShareChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：%</span>
      <ArticleChartCanvas height={360} mobileHeight={280}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 30, right: isMobile ? 110 : 130, bottom: 40, left: 45 }}
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
          colors={[COLOR_BRAND_DARK]}
          lineWidth={3}
          enableGridX={false}
          gridYValues={yTickValues}
          useMesh={true}
          pointSize={0}
          layers={[
            "grid",
            AnnotationLayer,
            "axes",
            "areas",
            "lines",
            EndLabel,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          theme={{
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
          }}
          tooltip={({ point }) => (
            <div className={styles.tooltip}>
              <span className={styles.tooltipYear}>{point.data.x}年度</span>
              <span className={styles.tooltipVal}>
                割合: <strong>{Number(point.data.y).toFixed(1)}%</strong>
              </span>
            </div>
          )}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
