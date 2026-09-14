"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import flat35DataRaw from "@/data/flat35_rate_full_2003_2026.json";
import postalDataRaw from "@/data/postal_ordinary_deposit_pre2007.json";
import yuchoDataRaw from "@/data/yucho_ordinary_deposit_post2007.json";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./HousingDepositRateChart.module.css";

type SeriesId = "flat35_max" | "flat35_min" | "deposit";

type ChartLineSeries = LineSeries & {
  id: SeriesId;
  color: string;
  data: { x: number; y: number | null }[];
};

const COLOR_BRAND = "var(--color-brand)";
const COLOR_BRAND_DARK = "var(--color-brand-dark)";

const X_MIN = 1996;
const X_MAX = 2026;
const Y_MIN = 0;
const Y_MAX = 6.0;

function parseDateToYear(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  const m = month - 1 + (day ? (day - 1) / 30 : 0);
  return year + m / 12;
}

// 1. Process flat35 data
// flat35CleanFull: maxPercent は常に数値、minPercent は null の場合あり
const flat35CleanFull = flat35DataRaw.filter(
  (d) => d.maxPercent !== null
) as {
  yearMonth: string;
  maxPercent: number;
  minPercent: number | null;
}[];

// エリア描画・下限ライン用: maxPercent・minPercent 両方数値のみ
const flat35Clean = flat35CleanFull.filter(
  (d) => d.minPercent !== null
) as {
  yearMonth: string;
  maxPercent: number;
  minPercent: number;
}[];

// 2. Process deposit data
const depositRates: { dateStr: string; rate: number }[] = [];
postalDataRaw.forEach((d) => {
  depositRates.push({ dateStr: d.effectiveDate, rate: d.ordinaryDepositRatePercent });
});
yuchoDataRaw.forEach((d) => {
  depositRates.push({ dateStr: d.effectiveDate, rate: d.ordinaryDepositRatePercent });
});
depositRates.sort((a, b) => a.dateStr.localeCompare(b.dateStr));

const depositPoints: { x: number; y: number }[] = [];
for (let i = 0; i < depositRates.length; i++) {
  const current = depositRates[i];
  const year = parseDateToYear(current.dateStr);
  if (i > 0) {
    const prev = depositRates[i - 1];
    depositPoints.push({ x: year - 0.0001, y: prev.rate });
  } else {
    depositPoints.push({ x: 1996, y: current.rate });
  }
  depositPoints.push({ x: year, y: current.rate });
}
depositPoints.push({ x: 2026, y: depositRates[depositRates.length - 1].rate });

const CHART_DATA: ChartLineSeries[] = [
  {
    id: "flat35_max",
    color: COLOR_BRAND,
    // 上限ラインは全データ（minPercentがnullの月も含む）
    data: flat35CleanFull.map((d) => ({
      x: parseDateToYear(d.yearMonth),
      y: d.maxPercent,
    })),
  },
  {
    id: "flat35_min",
    color: COLOR_BRAND,
    // 下限ラインはminPercentがnullの点でラインが途切れるよう null を含める
    data: flat35CleanFull.map((d) => ({
      x: parseDateToYear(d.yearMonth),
      y: d.minPercent,
    })),
  },
  {
    id: "deposit",
    color: COLOR_BRAND_DARK,
    data: depositPoints,
  },
];

const tickYears = [1996, 2000, 2005, 2010, 2015, 2020, 2026];
const yTickValues = [0, 1, 2, 3, 4, 5, 6];

const nivoTheme = {
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
};

