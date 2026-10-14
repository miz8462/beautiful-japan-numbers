"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import bankruptcyLongTerm from "@/data/bankruptcy-long-term.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./BankruptcyTrendChart.module.css";

// ─── 型定義 ──────────────────────────────────────────────────────
type BankruptcyPoint = { x: number; y: number };

type BankruptcyLineSeries = LineSeries & {
  id: "count";
  data: BankruptcyPoint[];
};

// ─── 定数 ────────────────────────────────────────────────────────
const COLOR_COUNT = "var(--color-brand)"; // Civic Sky #5bbee4

// ─── データ整形 ───────────────────────────────────────────────────
// 将来的に debtMillionYen を2軸目や別チャートで使う可能性を考慮し、
// rawData 全体は保持しつつ、グラフ用データには count のみを使う
const rawData = bankruptcyLongTerm;

const CHART_DATA: BankruptcyLineSeries[] = [
  {
    id: "count",
    data: rawData.map((d) => ({ x: d.year, y: d.count })),
  },
];

// ─── 軸 tick ─────────────────────────────────────────────────────
const tickYears = [1952, 1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025];
const yTickValues = [0, 5000, 10000, 15000, 20000];

// ─── Nivo テーマ ──────────────────────────────────────────────────
const nivoTheme = {
  background: "transparent",
  text: {
    fontFamily: '"Roboto Mono", "SFMono-Regular", Consolas, monospace',
    fontSize: 16,
    fill: "#888888",
  },
  grid: { line: { stroke: "#e0e0e0", strokeWidth: 1 } },
  axis: {
    domain: { line: { stroke: "transparent" } },
    ticks: {
      line: { stroke: "transparent" },
      text: { fill: "#888888", fontSize: 16 },
    },
  },
};

// ─── 注釈の定義 ───────────────────────────────────────────────────
type AnnotationDef = {
  year: number;
  label: string;
  labelYOffset?: number;
};

const ANNOTATIONS: AnnotationDef[] = [
  { year: 1974, label: "オイルショック",  labelYOffset: -8 },
  { year: 1991, label: "バブル崩壊",  labelYOffset: -8 },
  { year: 2008, label: "リーマンショック", labelYOffset: -8 },
  { year: 2021, label: "コロナ禍最少",  labelYOffset: -8 },
];

// ─── カスタムレイヤー: 注釈 ─────────────────────────────────────────
function createAnnotationLayer(
  innerHeight: number
): React.ComponentType<LineCustomSvgLayerProps<BankruptcyLineSeries>> {
  function AnnotationLayer({
    xScale,
  }: LineCustomSvgLayerProps<BankruptcyLineSeries>) {
    return (
      <>
        {ANNOTATIONS.map(({ year, label, labelYOffset = 0 }) => {
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
                fontSize={9}
                fill="#9ca3af"
                textAnchor="middle"
              >
                {label}
              </text>
            </g>
          );
        })}
      </>
    );
  }
  AnnotationLayer.displayName = "AnnotationLayer";
  return AnnotationLayer;
}

// ─── ツールチップ ─────────────────────────────────────────────────
function TooltipContent({ point }: { point: { data: { x: unknown; y: unknown } } }) {
  const year = point.data.x as number;
  const count = point.data.y as number;
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年</span>
      <span className={styles.tooltipRow}>
        <span className={styles.tooltipDot} style={{ background: COLOR_COUNT }} />
        倒産件数：
        <strong className={styles.tooltipValue}>
          {count.toLocaleString("ja-JP")}件
        </strong>
      </span>
    </div>
  );
}

// ─── メインコンポーネント ─────────────────────────────────────────
type Props = {
  /** 将来的に2軸目・別チャートで使う可能性のある負債総額データ（今回は非表示） */
  showDebt?: boolean;
};

export function BankruptcyTrendChart({ showDebt: _showDebt = false }: Props) {
  const annotationLayer = createAnnotationLayer(280);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：件</span>
      <ArticleChartCanvas height={380} mobileHeight={320}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 16, right: 48, bottom: 48, left: 56 }}
          xScale={{ type: "linear", min: 1952, max: 2025, nice: false }}
          yScale={{ type: "linear", min: 0, max: 22000, nice: false }}
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
            format: (v) => (v === 0 ? "0" : `${(v / 10000).toFixed(1)}万`),
          }}
          layers={[
            "grid",
            annotationLayer,
            "axes",
            "lines",
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          colors={[COLOR_COUNT]}
          lineWidth={2}
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
