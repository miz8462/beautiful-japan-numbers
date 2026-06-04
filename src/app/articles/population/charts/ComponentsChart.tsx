"use client";

import { ResponsiveBar } from "@nivo/bar";

const data = [
  { year: "2010", 自然増減: -6, 社会増減: 2 },
  { year: "2013", 自然増減: -19, 社会増減: 8 },
  { year: "2016", 自然増減: -27, 社会増減: 15 },
  { year: "2019", 自然増減: -50, 社会増減: 18 },
  { year: "2021", 自然増減: -62, 社会増減: 10 },
  { year: "2023", 自然増減: -84, 社会増減: 25 },
];

export default function ComponentsChart() {
  return (
    <div style={{ height: 260 }}>
      <ResponsiveBar
        data={data}
        keys={["社会増減", "自然増減"]}
        indexBy="year"
        margin={{ top: 10, right: 20, bottom: 40, left: 56 }}
        groupMode="stacked"
        valueScale={{ type: "linear", min: -100, max: 40 }}
        axisBottom={{ tickSize: 0, tickPadding: 10 }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          format: (v) => `${v}万`,
        }}
        markers={[
          {
            axis: "y",
            value: 0,
            lineStyle: { stroke: "#AAAAAA", strokeWidth: 1 },
          },
        ]}
        colors={["#2E9E6E", "#F06449"]}
        borderRadius={2}
        enableLabel={false}
        enableGridX={false}
        theme={{
          background: "transparent",
          grid: { line: { stroke: "#E0E0E0", strokeWidth: 1 } },
          axis: { ticks: { text: { fontSize: 11, fill: "#888888" } } },
        }}
        tooltip={({ id, value, indexValue }) => (
          <div style={{
            background: "#FFFFFF",
            border: "1px solid #E0E0E0",
            padding: "6px 10px",
            fontSize: 12,
            color: "#1A1A1A",
            lineHeight: 1.6,
          }}>
            {indexValue}年　{id}：{value}万人
          </div>
        )}
        legends={[
          {
            dataFrom: "keys",
            anchor: "top-right",
            direction: "row",
            itemWidth: 68,
            itemHeight: 16,
            symbolSize: 8,
            symbolShape: "square",
            itemsSpacing: 8,
            translateY: -8,
          },
        ]}
      />
    </div>
  );
}