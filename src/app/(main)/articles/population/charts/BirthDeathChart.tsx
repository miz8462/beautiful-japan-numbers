"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import { ResponsiveLine } from "@nivo/line";

const data = [
  {
    id: "出生数",
    data: [
      { x: 2000, y: 119 },
      { x: 2003, y: 112 },
      { x: 2006, y: 109 },
      { x: 2007, y: 109 },
      { x: 2009, y: 107 },
      { x: 2012, y: 103 },
      { x: 2015, y: 101 },
      { x: 2018, y: 92 },
      { x: 2021, y: 81 },
      { x: 2023, y: 73 },
    ],
  },
  {
    id: "死亡数",
    data: [
      { x: 2000, y: 96 },
      { x: 2003, y: 100 },
      { x: 2006, y: 108 },
      { x: 2007, y: 110 },
      { x: 2009, y: 114 },
      { x: 2012, y: 125 },
      { x: 2015, y: 130 },
      { x: 2018, y: 136 },
      { x: 2021, y: 144 },
      { x: 2023, y: 159 },
    ],
  },
];

const COLORS = {
  出生数: "var(--color-brand, #5bbee4)",
  死亡数: "var(--color-accent, #c0392b)",
};

export default function BirthDeathChart() {
  return (
    <ArticleChartCanvas height={280} mobileHeight={240}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 64, bottom: 44, left: 48 }}
        xScale={{ type: "linear", min: 2000, max: 2023, nice: false }}
        yScale={{ type: "linear", min: 60, max: 180, nice: false }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: [2000, 2005, 2010, 2015, 2020, 2023],
          format: (v) => formatYearShort(v, v === 2000),
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: [60, 80, 100, 120, 140, 160, 180],
          format: (v) => `${v}万`,
        }}
        lineWidth={2.5}
        pointSize={0}
        enableGridX={false}
        gridYValues={[60, 80, 100, 120, 140, 160, 180]}
        theme={{
          background: "transparent",
          text: {
            fontFamily: "var(--font-data, monospace)",
            fontSize: 11,
            fill: "var(--color-text-muted, #888888)",
          },
          grid: { line: { stroke: "var(--color-border, #e0e0e0)", strokeWidth: 1 } },
          axis: {
            domain: { line: { stroke: "transparent" } },
            ticks: { line: { stroke: "transparent" }, text: { fill: "var(--color-text-muted, #888888)", fontSize: 11 } },
          },
        }}
        colors={({ id }) => COLORS[id as keyof typeof COLORS]}
        useMesh={true}
        tooltip={({ point }) => (
          <div style={{
            background: "#FFFFFF",
            border: "1px solid var(--color-border, #e0e0e0)",
            borderRadius: 4,
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--color-text-primary, #222222)",
            lineHeight: 1.5,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}>
            <strong>{point.data.x}年</strong><br />
            {point.seriesId}：<strong>{Number(point.data.y).toLocaleString()}万人</strong>
          </div>
        )}
        isInteractive={true}
        layers={[
          "grid",
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
                      fill={COLORS[serie.id as keyof typeof COLORS]}
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
        ]}
      />
    </ArticleChartCanvas>
  );
}