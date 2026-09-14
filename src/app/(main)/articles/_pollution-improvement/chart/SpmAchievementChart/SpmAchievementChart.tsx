"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import pollutionDataRaw from "@/data/pollution.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import { createAnnotationLayer, formatYearShort } from "@/lib/chart-format";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "./SpmAchievementChart.module.css";

const COLOR_GENERAL = "var(--color-brand, #5bbee4)";
const COLOR_ROADSIDE = "var(--color-brand-dark, #1e7aa8)";

const spmData = pollutionDataRaw.air_spm_achievement_rate;
const generalMap = spmData.general_station;
const roadsideMap = spmData.roadside_station;

const years = Object.keys(generalMap).map(Number).sort((a, b) => a - b);

const CHART_DATA: LineSeries[] = [
  {
    id: "general_station",
    data: years.map((y) => ({ x: y, y: generalMap[String(y) as keyof typeof generalMap] })),
  },
  {
    id: "roadside_station",
    data: years.map((y) => ({ x: y, y: roadsideMap[String(y) as keyof typeof roadsideMap] })),
  },
];

const LABELS: Record<string, string> = {
  general_station: "一般局",
  roadside_station: "自排局（自動車排出ガス測定局）",
};

const COLORS: Record<string, string> = {
  general_station: COLOR_GENERAL,
  roadside_station: COLOR_ROADSIDE,
};

const X_MIN = 1985;
const X_MAX = 2023;
const Y_MIN = 0;
const Y_MAX = 105;

const tickYears = [1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2023];
const yTickValues = [0, 20, 40, 60, 80, 100];

const ANNOTATIONS = [
  {
    year: 2003,
    label: "ディーゼル車規制等",
    labelYOffset: -12,
  },
];

function SeriesEndLabels({
  xScale,
  yScale,
}: LineCustomSvgLayerProps<any>) {
  const lastYear = years[years.length - 1];
  const lastGeneral = generalMap[String(lastYear) as keyof typeof generalMap];
  const lastRoadside = roadsideMap[String(lastYear) as keyof typeof roadsideMap];

  const x = ((xScale as any)(lastYear) as number) + 6;
  // 2023年は両方100%で重なるため、上下にオフセット
  const generalY = (yScale as any)(lastGeneral) as number - 6;
  const roadsideY = (yScale as any)(lastRoadside) as number + 8;

  return (
    <g>
      <text
        x={x}
        y={generalY}
        fontSize={11}
        fontWeight={600}
        fill={COLOR_GENERAL}
        dominantBaseline="middle"
        fontFamily='"Noto Sans JP", sans-serif'
      >
        一般局
      </text>
      <text
        x={x}
        y={roadsideY}
        fontSize={11}
        fontWeight={600}
        fill={COLOR_ROADSIDE}
        dominantBaseline="middle"
        fontFamily='"Noto Sans JP", sans-serif'
      >
        自排局
      </text>
    </g>
  );
}

function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const year = point.data.x as number;
  const generalVal = generalMap[String(year) as keyof typeof generalMap];
  const roadsideVal = roadsideMap[String(year) as keyof typeof roadsideMap];

  if (generalVal === undefined) return null;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{year}年度</span>
      <div className={styles.tooltipRows}>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: COLOR_GENERAL }}
          />
          <span className={styles.tooltipLabel}>一般局：</span>
          <strong className={styles.tooltipValue}>{generalVal}%</strong>
        </div>
        <div className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: COLOR_ROADSIDE }}
          />
          <span className={styles.tooltipLabel}>自排局：</span>
          <strong className={styles.tooltipValue}>{roadsideVal}%</strong>
        </div>
      </div>
    </div>
  );
}

export function SpmAchievementChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：%</span>
      <ArticleChartCanvas height={380} mobileHeight={300}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 32, right: isMobile ? 65 : 85, bottom: 48, left: 48 }}
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
            format: (v) => `${v}%`,
          }}
          colors={({ id }) => COLORS[id as string]}
          enableArea={false}
          lineWidth={2.5}
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
    </div>
  );
}
