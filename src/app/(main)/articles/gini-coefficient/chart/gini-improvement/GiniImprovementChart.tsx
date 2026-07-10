"use client";

import dynamic from "next/dynamic";
import { ArticleChartCanvas } from "@/components/article/article-chart";
import giniData from "@/data/gini-japan.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import styles from "./GiniImprovementChart.module.css";
import { ArticleIntro } from "@/components/article/article-intro/ArticleIntro";
import { ChartIntro } from "@/components/article/article-chart/chart-intro/ChartIntro";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((mod) => mod.ResponsiveLine),
  { ssr: false }
);

// ─── 型定義 ──────────────────────────────────────────────────────
type SeriesId = "improvement";

type GiniImprovementSeries = LineSeries & {
  id: SeriesId;
  data: { x: string; y: number }[];
};

// ─── 定数 ────────────────────────────────────────────────────────
const COLOR_IMPROVEMENT = "#5bbee4"; // Civic Sky

const colors: Record<SeriesId, string> = {
  improvement: COLOR_IMPROVEMENT,
};

// ─── データ整形 ───────────────────────────────────────────────────
const CHART_DATA: GiniImprovementSeries[] = [
  {
    id: "improvement",
    data: giniData.series.map((d) => ({
      x: String(d.year),
      y: d.improvementRate,
    })),
  },
];

// ─── 軸 tick ─────────────────────────────────────────────────────
const yTickValues = [0, 10, 20, 30, 40];
const tickYears = ["1962", "1972", "1981", "1990", "1999", "2008", "2017", "2023"];

// ─── Nivo テーマ ──────────────────────────────────────────────────
const nivoTheme = {
  background: "transparent",
  text: {
    fontFamily: '"Roboto Mono", "SFMono-Regular", Consolas, monospace',
    fontSize: 11,
    fill: "#888888",
  },
  grid: { line: { stroke: "#e0e0e0", strokeWidth: 1 } },
  axis: {
    domain: { line: { stroke: "transparent" } },
    ticks: {
      line: { stroke: "transparent" },
      text: { fill: "#888888", fontSize: 11 },
    },
  },
};

// ─── カスタムレイヤー: エンドポイントインラインラベル ─────────────────
function EndLabels({
  series,
  xScale,
  yScale,
}: any) {
  return (
    <>
      {series.map((s: any) => {
        const last = s.data.at(-1);
        if (!last) return null;

        const xPos = xScale(last.data.x) as number;

        return (
          <text
            key={s.id}
            x={xPos + 6}
            y={yScale(last.data.y) as number}
            fontSize={11}
            fontWeight={600}
            fill={COLOR_IMPROVEMENT}
            dominantBaseline="middle"
            fontFamily='"Noto Sans JP", "游ゴシック体", sans-serif'
          >
            改善度
          </text>
        );
      })}
    </>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────────
export function GiniImprovementChart() {
  return (
    <div className={styles.wrapper}>
      <ChartIntro>
        <p>
          改善度とは、税金と社会保障の仕組みが、格差をどれだけ縮めたかを表したものです。<br />
          改善度(%) = (当初所得のジニ係数 − 再分配所得のジニ係数) ÷ 当初所得のジニ係数 × 100 <br />
          たとえば当初所得のジニ係数が0.50、再分配所得のジニ係数が0.35なら、改善度は(0.50−0.35)÷0.50×100=30% <br />
          税金と社会保障によって、格差が30%縮小したことを意味します。
          数字が大きいほど、再分配の仕組みが強く効いていることになります。
        </p>
      </ChartIntro>
      <ArticleChartCanvas height={400} mobileHeight={320}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 20, right: 60, bottom: 40, left: 50 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0, max: 40, nice: false }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: tickYears,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: yTickValues,
            format: (v) => `${v}%`,
          }}
          layers={["grid", "axes", "lines", EndLabels as any, "mesh"]}
          colors={[COLOR_IMPROVEMENT]}
          lineWidth={2.5}
          pointSize={0}
          pointBorderWidth={0}
          enableGridX={false}
          gridYValues={yTickValues}
          theme={nivoTheme as any}
          useMesh={true}
          tooltip={({ point }) => {
            const year = point.data.x as string;
            const rate = Number(point.data.y);

            return (
              <div className={styles.tooltip}>
                <span className={styles.tooltipYear}>{year}年度</span>
                <span className={styles.tooltipRow}>
                  <span
                    className={styles.tooltipDot}
                    style={{ background: COLOR_IMPROVEMENT }}
                  />
                  改善度：
                  <strong className={styles.tooltipValue}>
                    {rate.toFixed(1)}%
                  </strong>
                </span>
              </div>
            );
          }}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
