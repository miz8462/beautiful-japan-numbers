"use client";

import dynamic from "next/dynamic";
import { ArticleChartCanvas } from "@/components/article/article-chart";
import giniData from "@/data/gini-japan.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import styles from "./GiniTrendChart.module.css";
import { ArticleIntro } from "@/components/article/article-intro/ArticleIntro";
import { ChartIntro } from "@/components/article/article-chart/chart-intro/ChartIntro";

const ResponsiveLine = dynamic(
  () => import("@nivo/line").then((mod) => mod.ResponsiveLine),
  { ssr: false }
);

// ─── 型定義 ──────────────────────────────────────────────────────
type SeriesId = "initial" | "redistributed";

type GiniLineSeries = LineSeries & {
  id: SeriesId;
  data: { x: string; y: number }[];
};

// ─── 定数 ────────────────────────────────────────────────────────
const COLOR_INITIAL = "#1e7aa8"; // Civic Sky Dark
const COLOR_REDISTRIBUTED = "#5bbee4"; // Civic Sky

const colors: Record<SeriesId, string> = {
  initial: COLOR_INITIAL,
  redistributed: COLOR_REDISTRIBUTED,
};

const labels: Record<SeriesId, string> = {
  initial: "当初所得",
  redistributed: "再分配所得",
};

// ─── データ整形 ───────────────────────────────────────────────────
const CHART_DATA: GiniLineSeries[] = [
  {
    id: "initial",
    data: giniData.series.map((d) => ({
      x: String(d.year),
      y: d.initialIncomeGini,
    })),
  },
  {
    id: "redistributed",
    data: giniData.series.map((d) => ({
      x: String(d.year),
      y: d.redistributedIncomeGini,
    })),
  },
];

// ─── 軸 tick ─────────────────────────────────────────────────────
const yTickValues = [0.3, 0.4, 0.5, 0.6];
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
        const id = s.id as SeriesId;

        const xPos = xScale(last.data.x) as number;

        return (
          <text
            key={s.id}
            x={xPos + 6}
            y={yScale(last.data.y) as number}
            fontSize={11}
            fontWeight={600}
            fill={colors[id]}
            dominantBaseline="middle"
            fontFamily='"Noto Sans JP", "游ゴシック体", sans-serif'
          >
            {labels[id]}
          </text>
        );
      })}
    </>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────────
export function GiniTrendChart() {
  return (
    <div className={styles.wrapper}>
      <ChartIntro>
        <p>
          当初所得とは、税金や社会保険料を払う前の、給料や事業の儲けなど「働いて得たお金」の合計です。
          年金や医療費補助といった社会保障からの給付は含まれていません。
        </p>
        <p>
          再分配所得とは、当初所得から税金・社会保険料を差し引き、そこに年金・医療・介護・保育などの給付を加えたものです
        </p>
      </ChartIntro>

      <ArticleChartCanvas height={400} mobileHeight={320}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 20, right: 88, bottom: 40, left: 50 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: 0.3, max: 0.6, nice: false }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: tickYears,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: yTickValues,
            format: (v) => v.toFixed(1),
          }}
          layers={["grid", "axes", "lines", EndLabels as any, "mesh"]}
          colors={({ id }) => colors[id as SeriesId]}
          lineWidth={2.5}
          pointSize={0}
          pointBorderWidth={0}
          enableGridX={false}
          gridYValues={yTickValues}
          theme={nivoTheme as any}
          useMesh={true}
          tooltip={({ point }) => {
            const year = point.data.x as string;

            const initialPoint = CHART_DATA[0].data.find((d) => d.x === year);
            const redistPoint = CHART_DATA[1].data.find((d) => d.x === year);

            const initialY = initialPoint ? Number(initialPoint.y) : null;
            const redistY = redistPoint ? Number(redistPoint.y) : null;

            return (
              <div className={styles.tooltip}>
                <span className={styles.tooltipYear}>{year}年度</span>
                <span className={styles.tooltipRow}>
                  <span
                    className={styles.tooltipDot}
                    style={{ background: COLOR_INITIAL }}
                  />
                  当初所得：
                  <strong className={styles.tooltipValue}>
                    {initialY !== null ? initialY.toFixed(4) : "—"}
                  </strong>
                </span>
                <span className={styles.tooltipRow}>
                  <span
                    className={styles.tooltipDot}
                    style={{ background: COLOR_REDISTRIBUTED }}
                  />
                  再分配所得：
                  <strong className={styles.tooltipValue}>
                    {redistY !== null ? redistY.toFixed(4) : "—"}
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
