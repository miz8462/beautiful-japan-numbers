"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort, createAnnotationLayer } from "@/lib/chart-format";
import expenditureData from "@/data/expenditure-breakdown.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./MainExpenditureAreaChart.module.css";

// ─── 定数定義 ────────────────────────────────────────────────────
type ExpenditureSeriesId =
  | "other"
  | "pension"
  | "publicWorks"
  | "defense"
  | "localAllocation"
  | "nationalDebt"
  | "eduScience"
  | "socialSecurity";

const colors: Record<ExpenditureSeriesId, string> = {
  socialSecurity: "var(--color-brand-dark)", // 社会保障関係費 (強調)
  eduScience: "color-mix(in srgb, var(--color-brand) 90%, var(--color-brand-dark) 10%)",
  nationalDebt: "color-mix(in srgb, var(--color-brand) 80%, var(--color-brand-dark) 20%)",
  localAllocation: "color-mix(in srgb, var(--color-brand) 70%, var(--color-brand-dark) 30%)",
  defense: "color-mix(in srgb, var(--color-brand) 60%, var(--color-brand-dark) 40%)",
  publicWorks: "color-mix(in srgb, var(--color-brand) 50%, var(--color-brand-dark) 50%)",
  pension: "color-mix(in srgb, var(--color-brand) 40%, var(--color-brand-dark) 60%)",
  other: "color-mix(in srgb, var(--color-brand) 30%, var(--color-brand-dark) 70%)",
};

const labels: Record<ExpenditureSeriesId, string> = {
  socialSecurity: "社会保障",
  eduScience: "文教・科学",
  nationalDebt: "国債費",
  localAllocation: "地方交付税",
  defense: "防衛",
  publicWorks: "公共事業",
  pension: "恩給",
  other: "その他",
};

const X_MIN = 1967;
const X_MAX = 2024;
const Y_MAX = 150; // 最大歳出が147.5兆円(2020年)なので150にする

type ExpenditureDatum = { x: number; y: number };
type ExpenditureLineSeries = LineSeries & {
  id: ExpenditureSeriesId;
  data: ExpenditureDatum[];
};

const rawData = expenditureData;

// 積み上げ順：下から その他 -> 恩給 -> 公共事業 -> 防衛 -> 地方交付税 -> 国債費 -> 文教・科学 -> 社会保障
const CHART_DATA: ExpenditureLineSeries[] = [
  {
    id: "other",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.otherOku / 10000 })),
  },
  {
    id: "pension",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.pensionOku / 10000 })),
  },
  {
    id: "publicWorks",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.publicWorksOku / 10000 })),
  },
  {
    id: "defense",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.defenseOku / 10000 })),
  },
  {
    id: "localAllocation",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.localAllocationOku / 10000 })),
  },
  {
    id: "nationalDebt",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.nationalDebtOku / 10000 })),
  },
  {
    id: "eduScience",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.eduScienceOku / 10000 })),
  },
  {
    id: "socialSecurity",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.socialSecurityOku / 10000 })),
  },
];

const tickYears = [1967, 1975, 1985, 1995, 2005, 2015, 2024];
const yTickValues = [0, 30, 60, 90, 120, 150];

// 注釈
const ANNOTATIONS = [
  { year: 1973, label: "福祉元年", labelYOffset: -20 },
  { year: 1990, label: "バブル崩壊", labelYOffset: -8 },
  { year: 2020, label: "コロナ禍特例", labelYOffset: -20 },
];

// ─── 右端の系列ラベル ─────────────────────────────────────────────
function EndLabels({ xScale, yScale }: LineCustomSvgLayerProps<ExpenditureLineSeries>) {
  const x = (xScale(X_MAX) as number) + 6;

  // 2024年度の各歳出額
  const latest = rawData[rawData.length - 1];
  if (!latest) return null;

  const vals: Record<ExpenditureSeriesId, number> = {
    other: latest.otherOku / 10000,
    pension: latest.pensionOku / 10000,
    publicWorks: latest.publicWorksOku / 10000,
    defense: latest.defenseOku / 10000,
    localAllocation: latest.localAllocationOku / 10000,
    nationalDebt: latest.nationalDebtOku / 10000,
    eduScience: latest.eduScienceOku / 10000,
    socialSecurity: latest.socialSecurityOku / 10000,
  };

  // 積み上げのY位置（各面の中央）を計算
  let currentSum = 0;
  const yPositions = (Object.keys(vals) as ExpenditureSeriesId[]).map((id) => {
    const val = vals[id];
    const y = yScale(currentSum + val / 2) as number;
    currentSum += val;
    return { id, y, val };
  });

  return (
    <>
      {yPositions.map(({ id, y, val }) => {
        // 金額があまりに小さいものはラベルが重なるので表示を調整（恩給などは非常に小さい）
        if (val < 1.0) return null;
        return (
          <text
            key={id}
            x={x}
            y={y}
            fontSize={10}
            fontWeight={id === "socialSecurity" ? 700 : 500}
            fill={colors[id]}
            dominantBaseline="middle"
            fontFamily='"Noto Sans JP", sans-serif'
          >
            {labels[id]}
          </text>
        );
      })}
    </>
  );
}

// ─── ツールチップ ─────────────────────────────────────────────────
function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;
  const row = rawData.find((d) => d.fiscalYear === year);
  if (!row) return null;

  const totalTrillion = row.totalOku / 10000;

  const items: { id: ExpenditureSeriesId; val: number }[] = [
    { id: "socialSecurity", val: row.socialSecurityOku / 10000 },
    { id: "eduScience", val: row.eduScienceOku / 10000 },
    { id: "nationalDebt", val: row.nationalDebtOku / 10000 },
    { id: "localAllocation", val: row.localAllocationOku / 10000 },
    { id: "defense", val: row.defenseOku / 10000 },
    { id: "publicWorks", val: row.publicWorksOku / 10000 },
    { id: "pension", val: row.pensionOku / 10000 },
    { id: "other", val: row.otherOku / 10000 },
  ];

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度</span>
      <div className={styles.tooltipRows}>
        {items.map(({ id, val }) => (
          <div key={id} className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: colors[id] }} />
            {labels[id]}：
            <strong className={styles.tooltipValue}>
              {val.toFixed(2)}兆円
            </strong>
          </div>
        ))}
        <div className={`${styles.tooltipRow} ${styles.tooltipTotal}`}>
          <span className={styles.tooltipDot} style={{ background: "#888888" }} />
          歳出合計：
          <strong className={styles.tooltipValue}>
            {totalTrillion.toFixed(2)}兆円
          </strong>
        </div>
      </div>
    </div>
  );
}

export function MainExpenditureAreaChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：兆円</span>
      <ArticleChartCanvas height={450} mobileHeight={380}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: isMobile ? 65 : 85, bottom: 48, left: 48 }}
          xScale={{ type: "linear", min: X_MIN, max: X_MAX, nice: false }}
          yScale={{
            type: "linear",
            min: 0,
            max: Y_MAX,
            stacked: true,
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
            format: (v) => (v === 0 ? "0" : `${v}`),
          }}
          layers={[
            "grid",
            AnnotationLayer,
            "axes",
            "areas",
            "lines",
            EndLabels,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          colors={({ id }) => colors[id as ExpenditureSeriesId]}
          enableArea={true}
          areaOpacity={0.85}
          lineWidth={1.2}
          pointSize={0}
          enableGridX={false}
          gridYValues={yTickValues}
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
          useMesh={true}
          enableCrosshair={true}
          tooltip={({ point }) => <TooltipContent point={point} />}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
