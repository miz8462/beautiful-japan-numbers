"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort } from "@/lib/chart-format";
import landPriceData from "@/data/land-price.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./LandPriceChart.module.css";

type LandPriceDatum = { x: number; y: number };
type LandPriceLineSeries = LineSeries & {
  id: string;
  data: LandPriceDatum[];
};

const nationwideData = landPriceData.nationwide;
const threeMajorMetroData = landPriceData.threeMajorMetroAreas;

const CHART_DATA: LandPriceLineSeries[] = [
  {
    id: "nationwide",
    data: nationwideData.map((d) => ({ x: d.year, y: d.changePct })),
  },
  {
    id: "threeMajorMetro",
    data: threeMajorMetroData.map((d) => ({ x: d.year, y: d.changePct })),
  },
];

const X_MIN = 1975;
const X_MAX = 2026;
const Y_MAX = 50;
const Y_MIN = -20;

const tickYears = [1975, 1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024];
const yTickValues = [-20, -10, 0, 10, 20, 30, 40, 50];

const colors: Record<string, string> = {
  nationwide: "var(--color-brand)",
  threeMajorMetro: "var(--color-brand-dark)",
};

const labels: Record<string, string> = {
  nationwide: "全国平均",
  threeMajorMetro: "三大都市圏",
};

// Annotations for key events
const ANNOTATIONS = [
  { year: 1988, label: "バブル期ピーク", labelYOffset: -20 },
  { year: 1992, label: "バブル崩壊", labelYOffset: 20 },
];

function AnnotationLayer({
  xScale,
  innerHeight,
}: LineCustomSvgLayerProps<LandPriceLineSeries>) {
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
              fontSize={14}
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

// Series labels on the right
function SeriesLabels({ xScale, yScale }: LineCustomSvgLayerProps<LandPriceLineSeries>) {
  const x = (xScale(X_MAX) as number) + 6;

  // 2024 values
  const nationwideVal = nationwideData[nationwideData.length - 1].changePct;
  const threeMajorMetroVal = threeMajorMetroData[threeMajorMetroData.length - 1].changePct;

  const nationwideY = yScale(nationwideVal) as number;
  const threeMajorMetroY = yScale(threeMajorMetroVal) as number;

  return (
    <>
      <text x={x} y={nationwideY + 5} fontSize={14} fontWeight={600} fill={colors.nationwide} dominantBaseline="middle" fontFamily='"Noto Sans JP", sans-serif'>
        {labels.nationwide}
      </text>
      <text x={x} y={threeMajorMetroY - 5} fontSize={14} fontWeight={600} fill={colors.threeMajorMetro} dominantBaseline="middle" fontFamily='"Noto Sans JP", sans-serif'>
        {labels.threeMajorMetro}
      </text>
    </>
  );
}

// Tooltip
function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;

  const nationwideRow = nationwideData.find((d) => d.year === year);
  const threeMajorMetroRow = threeMajorMetroData.find((d) => d.year === year);

  if (!nationwideRow || !threeMajorMetroRow) return null;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年</span>
      <div className={styles.tooltipRows}>
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: colors.nationwide }} />
          全国平均：
          <strong className={styles.tooltipValue}>
            {nationwideRow.changePct > 0 ? "+" : ""}{nationwideRow.changePct.toFixed(1)}%
          </strong>
        </div>
        <div className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: colors.threeMajorMetro }} />
          三大都市圏：
          <strong className={styles.tooltipValue}>
            {threeMajorMetroRow.changePct > 0 ? "+" : ""}{threeMajorMetroRow.changePct.toFixed(1)}%
          </strong>
        </div>
      </div>
    </div>
  );
}

export function LandPriceChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：％（対前年比）</span>
      <ArticleChartCanvas height={420} mobileHeight={360}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: isMobile ? 60 : 80, bottom: 48, left: 48 }}
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
            format: (v) => `${v > 0 ? "+" : ""}${v}%`,
          }}
          colors={({ id }) => colors[id]}
          enableArea={false}
          lineWidth={2}
          pointSize={0}
          enableGridX={false}
          gridYValues={yTickValues}
          useMesh={true}
          enableCrosshair={true}
          crosshairType="x"
          tooltip={({ point }) => <TooltipContent point={point} />}
          layers={[
            "grid",
            AnnotationLayer,
            "axes",
            "areas",
            "lines",
            SeriesLabels,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-data)",
              fontSize: 14,
              fill: "var(--color-text-secondary)",
            },
            grid: { line: { stroke: "var(--color-border)", strokeWidth: 1, strokeDasharray: "4 4" } },
            axis: {
              domain: { line: { stroke: "transparent" } },
              ticks: {
                line: { stroke: "transparent" },
                text: { fill: "var(--color-text-secondary)", fontSize: 12 },
              },
            },
          }}
        />
      </ArticleChartCanvas>
    </div>
  );
}
