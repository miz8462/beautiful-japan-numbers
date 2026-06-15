"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { ResponsiveBar } from "@nivo/bar";

const data = [
  { year: "2010", 自然減: -6, 社会増: 2 },
  { year: "2013", 自然減: -19, 社会増: 8 },
  { year: "2016", 自然減: -27, 社会増: 15 },
  { year: "2019", 自然減: -50, 社会増: 18 },
  { year: "2021", 自然減: -62, 社会増: 10 },
  { year: "2023", 自然減: -84, 社会増: 25 },
];

export default function NaturalSocialChart() {
  return (
    <ArticleChartCanvas height={260} mobileHeight={240}>
      <ResponsiveBar
        data={data}
        keys={["社会増", "自然減"]}
        indexBy="year"
        margin={{ top: 10, right: 20, bottom: 40, left: 56 }}
        groupMode="stacked"
        valueScale={{ type: "linear", min: -100, max: 40 }}
        axisBottom={{ tickSize: 0, tickPadding: 10 }}
        axisLeft={{
          tickSize: 0,
          tickPadding: 10,
          tickValues: [-100, -80, -60, -40, -20, 0, 20, 40],
          format: (v) => `${v}万`,
        }}
        gridYValues={[-100, -80, -60, -40, -20, 0, 20, 40]}
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
            whiteSpace: "nowrap",

          }}>
            {indexValue}年<br />
            {id}：{value}万人
          </div>
        )}
        layers={[
          "grid",
          "axes",
          "bars",
          "markers",
          ({ bars }) => {
            const lastYear = "2023";
            const targets = bars.filter((bar) => bar.data.indexValue === lastYear);
            return (
              <>
                {targets.map((bar) => (
                  <text
                    key={bar.key}
                    x={bar.x + bar.width / 2}
                    y={bar.y + bar.height / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontWeight={700}
                    fontSize={14}
                    fill="#FFFFFF"
                  >
                    {String(bar.data.id)}
                  </text>
                ))}
              </>
            );
          },
        ]}
      />
    </ArticleChartCanvas>
  );
}