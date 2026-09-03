"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort, createAnnotationLayer } from "@/lib/chart-format";
import socialSecurityData from "@/data/social-security-expenditure.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./SocialSecurityTrend.module.css";

// ─── 定数定義 ────────────────────────────────────────────────────
type SeriesId = "pension" | "medical" | "welfare";

const colors: Record<SeriesId, string> = {
  pension: "#5bbee4", // 年金 (メイン)
  medical: "color-mix(in srgb, #5bbee4 70%, #1e7aa8)", // 医療 (サブ対比)
  welfare: "#e67e22", // 福祉・介護 (強調)
};

const labels: Record<SeriesId, string> = {
  pension: "年金",
  medical: "医療",
  welfare: "福祉・介護",
};

const X_MIN = 1990;
const X_MAX = 2023;
const Y_MAX = 140; // 総額最大が135.5兆円(2023年度)なので140にする

type SocialSecurityDatum = { x: number; y: number };
type SocialSecurityLineSeries = LineSeries & {
  id: SeriesId;
  data: SocialSecurityDatum[];
};

const rawData = socialSecurityData.trend;

// 積み上げ順：下から 年金 -> 医療 -> 福祉・介護
const CHART_DATA: SocialSecurityLineSeries[] = [
  {
    id: "pension",
    data: rawData.map((d) => ({ x: Number(d.year), y: d.pension })),
  },
  {
    id: "medical",
    data: rawData.map((d) => ({ x: Number(d.year), y: d.medical })),
  },
  {
    id: "welfare",
    data: rawData.map((d) => ({ x: Number(d.year), y: d.welfare })),
  },
];

const tickYears = [1990,  2000,  2010,  2020,  2023];
const yTickValues = [0,  30,  60,  90,  120,  140];

// 注釈
const ANNOTATIONS = [
  { year:  1990, label: "基準年", labelYOffset: -8 },
  { year:  2000, label: "介護保険導入", labelYOffset: -20 },
  { year:  2020, label: "コロナ禍", labelYOffset: -8 },
];

// ─── 右端の系列ラベル ─────────────────────────────────────────────
function EndLabels({ xScale, yScale }: LineCustomSvgLayerProps<SocialSecurityLineSeries>) {
  const x = (xScale(X_MAX) as number) + 6;

  // 2023年度の各給付額
  const latest = rawData[rawData.length - 1];
  if (!latest) return null;

  const vals: Record<SeriesId, number> = {
    pension: latest.pension,
    medical: latest.medical,
    welfare: latest.welfare,
  };

  // 積み上げのY位置（各面の中央）を計算
  let currentSum = 0;
  const yPositions = (Object.keys(vals) as SeriesId[]).map((id) => {
    const val = vals[id];
    const y = yScale(currentSum + val / 2) as number;
    currentSum += val;
    return { id, y, val };
  });

  return (
    <>
      {yPositions.map(({ id, y }) => {
        return (
          <text
            key={id}
            x={x}
            y={y}
            fontSize={11}
            fontWeight={700}
            fill={colors[id as SeriesId]}
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
  const row = rawData.find((d) => Number(d.year) === year);
  if (!row) return null;

  const items: { id: SeriesId; val: number }[] = [
    { id: "pension", val: row.pension },
    { id: "medical", val: row.medical },
    { id: "welfare", val: row.welfare },
  ];

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度</span>
      <div className={styles.tooltipRows}>
        {items.map(({ id, val }) => (
          <div key={id} className={styles.tooltipRow}>
            <span className={styles.tooltipDot} style={{ background: colors[id] }} />
            {labels[id]}：
            <strong className={styles.tooltipValue}>{val.toFixed(1)}兆円</strong>
          </div>
        ))}
        <div className={`${styles.tooltipRow} ${styles.tooltipTotal}`}>
          <span className={styles.tooltipDot} style={{ background: "#888888" }} />
          給付費合計：
          <strong className={styles.tooltipValue}>{row.total.toFixed(1)}兆円</strong>
        </div>
      </div>
    </div>
  );
}

export function SocialSecurityTrend() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：兆円</span>
      <ArticleChartCanvas height={420} mobileHeight={340}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 40, right: isMobile ? 70 : 90, bottom: 48, left: 48 }}
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
          colors={({ id }) => colors[id as SeriesId]}
          enableArea={true}
          areaOpacity={0.55}
          lineWidth={1.5}
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
