"use client";

import { ArticleChartCanvas } from "@/components/article/article-chart";
import { formatYearShort } from "@/lib/chart-format";
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
    <ArticleChartCanvas height={280} mobileHeight={240}>
      <ResponsiveBar
        data={data}
        keys={["社会増", "自然減"]}
        indexBy="year"
        margin={{ top: 16, right: 20, bottom: 40, left: 56 }}
        groupMode="stacked"
        valueScale={{ type: "linear", min: -100, max: 40, nice: false }}
        axisBottom={{
          tickSize: 0,
          tickPadding: 10,
          format: (v) => formatYearShort(v, v === "2010"),
        }}
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
            lineStyle: { stroke: "var(--color-border, #e0e0e0)", strokeWidth: 1.5 },
          },
        ]}
        colors={["var(--color-brand, #5bbee4)", "var(--color-accent, #c0392b)"]}
        borderRadius={2}
        enableLabel={false}
        enableGridX={false}
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
        tooltip={({ id, value, indexValue }) => (
          <div style={{
            background: "#FFFFFF",
            border: "1px solid var(--color-border, #e0e0e0)",
            padding: "8px 12px",
            fontSize: 12,
            color: "var(--color-text-primary, #222222)",
            borderRadius: 4,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}>
            <strong>{indexValue}年</strong><br />
            {id}：<strong>{value}万人</strong>
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
              <g>
                {targets.map((bar) => (
                  <text
                    key={bar.key}
                    x={bar.x + bar.width / 2}
                    y={bar.y + bar.height / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontWeight={700}
                    fontSize={12}
                    fill="#FFFFFF"
                    fontFamily="var(--font-body)"
                  >
                    {String(bar.data.id)}
                  </text>
                ))}
              </g>
            );
          },
        ]}
      />
    </ArticleChartCanvas>
  );
}