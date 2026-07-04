"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import disposableIncomeData from "@/data/disposable-income.json";
import styles from "./NonConsumptionBurdenRateChart.module.css";

// ─── 型定義 ──────────────────────────────────────────────────────
type SeriesId = "burdenRate";

type BurdenLineSeries = LineSeries & {
  id: SeriesId;
  data: { x: number; y: number }[];
};

// ─── 定数 ────────────────────────────────────────────────────────
const COLOR = "#c0392b"; // 警告レッド

// ─── データ整形 ───────────────────────────────────────────────────
// 負担率(%) = nonConsumption / income * 100
// 全年度（1989〜2024）を使用
const CHART_DATA: BurdenLineSeries[] = [
  {
    id: "burdenRate",
    data: disposableIncomeData.series.map((d) => ({
      x: d.year,
      y: Math.round((d.nonConsumption / d.income) * 1000) / 10, // 小数1桁
    })),
  },
];

// ─── アノテーション ───────────────────────────────────────────────
const annotations = [
  { year: 2014, label: "消費税 5→8%", labelY: 14 },
  { year: 2019, label: "消費税 8→10%", labelY: 28 },
];

// ─── 軸 tick ─────────────────────────────────────────────────────
const tickYears = [1989, 1995, 2000, 2005, 2010, 2015, 2020, 2024];
const yTickValues = [12, 14, 16, 18, 20, 22];

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

// ─── カスタムレイヤー: アノテーション ───────────────────────────────
function AnnotationLayer({
  xScale,
  innerHeight,
}: LineCustomSvgLayerProps<BurdenLineSeries>) {
  return (
    <>
      {annotations.map(({ year, label, labelY }) => {
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
              opacity={0.7}
            />
            <text
              x={x + 4}
              y={labelY}
              fontSize={10}
              fill="#9ca3af"
              textAnchor="start"
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

// ─── カスタムレイヤー: エンドポイントインラインラベル ─────────────────
function EndLabel({
  series,
  xScale,
  yScale,
}: LineCustomSvgLayerProps<BurdenLineSeries>) {
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
            fill={COLOR}
            dominantBaseline="middle"
            fontFamily='"Noto Sans JP", "游ゴシック体", sans-serif'
          >
            負担率
          </text>
        );
      })}
    </>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────────
export function NonConsumptionBurdenRateChart() {
  return (
    <div className={styles.wrapper}>
      <ArticleChartCanvas height={340} mobileHeight={280}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: 72, bottom: 40, left: 52 }}
          xScale={{ type: "linear", min: 1989, max: 2024, nice: false }}
          yScale={{ type: "linear", min: 11, max: 23 }}
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
            AnnotationLayer,
            "axes",
            "lines",
            EndLabel,
            "mesh",
          ]}
          colors={[COLOR]}
          lineWidth={2.5}
          pointSize={0}
          pointBorderWidth={0}
          enableGridX={false}
          gridYValues={yTickValues}
          theme={nivoTheme as Parameters<typeof ResponsiveLine>[0]["theme"]}
          useMesh={true}
          tooltip={({ point }) => {
            const year = point.data.x as number;
            const val = Number(point.data.y);
            return (
              <div className={styles.tooltip}>
                <span className={styles.tooltipYear}>{year}年</span>
                <span className={styles.tooltipVal}>
                  非消費支出負担率：
                  <strong>{val.toFixed(1)}%</strong>
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
