"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import type {
  LineCustomSvgLayerProps,
  LineSeries,
} from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import disposableIncomeData from "@/data/disposable-income.json";
import styles from "./DisposableIncomeRealVsNominalChart.module.css";

// ─── 型定義 ──────────────────────────────────────────────────────
type SeriesId = "nominal" | "real";

type IncomeLineSeries = LineSeries & {
  id: SeriesId;
  data: { x: number; y: number }[];
};

// ─── 定数 ────────────────────────────────────────────────────────
const COLOR_NOMINAL = "#5bbee4"; // Civic Sky
const COLOR_REAL = "#1e7aa8"; // Civic Sky Dark

const colors: Record<SeriesId, string> = {
  nominal: COLOR_NOMINAL,
  real: COLOR_REAL,
};

const labels: Record<SeriesId, string> = {
  nominal: "名目",
  real: "実質（2020年基準）",
};

// ─── データ整形 ───────────────────────────────────────────────────
// 1989年は disposableReal2020 が null のため除外
const filtered = disposableIncomeData.series.filter(
  (d) => d.year >= 1990 && d.disposableReal2020 !== null
);

const CHART_DATA: IncomeLineSeries[] = [
  {
    id: "nominal",
    data: filtered.map((d) => ({
      x: d.year,
      y: Math.round((d.disposable / 10000) * 10) / 10,
    })),
  },
  {
    id: "real",
    data: filtered.map((d) => ({
      x: d.year,
      y: Math.round(((d.disposableReal2020 as number) / 10000) * 10) / 10,
    })),
  },
];

// ─── 軸 tick ─────────────────────────────────────────────────────
const tickYears = [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];
const yTickValues = [35, 40, 45, 50, 55];

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
}: LineCustomSvgLayerProps<IncomeLineSeries>) {
  return (
    <>
      {series.map((s) => {
        const last = s.data.at(-1);
        if (!last) return null;
        const id = s.id as SeriesId;

        // 実質ラベルは長いため2行に分けて表示
        if (id === "real") {
          return (
            <g key={s.id}>
              <text
                x={(xScale(last.data.x) as number) + 6}
                y={(yScale(last.data.y) as number) - 6}
                fontSize={11}
                fontWeight={600}
                fill={colors[id]}
                dominantBaseline="middle"
                fontFamily='"Noto Sans JP", "游ゴシック体", sans-serif'
              >
                実質
              </text>
              <text
                x={(xScale(last.data.x) as number) + 6}
                y={(yScale(last.data.y) as number) + 8}
                fontSize={10}
                fontWeight={600}
                fill={colors[id]}
                dominantBaseline="middle"
                fontFamily='"Noto Sans JP", "游ゴシック体", sans-serif'
              >
                (2020基準)
              </text>
            </g>
          );
        }

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

// ─── メインコンポーネント ─────────────────────────────────────────
export function DisposableIncomeRealVsNominalChart() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.chartNote}>
        <strong>名目値</strong>は、給料明細に書かれている金額そのもの。
        物価が上がったことは考慮しない、ただの「数字」。
      </p>
      <p className={styles.chartNote}>
        <strong>実質値</strong>は、物価の上昇分を差し引いて「実際に何がどれだけ買えるか」で測り直した金額。
        たとえば給料が10万円増えても、その間に物価も10万円分上がっていれば、
        生活水準はまったく変わっていない。
      </p>
      <p className={styles.chartNote}>
        名目が伸びていても実質が伸びていなければ、手取りは増えたように見えても、
        買えるものは増えていない。例えば基準年である2020年の名目と実質はともに49.9万円で、
        2024年には名目は52.3万円、実質は48.2万円となっており、
        給料は2.4万円も増えたが実際に買えるものは1.7万円分も減っている。
      </p>
      <span className={styles.unitNote}>単位：万円（1世帯当たり月平均）</span>
      <ArticleChartCanvas height={380} mobileHeight={300}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 0, right: 88, bottom: 40, left: 52 }}
          xScale={{ type: "linear", min: 1990, max: 2024 }}
          yScale={{ type: "linear", min: 33, max: 58 }}
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
            format: (v) => `${v}万`,
          }}
          layers={[
            "grid",
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
                <span className={styles.tooltipYear}>{year}年</span>
                <span className={styles.tooltipRow}>
                  <span
                    className={styles.tooltipDot}
                    style={{ background: COLOR_NOMINAL }}
                  />
                  名目：
                  <strong className={styles.tooltipNominal}>
                    {nominalY !== null ? nominalY.toFixed(1) : "—"}万円
                  </strong>
                </span>
                <span className={styles.tooltipRow}>
                  <span
                    className={styles.tooltipDot}
                    style={{ background: COLOR_REAL }}
                  />
                  実質：
                  <strong className={styles.tooltipReal}>
                    {realY !== null ? realY.toFixed(1) : "—"}万円
                  </strong>
                </span>
                {nominalY !== null && realY !== null && (
                  <span className={styles.tooltipGap}>
                    ギャップ：
                    {(nominalY - realY).toFixed(1)}万円
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