// Custom layer to draw Flat35 area range band
function Flat35AreaLayer({ xScale, yScale }: LineCustomSvgLayerProps<any>) {
  const points = flat35Clean.map((d) => {
    const xVal = parseDateToYear(d.yearMonth);
    return {
      x: (xScale as any)(xVal) as number,
      yMax: (yScale as any)(d.maxPercent) as number,
      yMin: (yScale as any)(d.minPercent) as number,
    };
  });

  if (points.length === 0) return null;

  const topPath = points.map((p) => `${p.x},${p.yMax}`).join(" L ");
  const bottomPath = [...points].reverse().map((p) => `${p.x},${p.yMin}`).join(" L ");
  const pathData = `M ${topPath} L ${bottomPath} Z`;

  return (
    <path
      d={pathData}
      fill={COLOR_BRAND}
      opacity={0.15}
      stroke="none"
    />
  );
}

function EndLabel({
  series,
  xScale,
  yScale,
}: LineCustomSvgLayerProps<any>) {
  return (
    <>
      {series.map((s) => {
        // y が null のポイントを除いた最後のポイントを探す
        const validData = s.data.filter((p: any) => p.data.y !== null);
        const last = validData.at(-1);
        if (!last) return null;
        let label = "";
        let color = "";
        let offset = 0;
        if (s.id === "flat35_max") {
          label = "フラット35 (上限)";
          color = COLOR_BRAND;
          offset = -6;
        } else if (s.id === "flat35_min") {
          label = "フラット35 (下限)";
          color = COLOR_BRAND;
          offset = 6;
        } else if (s.id === "deposit") {
          label = "通常預貯金金利";
          color = COLOR_BRAND_DARK;
        } else {
          return null;
        }

        return (
          <text
            key={s.id}
            x={((xScale as any)(last.data.x) as number) + 6}
            y={((yScale as any)(last.data.y) as number) + offset}
            fontSize={10}
            fontWeight={600}
            fill={color}
            dominantBaseline="middle"
            fontFamily='"Noto Sans JP", "游ゴシック体", sans-serif'
          >
            {label}
          </text>
        );
      })}
    </>
  );
}

function TooltipContent({
  point,
}: {
  point: { data: { x: unknown; y: unknown }; serieId: unknown };
}) {
  const yearDecimal = point.data.x as number;
  const rate = point.data.y as number;
  const year = Math.floor(yearDecimal);
  const month = Math.round((yearDecimal - year) * 12) + 1;
  const monthStr = month > 0 && month <= 12 ? `${month}月` : "";

  let name = "";
  let color = "";
  if (point.serieId === "flat35_max") {
    name = "フラット35 (上限)";
    color = COLOR_BRAND;
  } else if (point.serieId === "flat35_min") {
    name = "フラット35 (下限)";
    color = COLOR_BRAND;
  } else if (point.serieId === "deposit") {
    name = "通常預貯金金利";
    color = COLOR_BRAND_DARK;
  }

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>
        {year}年{monthStr}
      </span>
      <span className={styles.tooltipRow}>
        <span className={styles.tooltipDot} style={{ background: color }} />
        {name}：
        <strong className={styles.tooltipValue}>
          {rate.toLocaleString("ja-JP", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3,
          })}
          %
        </strong>
      </span>
    </div>
  );
}

export function HousingDepositRateChart() {
  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：%</span>
      <ArticleChartCanvas height={380} mobileHeight={320}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 16, right: 120, bottom: 48, left: 48 }}
          xScale={{ type: "linear", min: X_MIN, max: X_MAX, nice: false }}
          yScale={{ type: "linear", min: Y_MIN, max: Y_MAX, nice: false }}
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
            Flat35AreaLayer,
            "axes",
            "lines",
            EndLabel,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          colors={CHART_DATA.map((s) => s.color)}
          lineWidth={2}
          pointSize={0}
          pointBorderWidth={0}
          enableGridX={false}
          gridYValues={yTickValues}
          theme={nivoTheme as Parameters<typeof ResponsiveLine>[0]["theme"]}
          useMesh={true}
          enableCrosshair={true}
          tooltip={({ point }) => <TooltipContent point={point as any} />}
          isInteractive={true}
        />
      </ArticleChartCanvas>
    </div>
  );
}
