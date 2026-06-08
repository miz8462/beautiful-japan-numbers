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
        // スケール設定。時系列なのでlinear
        xScale={{ type: "linear", min: 1980, max: 2024 }}
        yScale={{ type: "linear", min: 11000, max: 13000 }}
        // 軸設定
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          tickRotation: 0,
        }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: [11000, 12000, 13000],
          format: (v) => `${(v / 10000).toFixed(1)}億`,
        }}
        layers={[
          "grid",
          "axes",
          "lines",
          "mesh",
          // ピークをドットで表現
          ({ points }) => {
            const peak = points.find((p) => String(p.data.x) === "2008");
            if (!peak) return null;
            return (
              <circle
                cx={peak.x}
                cy={peak.y}
                r={4}
                fill="#F06449"
              />
            );
          },
        ]}
        colors={["#5BBEE4"]}
        lineWidth={2}
        pointSize={0}
        pointBorderWidth={0}
        enableGridX={false}
        gridYValues={[11000, 12000, 13000]}
        theme={{
          background: "transparent",
          grid: { line: { stroke: "#E0E0E0", strokeWidth: 1 } },
          axis: { ticks: { text: { fontSize: 11, fill: "#888888" } } },
        }}
        areaOpacity={0.05}
        useMesh={true}
        tooltip={({ point }) => (
          <div style={{
            background: "#FFFFFF",
            border: "1px solid #E0E0E0",
            padding: "6px 10px",
            fontSize: 12,
            color: "#1A1A1A",
            lineHeight: 1.6,
            whiteSpace: "nowrap",
          }}>
            <div>{point.data.xFormatted}年</div>
            <div>{Number(point.data.y).toLocaleString()}万人</div>
          </div>
        )}
        isInteractive={true}
      />
    </div>
  );
}