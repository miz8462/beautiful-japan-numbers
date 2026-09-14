"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import mCurveData from "@/data/female-employment-rate-by-age.json";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { LineCustomSvgLayerProps, LineSeries } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import styles from "../GenderWageGapChart/GenderWageGapChart.module.css";

type Years = 2010 | 2020 | 2025;

type MCurveDatum = { x: string; y: number };
type MCurveLineSeries = LineSeries & {
  id: string;
  data: MCurveDatum[];
};

const YEARS: Years[] = [2010, 2020, 2025];

const colors: Record<number, string> = {
  2010: "color-mix(in srgb, #5bbee4 35%, #94a3b8)",
  2020: "color-mix(in srgb, #5bbee4 70%, #0284c7)",
  2025: "#0284c7",
};

const isUnder70 = (ag: { ageGroup: string }) =>
  ag.ageGroup !== "70～74歳" && ag.ageGroup !== "75歳以上";

const CHART_DATA: MCurveLineSeries[] = YEARS.map((yr) => {
  const item = mCurveData.find((d) => d.year === yr);
  return {
    id: `${yr}年`,
    data:
      item?.ageGroups
        .filter(isUnder70)
        .map((ag) => ({
          x: ag.ageGroup,
          y: ag.employmentRate,
        })) || [],
  };
});

const Y_MIN = 0;
const Y_MAX = 100;
const yTickValues = [0, 20, 40, 60, 80, 100];

function SeriesEndLabels({
  xScale,
  yScale,
}: LineCustomSvgLayerProps<any>) {
  const lastAgeGroup = "65～69歳";

  return (
    <>
      {YEARS.map((yr) => {
        const item = mCurveData.find((d) => d.year === yr);
        const lastVal =
          item?.ageGroups.find((ag) => ag.ageGroup === lastAgeGroup)
            ?.employmentRate || 0;

        const x = ((xScale as any)(lastAgeGroup) as number) + 6;
        const y = (yScale as any)(lastVal) as number;

        return (
          <text
            key={yr}
            x={x}
            y={y}
            fontSize={12}
            fontWeight={yr === 2025 ? 700 : 500}
            fill={colors[yr]}
            dominantBaseline="middle"
            fontFamily='"Noto Sans JP", sans-serif'
          >
            {yr}年
          </text>
        );
      })}
    </>
  );
}

function TooltipContent({ point }: { point: { data: { x: unknown } } }) {
  const ageGroup = point.data.x as string;

  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipYear}>{ageGroup}</span>
      <div className={styles.tooltipRows}>
        {YEARS.map((yr) => {
          const item = mCurveData.find((d) => d.year === yr);
          const ag = item?.ageGroups.find((g) => g.ageGroup === ageGroup);
          if (!ag) return null;

          return (
            <div key={yr} className={styles.tooltipRow}>
              <span
                className={styles.tooltipDot}
                style={{ background: colors[yr] }}
              />
              <span>{yr}年：</span>
              <strong className={styles.tooltipValue}>
                {ag.employmentRate.toFixed(1)}%
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FemaleEmploymentMCurveChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return (
    <div className={styles.wrapper}>
      <span className={styles.unitNote}>単位：%</span>
      <ArticleChartCanvas height={440} mobileHeight={380}>
        <ResponsiveLine
          data={CHART_DATA}
          margin={{ top: 30, right: isMobile ? 65 : 85, bottom: 60, left: 48 }}
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
          colors={({ id }) => {
            const yr = parseInt(id as string);
            return colors[yr] || "#5bbee4";
          }}
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
