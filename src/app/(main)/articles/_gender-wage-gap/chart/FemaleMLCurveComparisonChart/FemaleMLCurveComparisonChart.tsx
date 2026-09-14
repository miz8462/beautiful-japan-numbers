"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import mCurveData from "@/data/female-employment-rate-by-age.json";
import lCurveData from "@/data/female-nonregular-by-age.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "../GenderWageGapChart/GenderWageGapChart.module.css";

type SeriesId = "employmentRate" | "regularRatio";

type ComparisonDatum = { x: string; y: number | null };
type ComparisonLineSeries = LineSeries & {
  id: SeriesId;
  data: ComparisonDatum[];
};

const colors: Record<SeriesId, string> = {
  employmentRate: "#5bbee4",
  regularRatio: "#e67e22",
};

const labels: Record<SeriesId, string> = {
  employmentRate: "就業率（M字カーブ）",
  regularRatio: "正規雇用比率（L字カーブ）",
};

const item2025M = mCurveData.find((d) => d.year === 2025);
const item2025L = lCurveData.find((d) => d.year === 2025);

const isUnder70 = (ag: { ageGroup: string }) =>
  ag.ageGroup !== "70～74歳" && ag.ageGroup !== "75歳以上";

const CHART_DATA: ComparisonLineSeries[] = [
  {
    id: "employmentRate",
    data:
      item2025M?.ageGroups
        .filter(isUnder70)
        .map((ag) => ({
          x: ag.ageGroup,
          y: ag.employmentRate,
        })) || [],
  },
  {
    id: "regularRatio",
    data:
      item2025L?.ageGroups
        .filter((ag) => ag.regularRatio !== null && isUnder70(ag))
        .map((ag) => ({
          x: ag.ageGroup,
          y: ag.regularRatio as number,
        })) || [],
  },
];

const Y_MIN = 0;
const Y_MAX = 100;
const yTickValues = [0, 20, 40, 60, 80, 100];

function SeriesEndLabels({
  xScale,
  yScale,
}: LineCustomSvgLayerProps<any>) {
  const lastAgeGroup = "65～69歳";
  const mVal = item2025M?.ageGroups.find((ag) => ag.ageGroup === lastAgeGroup)?.employmentRate || 0;
  const lVal = item2025L?.ageGroups.find((ag) => ag.ageGroup === lastAgeGroup)?.regularRatio || 0;

  const x = ((xScale as any)(lastAgeGroup) as number) + 6;
  const mY = (yScale as any)(mVal) as number;
  const lY = (yScale as any)(lVal) as number;

  return (
    <>
      <text
        x={x}
        y={mY - 6}
        fontSize={12}
        fontWeight={700}
        fill={colors.employmentRate}
        dominantBaseline="middle"
        fontFamily='"Noto Sans JP", sans-serif'
      >
        {labels.employmentRate}
      </text>
      <text
        x={x}
        y={lY + 6}
        fontSize={12}
        fontWeight={700}
        fill={colors.regularRatio}
        dominantBaseline="middle"
        fontFamily='"Noto Sans JP", sans-serif'
      >
        {labels.regularRatio}
      </text>
    </>
  );
}

function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const ageGroup = point.data.x as string;
  const mAg = item2025M?.ageGroups.find((g) => g.ageGroup === ageGroup);
  const lAg = item2025L?.ageGroups.find((g) => g.ageGroup === ageGroup);

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{ageGroup}（2025年）</span>
      <div className={styles.tooltipRows}>
        {mAg && (
          <div className={styles.tooltipRow}>
            <span
              className={styles.tooltipDot}
              style={{ background: colors.employmentRate }}
            />
            <span>{labels.employmentRate}：</span>
            <strong className={styles.tooltipValue}>
              {mAg.employmentRate.toFixed(1)}%
            </strong>
          </div>
        )}
        {lAg && lAg.regularRatio !== null && (
          <div className={styles.tooltipRow}>
            <span
              className={styles.tooltipDot}
              style={{ background: colors.regularRatio }}
            />
            <span>{labels.regularRatio}：</span>
            <strong className={styles.tooltipValue}>
              {lAg.regularRatio.toFixed(1)}%
            </strong>
          </div>
        )}
      </div>
    </div>
  );
}

export function FemaleMLCurveComparisonChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：%</span>
      <ArticleChartCanvas height={440} mobileHeight={380}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 30, right: isMobile ? 130 : 170, bottom: 60, left: 48 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: Y_MIN,
            max: Y_MAX,
            nice: false,
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: isMobile ? -45 : 0,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 10,
            tickValues: yTickValues,
            format: (v) => `${v}%`,
          }}
          colors={({ id }) => colors[id as SeriesId]}
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
            "axes",
            "lines",
            SeriesEndLabels,
            "mesh",
          ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
          theme={{
            background: "transparent",
            text: {
              fontFamily: "var(--font-data)",
              fontSize: 12,
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
                text: { fill: "var(--color-text-secondary)", fontSize: 11 },
              },
            },
          }}
        />
      </ArticleChartCanvas>
    </div>
  );
}
