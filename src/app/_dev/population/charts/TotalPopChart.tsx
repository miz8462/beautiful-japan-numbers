"use client";

import { ResponsiveLine } from "@nivo/line";

const data = [
  {
    id: "総人口",
    data: [
      { x: "1980", y: 11706 },
      { x: "1985", y: 12105 },
      { x: "1990", y: 12361 },
      { x: "1995", y: 12557 },
      { x: "2000", y: 12693 },
      { x: "2005", y: 12777 },
      { x: "2008", y: 12808 },
      { x: "2010", y: 12806 },
      { x: "2015", y: 12709 },
      { x: "2020", y: 12615 },
      { x: "2024", y: 12388 },
    ],
  },
];

export default function TotalPopChart() {
  return (
    <div style={{ height: 260 }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 10, right: 20, bottom: 40, left: 56 }}
        xScale={{ type: "point" }}
        yScale={{ type: "linear", min: 11000, max: 13000 }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          format: (v) => `${(v / 10000).toFixed(1)}億`,
        }}
        colors={["#60a5fa"]}
        lineWidth={2}
        pointSize={0}
        pointBorderWidth={0}
        enableGridX={false}
        gridYValues={5}
        theme={{
          background: "transparent",
          grid: { line: { stroke: "#e0e0e0", strokeWidth: 1 } },
          axis: { ticks: { text: { fontSize: 11, fill: "#999" } } },
        }}
        areaOpacity={0.05}
        useMesh={true}
        tooltip={({ point }) => (
          <div style={{
            background: "#fff",
            border: "0.5px solid #ddd",
            padding: "6px 10px",
            fontSize: 12,
          }}>
            {point.data.xFormatted}年：{Number(point.data.y).toLocaleString()}万人
          </div>
        )}
        isInteractive={true}
      />
    </div>
  );
}