"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import ghgDataRaw from "@/data/ghg-emissions.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./SectorEmissionsChart.module.css";

const COLOR_INDUSTRY = "var(--color-brand, #5bbee4)";
const COLOR_TRANSPORT = "var(--color-brand-dark, #1e7aa8)";
const COLOR_COMMERCIAL = "#e67e22";
const COLOR_HOUSEHOLD = "var(--color-brand-second, #f19db5)";
// color-mix between brand and brand-dark for energy transformation
const COLOR_ENERGY = "color-mix(in srgb, var(--color-brand, #5bbee4) 50%, var(--color-brand-dark, #1e7aa8))";

const rawSectors = ghgDataRaw.sector_emissions;
const years = rawSectors.years;

const SECTOR_KEYS = [
  "industry",
  "transport",
  "commercial",
  "household",
  "energy_transformation",
] as const;

type SectorKey = typeof SECTOR_KEYS[number];

const LABELS: Record<SectorKey, string> = {
  industry: "産業部門",
  transport: "運輸部門",
  commercial: "業務その他",
  household: "家庭部門",
  energy_transformation: "エネルギー転換",
};

const COLORS: Record<SectorKey, string> = {
  industry: COLOR_INDUSTRY,
  transport: COLOR_TRANSPORT,
  commercial: COLOR_COMMERCIAL,
  household: COLOR_HOUSEHOLD,
  energy_transformation: COLOR_ENERGY,
};

const CHART_DATA: LineSeries[] = [
  {
    id: "industry",
    data: years.map((y, i) => ({ x: y, y: rawSectors.industry[i] })),
  },
  {
    id: "transport",
    data: years.map((y, i) => ({ x: y, y: rawSectors.transport[i] })),
  },
  {
    id: "commercial",
    data: years.map((y, i) => ({ x: y, y: rawSectors.commercial[i] })),
  },
  {
    id: "household",
    data: years.map((y, i) => ({ x: y, y: rawSectors.household[i] })),
  },
  {
    id: "energy_transformation",
    data: years.map((y, i) => ({ x: y, y: rawSectors.energy_transformation[i] })),
  },
];

const X_MIN = 1990;
const X_MAX = 2024;
const Y_MIN = 0;
const Y_MAX = 550;

const tickYears = [1990, 1995, 2000, 2005, 2010, 2013, 2015, 2020, 2024];
const yTickValues = [0, 100, 200, 300, 400, 500];

function SeriesEndLabels({
  xScale,
  yScale,
}: LineCustomSvgLayerProps<any>) {
  const lastIndex = years.length - 1;
  const lastYear = years[lastIndex];
  const x = ((xScale as any)(lastYear) as number) + 6;

  // 2024 values for vertical positioning
  const lastVals: Record<SectorKey, number> = {
    industry: rawSectors.industry[lastIndex],
    transport: rawSectors.transport[lastIndex],
    commercial: rawSectors.commercial[lastIndex],
    household: rawSectors.household[lastIndex],
    energy_transformation: rawSectors.energy_transformation[lastIndex],
  };

  // Adjust slight overlap between commercial (162.2) and household (146.2)
  const posMap: { key: SectorKey; y: number }[] = [
    { key: "industry", y: (yScale as any)(lastVals.industry) as number },
    { key: "transport", y: (yScale as any)(lastVals.transport) as number },
    { key: "commercial", y: (yScale as any)(lastVals.commercial) as number - 3 },
    { key: "household", y: (yScale as any)(lastVals.household) as number + 5 },
    { key: "energy_transformation", y: (yScale as any)(lastVals.energy_transformation) as number },
  ];

  return (
    <g>
      {posMap.map(({ key, y }) => (
        <text
          key={key}
          x={x}
          y={y}
          fontSize={11}
          fontWeight={600}
          fill={COLORS[key]}
          dominantBaseline="middle"
          fontFamily='"Noto Sans JP", sans-serif'
        >
          {LABELS[key]}
        </text>
      ))}
    </g>
  );
}

function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;
  const idx = years.indexOf(year);
  if (idx === -1) return null;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度（電気・熱配分後）</span>
      <div className={styles.tooltipRows}>
        {SECTOR_KEYS.map((key) => {
          const val = rawSectors[key][idx];
          return (
            <div key={key} className={styles.tooltipRow}>
              <span
                className={styles.tooltipDot}
                style={{ background: COLORS[key] }}
              />
              <span className={styles.tooltipLabel}>{LABELS[key]}：</span>
              <strong className={styles.tooltipValue}>
                {val.toFixed(1)} Mt ({Math.round(val).toLocaleString()} 万t)
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SectorEmissionsChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：Mt-CO2（百万トン）</span>
      <ArticleChartCanvas height={400} mobileHeight={320}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 24, right: isMobile ? 85 : 110, bottom: 48, left: 48 }}
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
            format: (v) => `${v}`,
          }}
          colors={({ id }) => COLORS[id as SectorKey]}
          enableArea={false}
          lineWidth={2.2}
          pointSize={0}
          enableGridX={false}
          gridYValues={yTickValues}
          useMesh={true}
          enableCrosshair={true}
          crosshairType="x"
          tooltip={({ point }) => <TooltipContent point={point} />}
          layers={[
            "grid",
            "axes",
            "lines",
            SeriesEndLabels,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-data)",
              fontSize: 14,
              fill: "var(--color-text-secondary)",
            },
            grid: {
              line: {
                stroke: "var(--color-border)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              },
            },
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

      {/* 各部門のピーク比注釈リスト */}
      <div className={styles.peakNoteList}>
        <div className={styles.peakItem}>
          <span style={{ color: COLORS.industry, fontWeight: 600 }}>● 産業</span>
          <span>1990年ピーク</span>
          <span className={styles.peakBadge}>▲33.9%</span>
        </div>
        <div className={styles.peakItem}>
          <span style={{ color: COLORS.commercial, fontWeight: 600 }}>● 業務</span>
          <span>2013年ピーク</span>
          <span className={styles.peakBadge}>▲31.0%</span>
        </div>
        <div className={styles.peakItem}>
          <span style={{ color: COLORS.household, fontWeight: 600 }}>● 家庭</span>
          <span>2013年ピーク</span>
          <span className={styles.peakBadge}>▲29.9%</span>
        </div>
        <div className={styles.peakItem}>
          <span style={{ color: COLORS.transport, fontWeight: 600 }}>● 運輸</span>
          <span>2001年ピーク</span>
          <span className={styles.peakBadge}>▲28.8%</span>
        </div>
        <div className={styles.peakItem}>
          <span style={{ color: COLORS.energy_transformation, fontWeight: 600 }}>● ｴﾈ転換</span>
          <span>2012年ピーク</span>
          <span className={styles.peakBadge}>▲26.6%</span>
        </div>
      </div>
    </div>
  );
}
