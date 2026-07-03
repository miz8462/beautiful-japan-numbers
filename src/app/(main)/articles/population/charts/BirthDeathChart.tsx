"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
import { ResponsiveLine } from "@nivo/line";

const data = [
  {
    id: "出生数",
    data: [
      { x: "2000", y: 119 },
      { x: "2003", y: 112 },
      { x: "2006", y: 109 },
      { x: "2007", y: 109 },
      { x: "2009", y: 107 },
      { x: "2012", y: 103 },
      { x: "2015", y: 101 },
      { x: "2018", y: 92 },
      { x: "2021", y: 81 },
      { x: "2023", y: 73 },
    ],
  },
  {
    id: "死亡数",
    data: [
      { x: "2000", y: 96 },
      { x: "2003", y: 100 },
      { x: "2006", y: 108 },
      { x: "2007", y: 110 },
      { x: "2009", y: 114 },
      { x: "2012", y: 125 },
      { x: "2015", y: 130 },
      { x: "2018", y: 136 },
      { x: "2021", y: 144 },
      { x: "2023", y: 159 },
    ],
  },
];

export default function BirthDeathChart() {
  return (
    <ArticleChartCanvas height={240} mobileHeight={220}>
      <ResponsiveLine
        data={data}
        margin={{ top: 10, right: 20, bottom: 40, left: 48 }}
        xScale={{ type: "linear", min: 2000, max: 2023 }}
        yScale={{ type: "linear", min: 60, max: 180 }}
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
        lineWidth={2}
        pointSize={0}
        pointColor={{ from: "color" }}
        pointBorderWidth={0}
        enableGridX={false}
        gridYValues={[60, 80, 100, 120, 140, 160, 180]}
        theme={{
          background: "transparent",
          grid: { line: { stroke: "#E0E0E0", strokeWidth: 1 } },
          axis: { ticks: { text: { fontSize: 11, fill: "var(--color-text-muted)" } } },
        }}
        colors={["var(--color-brand)", "var(--color-accent)"]}
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
            {point.data.xFormatted}年<br />
            {point.seriesId}：{point.data.yFormatted}万人
          </div>
        )}
        isInteractive={true}
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
                      x={lastPoint.position.x - 30}
                      y={lastPoint.position.y - 12}
                      fontSize={11}
                      fill={"#555555"}
                    >
                      {serie.id}
                    </text>
                  );
                })}
              </>
            );
          },
        ]}
      />
    </ArticleChartCanvas>
  );
}