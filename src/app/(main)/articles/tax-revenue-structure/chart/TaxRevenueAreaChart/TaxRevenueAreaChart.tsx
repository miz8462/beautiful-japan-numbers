"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort } from "@/lib/chart-format";
import taxRevenueData from "@/data/tax-revenue-by-type.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./TaxRevenueAreaChart.module.css";

// ─── 定数定義 ────────────────────────────────────────────────────
type TaxSeriesId = "other" | "consumption" | "corporate" | "income";

const colors: Record<TaxSeriesId, string> = {
  income: "var(--color-brand)",         // 所得税
  corporate: "var(--color-brand-dark)", // 法人税
  consumption: "var(--color-accent)",   // 消費税 (強調)
  other: "var(--color-brand-second)",   // その他
};

const labels: Record<TaxSeriesId, string> = {
  income: "所得税",
  corporate: "法人税",
  consumption: "消費税",
  other: "その他",
};

const X_MIN = 1979;
const X_MAX = 2024;
const Y_MAX = 80;

type TaxDatum = { x: number; y: number };
type TaxLineSeries = LineSeries & {
  id: TaxSeriesId;
  data: TaxDatum[];
};

const rawData = taxRevenueData;

// 積み上げ順：下から その他 -> 消費税 -> 法人税 -> 所得税
const CHART_DATA: TaxLineSeries[] = [
  {
    id: "other",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.otherOku / 10000 })),
  },
  {
    id: "consumption",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.consumptionTaxOku / 10000 })),
  },
  {
    id: "corporate",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.corporateTaxOku / 10000 })),
  },
  {
    id: "income",
    data: rawData.map((d) => ({ x: d.fiscalYear, y: d.incomeTaxOku / 10000 })),
  },
];

const tickYears = [1979, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];
const yTickValues = [0, 20, 40, 60, 80];

// ─── 注釈（アノテーション） ───────────────────────────────────────
const ANNOTATIONS = [
  { year: 1989, label: "消費税導入 (3%)", labelYOffset: -24 },
  { year: 1997, label: "5%引き上げ", labelYOffset: -8 },
  { year: 2014, label: "8%引き上げ", labelYOffset: -24 },
  { year: 2019, label: "10%引き上げ", labelYOffset: -8 },
];

function AnnotationLayer({
  xScale,
  innerHeight,
}: LineCustomSvgLayerProps<TaxLineSeries>) {
  return (
    <>
      {ANNOTATIONS.map(({ year, label, labelYOffset }) => {
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
              fontSize={11}
              fill="#9ca3af"
              textAnchor="middle"
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

// ─── 右端の系列ラベル ─────────────────────────────────────────────
function EndLabels({ xScale, yScale }: LineCustomSvgLayerProps<TaxLineSeries>) {
  const x = (xScale(X_MAX) as number) + 6;

  // 2024年度の各税額
  const otherVal = 110921 / 10000;
  const consumptionVal = 250212 / 10000;
  const corporateVal = 179102 / 10000;
  const incomeVal = 212086 / 10000;

  // 各面の中央高さを計算
  const otherY = yScale(otherVal / 2) as number;
  const consumptionY = yScale(otherVal + consumptionVal / 2) as number;
  const corporateY = yScale(otherVal + consumptionVal + corporateVal / 2) as number;
  const incomeY = yScale(otherVal + consumptionVal + corporateVal + incomeVal / 2) as number;

  return (
    <>
      <text x={x} y={otherY} fontSize={11} fontWeight={600} fill={colors.other} dominantBaseline="middle" fontFamily='"Noto Sans JP", sans-serif'>
        {labels.other}
      </text>
      <text x={x} y={consumptionY} fontSize={11} fontWeight={600} fill={colors.consumption} dominantBaseline="middle" fontFamily='"Noto Sans JP", sans-serif'>
        {labels.consumption}
      </text>
      <text x={x} y={corporateY} fontSize={11} fontWeight={600} fill={colors.corporate} dominantBaseline="middle" fontFamily='"Noto Sans JP", sans-serif'>
        {labels.corporate}
      </text>
      <text x={x} y={incomeY} fontSize={11} fontWeight={600} fill={colors.income} dominantBaseline="middle" fontFamily='"Noto Sans JP", sans-serif'>
        {labels.income}
      </text>
    </>
  );
}

// ─── ツールチップ ─────────────────────────────────────────────────
function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;
  const row = rawData.find((d) => d.fiscalYear === year);
  if (!row) return null;

  const totalTrillion = row.totalOku / 10000;
  const incomeTrillion = row.incomeTaxOku / 10000;
  const corporateTrillion = row.corporateTaxOku / 10000;
  const consumptionTrillion = row.consumptionTaxOku / 10000;
  const otherTrillion = row.otherOku / 10000;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度</span>
      <div className={styles.tooltipRows}>
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: colors.income }} />
          所得税：
          <strong className={styles.tooltipValue}>
            {incomeTrillion.toFixed(1)}兆円
          </strong>
        </div>
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: colors.corporate }} />
          法人税：
          <strong className={styles.tooltipValue}>
            {corporateTrillion.toFixed(1)}兆円
          </strong>
        </div>
        {year >= 1989 && (
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: colors.consumption }} />
            消費税：
            <strong className={styles.tooltipValue}>
              {consumptionTrillion.toFixed(1)}兆円
            </strong>
          </div>
        )}
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: colors.other }} />
          その他：
          <strong className={styles.tooltipValue}>
            {otherTrillion.toFixed(1)}兆円
          </strong>
        </div>
        <div className={`${styles.tooltipRow} ${styles.tooltipTotal}`}>
          <span className={styles.tooltipDot} style={{ background: "#888888" }} />
          税収合計：
          <strong className={styles.tooltipValue}>
            {totalTrillion.toFixed(1)}兆円
          </strong>
        </div>
      </div>
    </div>
  );
}

export function TaxRevenueAreaChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：兆円</span>
      <ArticleChartCanvas height={420} mobileHeight={360}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: isMobile ? 60 : 75, bottom: 48, left: 48 }}
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
          colors={({ id }) => colors[id as TaxSeriesId]}
          enableArea={true}
          areaOpacity={0.8}
          lineWidth={1.5}
          pointSize={0}
          enableGridX={false}
          gridYValues={yTickValues}
          theme={{
            background: "transparent",
            text: {
              fontFamily: '"Roboto Mono", "SFMono-Regular", Consolas, monospace',
              fontSize: 14,
              fill: "#888888",
            },
            grid: { line: { stroke: "#e0e0e0", strokeWidth: 1 } },
            axis: {
              domain: { line: { stroke: "transparent" } },
              ticks: {
                line: { stroke: "transparent" },
                text: { fill: "#888888", fontSize: 14 },
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
