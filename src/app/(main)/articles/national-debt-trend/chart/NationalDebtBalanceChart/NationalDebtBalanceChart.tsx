"use client";

import type { ComponentType } from "react";
import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import nationalDebtLongTerm from "@/data/national-debt-long-term.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import { line as d3Line } from "d3-shape";
import { scaleLinear } from "d3-scale";
import styles from "./NationalDebtBalanceChart.module.css";

// ─── 型定義 ──────────────────────────────────────────────────────
type BalanceSeriesId = "balance";

type BalanceLineSeries = LineSeries & {
  id: BalanceSeriesId;
  data: { x: number; y: number }[];
};

type DebtRow = (typeof nationalDebtLongTerm)[number];

// ─── 定数 ────────────────────────────────────────────────────────
const COLOR_BALANCE = "var(--color-brand)";
const COLOR_GDP_RATIO =
  "color-mix(in srgb, var(--color-brand) 42%, white)";

const BALANCE_LABEL = "普通国債残高";
const GDP_RATIO_LABEL = "対GDP比";

const X_MIN = 1965;
const X_MAX = 2026;
const BALANCE_Y_MAX = 1200;
const GDP_RATIO_Y_MAX = 180;

const rawData: DebtRow[] = nationalDebtLongTerm;

const CHART_DATA: BalanceLineSeries[] = [
  {
    id: "balance",
    data: rawData.map((d) => ({
      x: d.year,
      y: Math.round((d.balanceOku / 10000) * 10) / 10,
    })),
  },
];

const tickYears = [1965, 1975, 1985, 1995, 2005, 2015, 2026];
const balanceYTickValues = [0, 200, 400, 600, 800, 1000, 1200];
const gdpRatioYTickValues = [0, 50, 100, 150];

type AnnotationDef = {
  year: number;
  label: string;
  labelYOffset?: number;
};

const ANNOTATIONS: AnnotationDef[] = [
  { year: 1973, label: "第一次石油危機", labelYOffset: 12 },
  { year: 1989, label: "消費税導入", labelYOffset: 28 },
  { year: 1991, label: "バブル崩壊", labelYOffset: 44 },
  { year: 2008, label: "リーマンショック", labelYOffset: 12 },
  { year: 2020, label: "コロナ対応", labelYOffset: 28 },
];

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

function createAnnotationLayer(
  innerHeight: number
): ComponentType<LineCustomSvgLayerProps<BalanceLineSeries>> {
  function AnnotationLayer({
    xScale,
  }: LineCustomSvgLayerProps<BalanceLineSeries>) {
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
                fontSize={10}
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
  AnnotationLayer.displayName = "AnnotationLayer";
  return AnnotationLayer;
}

function GdpRatioLayers({
  xScale,
  innerHeight,
  innerWidth,
}: LineCustomSvgLayerProps<BalanceLineSeries>) {
  const yScaleRight = scaleLinear()
    .domain([0, GDP_RATIO_Y_MAX])
    .range([innerHeight, 0]);

  const gdpPoints = rawData.map((d) => ({
    x: d.year,
    y: d.gdpRatioPercent,
  }));

  const pathD =
    d3Line<{ x: number; y: number }>()
      .x((d) => xScale(d.x) as number)
      .y((d) => yScaleRight(d.y))(gdpPoints) ?? undefined;

  const last = gdpPoints.at(-1);
  const lastX = last ? (xScale(last.x) as number) : 0;
  const lastY = last ? yScaleRight(last.y) : 0;

  return (
    <>
      {pathD && (
        <path
          d={pathD}
          fill="none"
          stroke={COLOR_GDP_RATIO}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {gdpRatioYTickValues.map((tick) => (
        <text
          key={tick}
          x={innerWidth + 8}
          y={yScaleRight(tick)}
          fontSize={16}
          fill="#888888"
          dominantBaseline="middle"
          fontFamily='"Roboto Mono", "SFMono-Regular", Consolas, monospace'
        >
          {tick === 0 ? "0" : `${tick}%`}
        </text>
      ))}
      {last && (
        <text
          x={lastX + 6}
          y={lastY}
          fontSize={11}
          fontWeight={600}
          fill={COLOR_GDP_RATIO}
          dominantBaseline="middle"
          fontFamily='"Noto Sans JP", "游ゴシック体", sans-serif'
        >
          {GDP_RATIO_LABEL}
        </text>
      )}
    </>
  );
}

function BalanceEndLabel({
  series,
  xScale,
  yScale,
}: LineCustomSvgLayerProps<BalanceLineSeries>) {
  return (
    <>
      {series.map((s) => {
        const last = s.data.at(-1);
        if (!last) return null;
        return (
          <text
            key={s.id}
            x={(xScale(last.data.x) as number) + 6}
            y={(yScale(last.data.y) as number) - 10}
            fontSize={11}
            fontWeight={600}
            fill={COLOR_BALANCE}
            dominantBaseline="middle"
            fontFamily='"Noto Sans JP", "游ゴシック体", sans-serif'
          >
            {BALANCE_LABEL}
          </text>
        );
      })}
    </>
  );
}

function TooltipContent({
  point,
}: {
  point: { data: { x: unknown; y: unknown } };
}) {
  const year = point.data.x as number;
  const balanceTrillion = point.data.y as number;
  const row = rawData.find((d) => d.year === year);

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度</span>
      <span className={styles.tooltipRow}>
        <span
          className={styles.tooltipDot}
          style={{ background: COLOR_BALANCE }}
        />
        普通国債残高：
        <strong className={styles.tooltipValue}>
          {balanceTrillion.toLocaleString("ja-JP", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          })}
          兆円
        </strong>
      </span>
      {row && (
        <span className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: COLOR_GDP_RATIO }}
          />
          対GDP比：
          <strong className={styles.tooltipValue}>
            {row.gdpRatioPercent.toLocaleString("ja-JP", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
            %
          </strong>
        </span>
      )}
    </div>
  );
}

export function NationalDebtBalanceChart() {
  const annotationLayer = createAnnotationLayer(320);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>
        左軸：兆円　右軸：対GDP比（%）
      </span>
      <ArticleChartCanvas height={420} mobileHeight={360}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 52, right: 72, bottom: 48, left: 56 }}
          xScale={{ type: "linear", min: X_MIN, max: X_MAX, nice: false }}
          yScale={{
            type: "linear",
            min: 0,
            max: BALANCE_Y_MAX,
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
            tickValues: balanceYTickValues,
            format: (v) =>
              v === 0 ? "0" : `${(v as number).toLocaleString("ja-JP")}`,
          }}
          layers={[
            "grid",
            annotationLayer,
            GdpRatioLayers,
            "axes",
            "lines",
            BalanceEndLabel,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          colors={[COLOR_BALANCE]}
          lineWidth={2.5}
          pointSize={0}
          pointBorderWidth={0}
          enableGridX={false}
          gridYValues={balanceYTickValues}
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
