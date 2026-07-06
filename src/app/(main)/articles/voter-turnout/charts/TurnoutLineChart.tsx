"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import turnoutData from "@/data/voter-turnout.json";
import { ResponsiveLine } from "@nivo/line";

type TurnoutKey = "overall" | "age10s" | "age20s" | "age60s";

const SERIES: { id: string; key: TurnoutKey; color: string }[] = [
  { id: "全体", key: "overall", color: "#AAAAAA" },
  { id: "10代", key: "age10s", color: "#5BBEE4" },
  { id: "20代", key: "age20s", color: "#F06449" },
  { id: "60代", key: "age60s", color: "#2E9E6E" },
];
// 

const data = SERIES.map(({ id, key, color }) => ({
  id,
  color,
  data: turnoutData.elections
    .filter((election) => election[key] !== null)
    .map((election) => ({
      x: election.year,
      y: election[key],
      kai: election.kai,
    })),
}));

export default function TurnoutLineChart() {
  return (
    <ArticleChartCanvas height={420} mobileHeight={340}>
      <ResponsiveLine
        data={data}
        margin={{ top: 18, right: 36, bottom: 52, left: 48 }}
        xScale={{ type: "linear", min: 1967, max: 2024 }}
        yScale={{ type: "linear", min: 30, max: 90 }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: [1970, 1980, 1990, 2000, 2010, 2020],
          format: (value) => `${value}`,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: [30, 45, 60, 75, 90],
          format: (value) => `${value}%`,
        }}
        colors={(serie) => String(serie.color)}
        lineWidth={2.5}
        enableGridX={false}
        gridYValues={[30, 45, 60, 75, 90]}
        useMesh={true}
        layers={[
          "grid",
          "axes",
          "lines",
          "mesh",
          ({ series }) => {
            return (
              <>
                {series.map((serie) => {
                  const lastPoint = serie.data[serie.data.length - 1];
                  return (
                    <text
                      key={serie.id}
                      x={lastPoint.position.x + 8}
                      y={lastPoint.position.y + 3}
                      fontSize={11}
                      fill="#555555"
                    >
                      {serie.id}
                    </text>
                  );
                })}
              </>
            );
          },
        ]}
        theme={{
          background: "transparent",
          text: {
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fill: "#555555",
          },
          grid: { line: { stroke: "#E0E0E0", strokeWidth: 1 } },
          axis: {
            domain: { line: { stroke: "transparent" } },
            ticks: { line: { stroke: "transparent" }, text: { fill: "#888888" } },
          },
          legends: {
            text: {
              fontSize: 12,
              fill: "#555555",
            },
          },
        }}
        tooltip={({ point }) => (
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E0E0E0",
              borderRadius: 4,
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
              color: "#222222",
              fontSize: 12,
              lineHeight: 1.6,
              padding: "8px 10px",
              whiteSpace: "nowrap",
            }}
          >
            <strong style={{ color: point.seriesColor }}>{point.seriesId}</strong><br />
            {Number(point.data.y).toFixed(2)}%
          </div>
        )}
        isInteractive={true}
      />
    </ArticleChartCanvas>
  );
}
