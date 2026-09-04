"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import { ResponsiveLine } from "@nivo/line";

const data = [
  {
    id: "総人口",
    data: [
      { x: 1980, y: 11706 },
      { x: 1985, y: 12105 },
      { x: 1990, y: 12361 },
      { x: 1995, y: 12557 },
      { x: 2000, y: 12693 },
      { x: 2005, y: 12777 },
      { x: 2008, y: 12808 },
      { x: 2010, y: 12806 },
      { x: 2015, y: 12709 },
      { x: 2020, y: 12615 },
      { x: 2024, y: 12388 },
    ],
  },
];

export default function TotalPopChart() {
  return (
    <ArticleChartCanvas height={280} mobileHeight={240}>
      <ResponsiveLine
        data={data}
        margin={{ top: 20, right: 60, bottom: 44, left: 56 }}
        xScale={{ type: "linear", min: 1980, max: 2024, nice: false }}
        yScale={{ type: "linear", min: 11000, max: 13000, nice: false }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: [1980, 1990, 2000, 2010, 2020, 2024],
          format: (v) => formatYearShort(v, v === 1980),
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: [11000, 11500, 12000, 12500, 13000],
          format: (v) => `${(v / 10000).toFixed(1)}億`,
        }}
        layers={[
          "grid",
          "axes",
          "lines",
          // ピーク（2008年）のアノテーションと最新ラベル
          ({ points, xScale, yScale }) => {
            const peak = points.find((p) => p.data.x === 2008);
            const latest = points.find((p) => p.data.x === 2024);
            return (
              <g>
                {peak && (
                  <>
                    <circle cx={peak.x} cy={peak.y} r={4.5} fill="var(--color-accent, #c0392b)" />
                    <text
                      x={peak.x}
                      y={peak.y - 12}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={700}
                      fill="var(--color-accent, #c0392b)"
                      fontFamily="var(--font-body)"
                    >
                      ピーク（1億2,808万人）
                    </text>
                  </>
                )}
                {latest && (
                  <text
                    x={latest.x + 8}
                    y={latest.y + 4}
                    fontSize={11}
                    fontWeight={700}
                    fill="var(--color-brand, #5bbee4)"
                    fontFamily="var(--font-body)"
                  >
                    1億2,388万
                  </text>
                )}
              </g>
            );
          },
          "mesh",
        ]}
        colors={["var(--color-brand, #5bbee4)"]}
        lineWidth={2.5}
        pointSize={0}
        enableGridX={false}
        gridYValues={[11000, 11500, 12000, 12500, 13000]}
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
            総人口：<strong>{Number(point.data.y).toLocaleString()}万人</strong>
          </div>
        )}
        isInteractive={true}
      />
    </ArticleChartCanvas>
  );
}