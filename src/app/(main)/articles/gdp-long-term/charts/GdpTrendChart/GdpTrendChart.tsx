"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import gdpData from "@/data/gdp-1980-2024.json";
import type {
  LineCustomSvgLayerProps,
  LineSeries,
} from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./GdpTrendChart.module.css";

// ─── 型定義 ──────────────────────────────────────────────────────
type SeriesId = "nominal" | "real";

type GdpLineSeries = LineSeries & {
  id: SeriesId;
  data: { x: number; y: number }[];
};

// ─── 定数 ────────────────────────────────────────────────────────
const COLOR_NOMINAL = "#1e7aa8"; // Civic Sky Dark
const COLOR_REAL = "#5bbee4"; // Civic Sky

const colors: Record<SeriesId, string> = {
  nominal: COLOR_NOMINAL,
  real: COLOR_REAL,
};

const labels: Record<SeriesId, string> = {
  nominal: "名目GDP",
  real: "実質GDP",
};

// ─── データ整形 ───────────────────────────────────────────────────
// 1980年度以降を使用
const filtered = gdpData.data.filter((d) => d.year >= 1980);

const CHART_DATA: GdpLineSeries[] = [
  {
    id: "nominal",
    data: filtered.map((d) => ({
      x: d.year,
      y: Math.round((d.nominalGdp / 1000) * 10) / 10, // 兆円に変換
    })),
  },
  {
    id: "real",
    data: filtered.map((d) => ({
      x: d.year,
      y: Math.round((d.realGdp / 1000) * 10) / 10, // 兆円に変換
    })),
  },
];

// ─── 軸 tick ─────────────────────────────────────────────────────
const tickYears = [1980, 1990, 2000, 2010, 2020, 2024];
const yTickValues = [250, 300, 350, 400, 450, 500, 550, 600, 650];

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
}: LineCustomSvgLayerProps<GdpLineSeries>) {
  return (
    <>
      {series.map((s) => {
        const last = s.data.at(-1);
        if (!last) return null;
        const id = s.id as SeriesId;

        return (
          <text
            key={s.id}
            x={(xScale(last.data.x) as number) + 6}
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

// ─── カスタムレイヤー: 注釈 ─────────────────────────────────────────
function AnnotationLayer({
  xScale,
  innerHeight,
}: LineCustomSvgLayerProps<GdpLineSeries>) {
  const annotations = [
    { year: 1980, label: "1980年度\n（開始）", color: "#9ca3af", labelY: innerHeight - 20 },
    { year: 1994, label: "1994年度\n（基準改定）", color: "#9ca3af", labelY: innerHeight - 20 },
    { year: 2020, label: "2020年度\n（物価上昇・円安）", color: "#f06449", labelY: innerHeight - 20 },
  ];

  return (
    <>
      {annotations.map(({ year, label, color, labelY }) => {
        const x = xScale(year);

        return (
          <g key={year}>
            <line
              x1={x}
              x2={x}
              y1={0}
              y2={innerHeight}
              stroke={color}
              strokeDasharray="4 3"
              opacity={0.6}
            />
            <text
              x={x + 4}
              y={labelY}
              fontSize={10}
              fill={color}
              textAnchor="start"
            >
              {label}
            </text>
          </g>
        );
      })}
    </>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────────
export function GdpTrendChart() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：兆円</span>
      <ArticleChartCanvas height={400} mobileHeight={360}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 34, right: 88, bottom: 50, left: 60 }}
          xScale={{ type: "linear", min: 1980, max: 2024 }}
          yScale={{ type: "linear", min: 240, max: 660 }}
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
          layers={[
            "grid",
            AnnotationLayer,
            "axes",
            "lines",
            EndLabels,
            "mesh",
          ]}
          colors={({ id }) => colors[id as SeriesId]}
          lineWidth={2.5}
          pointSize={0}
          pointBorderWidth={0}
          enableGridX={false}
          gridYValues={yTickValues}
          theme={nivoTheme as Parameters<typeof ResponsiveLine>[0]["theme"]}
          useMesh={true}
          tooltip={({ point }) => {
            const year = point.data.x as number;

            // ホバー中の年の両系列の値を取得
            const nominalPoint = CHART_DATA[0].data.find((d) => d.x === year);
            const realPoint = CHART_DATA[1].data.find((d) => d.x === year);

            const nominalY = nominalPoint ? Number(nominalPoint.y) : null;
            const realY = realPoint ? Number(realPoint.y) : null;

            return (
              <div className={styles.tooltip}>
                <span className={styles.tooltipYear}>{year}年度</span>
                <span className={styles.tooltipRow}>
                  <span
                    className={styles.tooltipDot}
                    style={{ background: COLOR_NOMINAL }}
                  />
                  名目：
                  <strong className={styles.tooltipNominal}>
                    {nominalY !== null ? nominalY.toFixed(1) : "—"}兆円
                  </strong>
                </span>
                <span className={styles.tooltipRow}>
                  <span
                    className={styles.tooltipDot}
                    style={{ background: COLOR_REAL }}
                  />
                  実質：
                  <strong className={styles.tooltipReal}>
                    {realY !== null ? realY.toFixed(1) : "—"}兆円
                  </strong>
                </span>
                {nominalY !== null && realY !== null && (
                  <span className={styles.tooltipGap}>
                    ギャップ：
                    {(nominalY - realY).toFixed(1)}兆円
                  </span>
                )}
              </div>
            );
          }}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
