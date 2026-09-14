"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort, createAnnotationLayer } from "@/lib/chart-format";
import { useMediaQuery } from "@/hooks/use-media-query";
import turnoutData from "@/data/voter-turnout.json";
import { ResponsiveLine } from "@nivo/line";

type TurnoutKey = "overall" | "age10s" | "age20s" | "age60s";

const SERIES: { id: string; key: TurnoutKey; color: string }[] = [
  { id: "全体", key: "overall", color: "var(--color-text-muted, #888888)" },
  { id: "10代", key: "age10s", color: "var(--color-brand, #5bbee4)" },
  { id: "20代", key: "age20s", color: "var(--color-accent, #c0392b)" },
  { id: "60代", key: "age60s", color: "var(--color-palette-green, #2e9e6e)" },
];

const data = SERIES.map(({ id, key, color }) => ({
  id,
  color,
  data: turnoutData.elections
    .filter((election) => election[key] !== null)
    .map((election) => ({
      x: election.year,
      y: election[key] as number,
      kai: election.kai,
    })),
}));

const ANNOTATIONS = [
  { year: 1967, label: "基準年(74%)", labelYOffset: -10 },
  { year: 2014, label: "過去最低(52.7%)", labelYOffset: -22 },
  { year: 2016, label: "18歳選挙権施行", labelYOffset: -10 },
];

const COLOR_MAP: Record<string, string> = {
  全体: "var(--color-text-muted, #888888)",
  "10代": "var(--color-brand, #5bbee4)",
  "20代": "var(--color-accent, #c0392b)",
  "60代": "var(--color-palette-green, #2e9e6e)",
};

export default function TurnoutLineChart() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const AnnotationLayer = createAnnotationLayer(ANNOTATIONS, isMobile);

  return (
    <ArticleChartCanvas height={420} mobileHeight={340}>
      <ResponsiveLine
        data={data}
        margin={{ top: 28, right: isMobile ? 55 : 70, bottom: 52, left: 48 }}
        xScale={{ type: "linear", min: 1967, max: 2024, nice: false }}
        yScale={{ type: "linear", min: 30, max: 90, nice: false }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: [1967, 1975, 1985, 1995, 2005, 2015, 2024],
          format: (v) => formatYearShort(v, v === 1967),
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: [30, 45, 60, 75, 90],
          format: (value) => `${value}%`,
        }}
        colors={({ id }) => COLOR_MAP[id as string] || "var(--color-brand)"}
        lineWidth={2.5}
        enableGridX={false}
        gridYValues={[30, 45, 60, 75, 90]}
        useMesh={true}
        layers={[
          "grid",
          AnnotationLayer,
          "axes",
          "lines",
          ({ series }) => {
            return (
              <g>
                {series.map((serie) => {
                  const lastPoint = serie.data[serie.data.length - 1];
                  return (
                    <text
                      key={serie.id}
                      x={lastPoint.position.x + 8}
                      y={lastPoint.position.y + 4}
                      fontSize={11}
                      fontWeight={700}
                      fill={serie.color}
                      fontFamily="var(--font-body)"
                    >
                      {serie.id}
                    </text>
                  );
                })}
              </g>
            );
          },
          "mesh",
        ] as Parameters<typeof ResponsiveLine>[0]["layers"]}
        theme={{
          background: "transparent",
          text: {
            fontFamily: "var(--font-data, monospace)",
            fontSize: 12,
            fill: "var(--color-text-muted, #888888)",
          },
          grid: { line: { stroke: "var(--color-border, #e0e0e0)", strokeWidth: 1 } },
          axis: {
            domain: { line: { stroke: "transparent" } },
            ticks: { line: { stroke: "transparent" }, text: { fill: "var(--color-text-muted, #888888)", fontSize: 11 } },
          },
        }}
        tooltip={({ point }) => (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--color-border, #e0e0e0)",
              borderRadius: 4,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
              color: "var(--color-text-primary, #222222)",
              fontSize: 12,
              lineHeight: 1.6,
              padding: "8px 12px",
              whiteSpace: "nowrap",
            }}
          >
            <strong style={{ color: point.seriesColor }}>{point.seriesId}</strong>（{String(point.data.x)}年 第{(point.data as { kai?: number }).kai}回）<br />
            投票率：<strong>{Number(point.data.y).toFixed(2)}%</strong>
          </div>
        )}
        isInteractive={true}
      />
    </ArticleChartCanvas>
  );
}
